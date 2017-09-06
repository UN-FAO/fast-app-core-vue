import Formio from 'modules/Formio/api/Formio'
import { Toast } from 'quasar'
import * as Database from 'database/Database'
import SyncHelper from 'database/helpers/SyncHelper'
import _ from 'lodash'
import moment from 'moment'
import Auth from 'modules/Auth/api/Auth'
import Connection from 'modules/Wrappers/Connection'
import LocalSubmission from 'database/collections/scopes/LocalSubmission'
import FormioJS from 'formiojs'

const actions = {

  async updateLocalResource ({ collection, label, data }) {
    console.log('updateing', data, collection, label)
    var formio = new FormioJS('https://' + data.appName + '.form.io')
    let isOnline = Connection.isOnline()
    const DB = await Database.get()

    let localResources = await DB[collection].find().exec()
    let remoteResources = isOnline ? await Formio[collection](data.appName) : []

    if (collection === 'forms') {
      remoteResources = isOnline ? await formio.loadForms() : []
    }
    
    let sync = SyncHelper.offlineOnlineSync({
      collection,
      LocalResults: localResources,
      OnlineResults: remoteResources,
      isOnline: isOnline
    })
    // await DB.forms.remove();
    // For every new or updated entry
    _.forEach(sync, async function (res, key) {
      let localRes = await DB[collection].find().where('data._id').eq(res._id).exec()
      // remove local duplicated or updated entries
      _.forEach(localRes, function (local) {
        local.remove()
      })
      // Insery the new or updated entry
      DB[collection].insert({
        data: res
      })
    })

    if (sync.length > 0) {
      Toast.create.positive({ html: sync.length + ' ' + label + ' were updated' })
    } else {
      // Toast.create.info({html: 'Local forms up to date'})
    }
  },

  /**
   * [getResources description]
   * @param  {[type]} options.commit [description]
   * @param  {[type]} projectName    [description]
   * @return {[type]}                [description]
   */
  async getResources ({ commit }, data) {
    let promises = [
      actions.getForms({ commit }, data)
    ]

    if (Auth.check()) {
      promises.push(actions.getUsers({ commit }, data))
    }
    await Promise.all(promises)
  },

  /**
   * [getUsers description]
   * @param  {[type]} options.commit [description]
   * @param  {[type]} projectName    [description]
   * @return {[type]}                [description]
   */
  async getUsers ({ commit }, data) {
    actions.updateLocalResource({
      data,
      collection: 'users',
      label: 'users'
    })
  },

  /**
   * [getForms description]
   * @param  {[type]} options.commit [description]
   * @param  {[type]} projectName    [description]
   * @return {[type]}                [description]
   */
  async getForms ({ commit }, data) {
    actions.updateLocalResource({
      data,
      collection: 'forms',
      label: 'forms'
    })
  },

  /**
   * [getSubmissions description]
   * @param  {[type]} options.commit [description]
   * @param  {[type]} projectName    [description]
   * @return {[type]}                [description]
   */
  async getSubmissions ({ commit }, { currentForm, User }) {
    console.log('GetSubmission - Actions.js')
    FormioJS.setToken(Auth.user().x_jwt_token)
    const DB = await Database.get()
    let isOnline = Connection.isOnline()
    
    let formUrl = 'https://' + currentForm.data.machineName.substring(0, currentForm.data.machineName.indexOf(':')) + '.form.io/' + currentForm.data.name
    
    let formio = new FormioJS(formUrl)

    let localUnSyncSubmissions = LocalSubmission.offline(User.id, currentForm.data.name)

    console.log('GetSubmission - Actions.js ,localUnSyncSubmissions', localUnSyncSubmissions)
    
    let remoteSubmissions = (isOnline && localUnSyncSubmissions.length === 0) ? await formio.loadSubmissions() : []

    _.map(remoteSubmissions, function (o) {
      o.formio = formio
    })
    
    console.log('GetSubmission - Actions.js ,Remote Submissions', remoteSubmissions)
    
    let localSubmissions = LocalSubmission.stored(User.id, currentForm.data.name)
      
    console.log('GetSubmission - Actions.js ,localSubmissions', localSubmissions)

    var Localresult = _.unionBy(localSubmissions, localUnSyncSubmissions, '_id')
    let sync = SyncHelper.offlineOnlineSync({
      LocalResults: Localresult,
      OnlineResults: remoteSubmissions,
      isOnline: isOnline
    })
    console.log('GetSubmission - Actions.js ,sync', sync)
    // await DB.submissions.remove();
    // For every new or updated entry
    _.forEach(sync, async function (submission, key) {
      let localSubmissions = await DB.submissions.find().where('data._id').eq(submission._id).exec()
      // remove local duplicated or updated entries
      _.forEach(localSubmissions, function (local) {
        local.remove()
      })
      // Inser the new or updated entry
      DB.submissions.insert({
        data: submission
      })
    })
    if (sync.length > 0) {
      Toast.create.positive({ html: sync.length + ' Submissions were updated' })
    } else {
      // Toast.create.info({html: 'Submissions are up to date'})
    }
  },
  /**
   * [addSubmission description]
   * @param {[type]} options.commit [description]
   * @param {[type]} currentForm    [description]
   */
  async addSubmission ({ commit }, { formSubmission, formio, User }) {
    const DB = await Database.get()
    console.log('formSubmission from inside the function => ', formSubmission)
    let submission = formSubmission
    submission.sync = false
    submission.user_email = User.email
    submission.formio = formio
    submission.created = moment().format()
    submission = SyncHelper.deleteNulls(submission)
    console.log('creating the submission', submission)
    if (formSubmission._id) {
      submission.type = 'update'
      let localSubmission = await LocalSubmission.get(formSubmission._id)
      console.log('updating local', submission)
      await localSubmission.update({
        $set: {
          data: submission
        }
      })
      return submission
    }
    console.log('Creating new', submission)
    await DB.submissions.insert({
      data: submission
    })
    return submission
  },

  /**
   * [sendOfflineData description]
   * @param  {[type]} options.commit     [description]
   * @param  {[type]} offlineSubmissions [description]
   * @return {[type]}                    [description]
   */
  async sendOfflineData ({ commit }, { offlineSubmissions }) {
    let isOnline = Connection.isOnline()

    if (isOnline) {
      let offlinePlugin = FormioJS.getPlugin('offline')
      let syncedSubmissions = 0
      _.forEach(offlineSubmissions, async function (offlineSubmission) {
        // Create FormIOJS plugin instace (Manipulation)
        let formio = new FormioJS(offlineSubmission.data.formio.formUrl)
        let postData = {
          data: offlineSubmission.data.data
        }
        console.log(offlineSubmission, formio)
        // If it has an ID and the Id its not local (doesnt contain ":")
        if (offlineSubmission.data._id && offlineSubmission.data._id.indexOf(':') === -1) {
          postData._id = offlineSubmission.data._id
        }
        console.log('We are about to send to formio', postData)
        console.log('The plugin registered is: ', offlinePlugin)
        FormioJS.deregisterPlugin('offline')
        let FormIOinsertedData = await formio.saveSubmission(postData)
        console.log('this is what came back from FOrmio', FormIOinsertedData)
        FormIOinsertedData.formio = formio

        await offlineSubmission.update({
          $set: {
            data: FormIOinsertedData
          }
        })
        syncedSubmissions = syncedSubmissions + 1
        FormioJS.deregisterPlugin('offline')
        FormioJS.registerPlugin(offlinePlugin, 'offline')
      })
      if (syncedSubmissions > 0) {
        Toast.create.positive({ html: syncedSubmissions + 'SUBMISSIONS SYNCED' })
      }
    }
  }

}

export default actions
