import Formio from 'modules/Formio/api/Formio'
import SyncHelper from 'database/helpers/SyncHelper'
import moment from 'moment'
import Auth from 'modules/Auth/api/Auth'
import Connection from 'modules/Wrappers/Connection'
import FormioJS from 'formiojs'
import Promise from 'bluebird'
import LocalForm from 'database/collections/scopes/LocalForm'
import LocalUser from 'database/collections/scopes/LocalUser'
import LocalSubmission from 'database/collections/scopes/LocalSubmission'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _unionBy from 'lodash/unionBy'
import _isEmpty from 'lodash/isEmpty'
import Raven from 'config/raven'
import {
  Toast
} from 'quasar'

const actions = {

  async updateLocalResource({
    collection,
    label,
    data
  }) {
    let model = ''
    if (collection === 'forms') {
      model = LocalForm
    } else if (collection === 'users') {
      model = LocalUser
    }
    // let offlinePlugin = FormioJS.getPlugin('offline')
    var formio = new FormioJS('https://' + data.appName + '.form.io')
    let isOnline = Connection.isOnline()
    let localResources = await model.find()

    let remoteResources = (isOnline && collection !== 'forms') ? await Formio[collection](data.appName) : []

    if (collection === 'forms') {
      if (isOnline) {
        FormioJS.clearCache()
      }
      remoteResources = isOnline ? await formio.loadForms({
        params: {
          limit: '200'
        }
      }) : []
    }

    let sync = SyncHelper.offlineOnlineSync({
      collection,
      LocalResults: localResources,
      OnlineResults: remoteResources,
      isOnline: isOnline
    })
    // For every new or updated entry
    _forEach(sync, async function (res, key) {
      let localRes = await model.findOne({
        'data._id': res._id
      })
      // remove local duplicated or updated entries
      if (!_isEmpty(localRes)) {
        localRes.data = res
        await model.update(localRes)
      } else {
        await model.insert({
          data: res
        })
      }
    })

    if (sync.length > 0) {
      Toast.create.positive({
        html: sync.length + ' ' + label + ' updated'
      })
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
  async getResources({
    commit
  }, data) {
    let promises = [
      actions.getForms({
        commit
      }, data)
    ]

    if (Auth.check()) {
      promises.push(actions.getUsers({
        commit
      }, data))
    }
    await Promise.all(promises)
  },

  /**
   * [getUsers description]
   * @param  {[type]} options.commit [description]
   * @param  {[type]} projectName    [description]
   * @return {[type]}                [description]
   */
  async getUsers({
    commit
  }, data) {
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
  async getForms({
    commit
  }, data) {
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
  async getSubmissions({
    commit
  }, {
    currentForm,
    vm
  }) {
    FormioJS.setToken(Auth.user().x_jwt_token)
    let isOnline = Connection.isOnline()
    let formUrl = 'https://' + currentForm.data.machineName.substring(0, currentForm.data.machineName.indexOf(':')) + '.form.io/' + currentForm.data.path

    let formio = new FormioJS(formUrl)

    let localUnSyncSubmissions = await LocalSubmission.offline(currentForm.data.path)

    FormioJS.clearCache()

    let remoteSubmissions = (isOnline) ? await formio.loadSubmissions({
      params: {
        limit: '100'
      }
    }) : []

    _map(remoteSubmissions, function (o) {
      o.formio = formio
    })

    let localSubmissions = await LocalSubmission.stored(currentForm.data.path)

    var Localresult = _unionBy(localSubmissions, localUnSyncSubmissions, '_id')
    let sync = SyncHelper.offlineOnlineSync({
      LocalResults: Localresult,
      OnlineResults: remoteSubmissions,
      isOnline: isOnline
    })
    // For every new or updated entry
    _forEach(sync, async function (submission, key) {
      let localSubmissions = await LocalSubmission.find({
        'data._id': submission._id
      })
      let localSubmission = {}
      // remove local duplicated or updated entries
      _forEach(localSubmissions, function (local) {
        localSubmission = local
        if (!(localSubmission.data.sync === false || localSubmission.data.draft === false)) {
          LocalSubmission.remove(localSubmission)
        }
      })
      let isRepleaceble = localSubmission.data && !(localSubmission.data.sync === false || localSubmission.data.draft === false)
      let isNotLocal = typeof localSubmission.data === 'undefined'
      if (isRepleaceble || isNotLocal) {
        // Inser the new or updated entry
        await LocalSubmission.insert({
          data: submission
        })
      }
      if (key === sync.length - 1) {
        if (vm && vm.$eventHub) {
          vm.$eventHub.emit('FAST-DATA_SYNCED', {
            count: sync.length,
            data: sync
          })
        }
      }
    })
    if (sync.length === 0) {
      Toast.create.info({
        html: 'Submissions are up to date'
      })
    }
  },
  /**
   * [addSubmission description]
   * @param {[type]} options.commit [description]
   * @param {[type]} currentForm    [description]
   */
  async addSubmission({
    commit
  }, {
    formSubmission,
    formio,
    User
  }) {
    let submission = { ...formSubmission,
      sync: false,
      user_email: User.email,
      formio: formio
    }
    submission = SyncHelper.deleteNulls(submission)

    // If we are updating the submission
    if (formSubmission._id) {
      submission = { ...submission,
        type: 'update',
        updated: moment().format()
      }

      let localSubmission = await LocalSubmission.get(formSubmission._id)

      // Cases where we want to update
      let submitting = submission.draft === false
      let localDraft = localSubmission.data.draft === false
      let submissionNotDraft = submission.draft === true
      let autoSave = submission.trigger === 'autoSaveAsDraft'
      let isSynced = !!(localSubmission.data.access && Array.isArray(localSubmission.data.access))
      let hasError = localSubmission.data.syncError !== '' && typeof localSubmission.data.syncError !== 'undefined'
      // Check cases
      if (((submitting || (localDraft && submissionNotDraft)) && !autoSave) || (!isSynced && autoSave && !hasError)) {
        localSubmission.data = submission
        await LocalSubmission.update(localSubmission)
      }
      return localSubmission
    }

    // If we are creating a new draft from scratch or a resource
    submission.created = moment().format()
    let newSubmission = await LocalSubmission.insert({
      data: submission
    })

    switch (formSubmission.trigger) {
      case 'createLocalDraft':
      case 'resourceCreation':
        return newSubmission
        break;
      case 'createParalelSurvey':
        newSubmission.trigger = 'createParalelSurvey'
        newSubmission.data.data.parallelSurvey = LocalSubmission.setParallelSurvey({ ...LocalSubmission.getParallelSurvey(newSubmission),
          submissionId: newSubmission._id
        })
        await LocalSubmission.update(newSubmission)
        return newSubmission
        break;
    }
  },

  /**
   * [sendOfflineData description]
   * @param  {[type]} options.commit     [description]
   * @param  {[type]} offlineSubmissions [description]
   * @return {[type]}                    [description]
   */
  async sendOfflineData({
    commit
  }, data) {
    let offlineSubmissions = data.offlineSubmissions
    let vm = data.vm
    let isOnline = Connection.isOnline()
    let syncedSubmissionsCount = 0
    let syncedSubmissions = []
    let offlinePlugin = FormioJS.getPlugin('offline')
    if (isOnline) {
      Promise.each(offlineSubmissions, async function (offlineSubmission) {
        let formio = new FormioJS(offlineSubmission.data.formio.formUrl)
        let postData = {
          data: offlineSubmission.data.data
        }
        offlineSubmission.data.queuedForSync = true
        let model = LocalSubmission

        if (offlineSubmission.data.formio.formId === 'userregister') {
          model = LocalUser
        }
        await model.update(offlineSubmission)

        // If it has an ID and the Id its not local (doesnt contain "_local")
        if (offlineSubmission.data._id && offlineSubmission.data._id.indexOf('_local') === -1) {
          postData._id = offlineSubmission.data._id
        }
        FormioJS.deregisterPlugin('offline')

        try {
          let FormIOinsertedData = await formio.saveSubmission(postData)
          if (!FormIOinsertedData._id) {
            throw Error('Submission cannot be synced')
          }
          FormIOinsertedData.formio = formio

          syncedSubmissionsCount = syncedSubmissionsCount + 1
          syncedSubmissions.push(FormIOinsertedData)

          // Update the local submission
          offlineSubmission.data = FormIOinsertedData
          await model.update(offlineSubmission)

          if (offlinePlugin) {
            FormioJS.registerPlugin(offlinePlugin, 'offline')
          }
        } catch (e) {
          console.log('The submission cannot be synced ', e)
          Raven.send(new Error('Submission cannot be synced'), {
            error: e
          })
          if (e === 'TypeError: Could not connect to API server (Failed to fetch)') {
            console.log('Error connecting to the API server')
          }
          offlineSubmission.data.queuedForSync = false
          offlineSubmission.data.syncError = e

          await model.update(offlineSubmission)

          if (offlinePlugin) {
            FormioJS.registerPlugin(offlinePlugin, 'offline')
          }
        }
      }).then((result) => {
        if (vm && vm.$eventHub) {
          vm.$eventHub.emit('FAST-DATA_SYNCED', {
            count: syncedSubmissionsCount,
            data: syncedSubmissions
          })
        }
      })
    }
  }
}

export default actions
