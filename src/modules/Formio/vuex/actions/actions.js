import Formio from 'modules/Formio/api/Formio'
import { Toast } from 'quasar'
import * as Database from 'database/Database'
import SyncHelper from 'database/helpers/SyncHelper'
import _ from 'lodash'
import moment from 'moment'
import Auth from 'modules/Auth/api/Auth'
import Connection from 'modules/Wrappers/Connection'

const actions = {

  async updateLocalResource ({ collection, label, data }) {
    console.log('updateing', data)
    let isOnline = Connection.isOnline()

    const DB = await Database.get()
    let localResources = await DB[collection].find().exec()

    let remoteResources = isOnline ? await Formio[collection](data.appName) : []
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
  async getSubmissions ({ commit }, { currentForm, isOnline, User }) {
    const DB = await Database.get()

    let remoteSubmissions = isOnline ? await
    Formio.getSubmissions(
      currentForm.data.machineName,
      currentForm.data.path
    ) : []

    let localSubmissions = await DB.submissions
      .find({
        // Only include this filter if we dont share data
        // between users
        'data.owner': {
          $exists: true,
          $eq: User.id
        },
        'data.form': {
          $exists: true,
          $eq: currentForm.data._id
        }
      }).exec()

    let localUnSyncSubmissions = await DB.submissions
      .find({
        // Only include this filter if we dont share data
        // between users
        'data.owner': {
          $exists: true,
          $eq: User.id
        },
        'data.form': {
          $exists: true,
          $eq: currentForm.data._id
        },
        'data.sync': false
      }).exec()

    var Localresult = _.unionBy(localSubmissions, localUnSyncSubmissions, '_id')
    let sync = SyncHelper.offlineOnlineSync({
      LocalResults: Localresult,
      OnlineResults: remoteSubmissions,
      isOnline: isOnline
    })
    // await DB.submissions.remove();
    // For every new or updated entry
    _.forEach(sync, async function (submission, key) {
      let localSubmissions = await DB.submissions.find().where('data.data._id').eq(submission._id).exec()
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
  async addSubmission ({ commit }, { currentForm, isOnline, formId, User }) {
    const DB = await Database.get()
    let submission = currentForm.submission
    submission.sync = false
    submission.user_email = User.email
    submission.form = formId
    submission.formName = currentForm.formio.formUrl.split('/').pop()
    submission.created = moment().format()
    submission.formio = {}
    submission.formio.formUrl = currentForm.formio.formUrl
    submission = SyncHelper.deleteNulls(submission)
    await DB.submissions.insert({
      data: submission
    })
  },

  /**
   * [sendOfflineData description]
   * @param  {[type]} options.commit     [description]
   * @param  {[type]} offlineSubmissions [description]
   * @return {[type]}                    [description]
   */
  async sendOfflineData ({ commit }, { offlineSubmissions, isOnline }) {
    if (isOnline) {
      let syncedSubmissions = 0
      _.forEach(offlineSubmissions, async function (offlineSubmission) {
        let FormIOinsertedData = await Formio.createSubmission(offlineSubmission.data)

        if (FormIOinsertedData) {
          // If it was inserted, then update the local submission
          await offlineSubmission.update({
            $set: {
              data: FormIOinsertedData.data
            }
          })
        }
      })
      if (syncedSubmissions > 0) {
        Toast.create.positive({ html: syncedSubmissions + 'SUBMISSIONS SYNCED' })
      }
    }
  }

}

export default actions
