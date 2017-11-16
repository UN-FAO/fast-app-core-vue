import * as Database from 'database/Database'
import _map from 'lodash/map'
import _cloneDeep from 'lodash/cloneDeep'
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import Auth from 'modules/Auth/api/Auth'
import uuidv4 from 'uuid/v4'

const LocalSubmission = class {
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection("submissions")
  }

  static async find(filter) {
    const model = await LocalSubmission.getModel()
    return model.find(filter);
  }

  static async findOne(filter) {
    const model = await LocalSubmission.getModel()
    return model.findOne(filter);
  }

  static async insert(element) {
    const model = await LocalSubmission.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }

  static async remove(document) {
    const model = await LocalSubmission.getModel()
    return model.remove(document);
  }
  /**
   * [get description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  static async get(id) {
    id = id.replace(/\s/g, '')
    let offline = await LocalSubmission.findOne({ '_id': id })
    let online = await LocalSubmission.findOne({ 'data._id': id })
    if (online) {
      return online
    }
    if (offline) {
      return offline
    } else {
      return {
        data: false
      }
    }
  }

  static async update(document) {
    const model = await LocalSubmission.getModel()
    return model.update(document);
  }

  static async offline(userId, formId) {
    let filter = await LocalSubmission.find()
    // updated incomplete submission
    filter = _filter(filter, function (o) {
      return ((o.data.sync === false || o.data.draft === false) && o.data.user_email === Auth.userEmail())
    })
    filter = _orderBy(filter, ['data.created'], ['asc'])
    return filter
  }

  static async stored(userId, formId) {
    return LocalSubmission
      .find({
        // Only include this filter if we dont share data
        // between users
        'data.owner': {
          $exists: true,
          $eq: userId
        },
        'data.formio.formId': {
          $exists: true,
          $eq: formId
        }
      })
  }

  static async getUnsync() {
    let unsynced = await LocalSubmission.find({
      'data.sync': false
    })
    // updated incomplete submission
    unsynced = _filter(unsynced, function (o) {
      return (o.data.sync === false && o.data.draft === false && o.data.user_email === Auth.userEmail() && !o.data.queuedForSync && !o.data.syncError)
    })

    unsynced = _orderBy(unsynced, ['data.created'], ['asc'])
    return unsynced
  }

  static async sFind(vm, filter) {
    let localSubmissions = await LocalSubmission.find(filter)
    let submissions = _cloneDeep(localSubmissions)

    submissions = _filter(submissions, function (o) {
      return (
        (o.data.owner && o.data.owner === Auth.user()._id) ||
        (o.data.user_email && o.data.user_email === Auth.userEmail())
      )
    })

    submissions = _map(submissions, function (submission) {
      let data = submission.data.data
      let formio = submission.data.formio
      submission = _cloneDeep(submission)
      submission.data.data = {
        created: submission.data.created,
        Humancreated: vm.humanizeDate(submission.data.created),
        id_submision: submission.data._id ? submission.data._id : submission._id,
        local: !submission.data._id,
        id_submision_state: submission.data.sync ? submission.data.data.id_submision : submission.data.data.id_submision + '(Offline)',
        status: submission.data.sync === false ? 'offline' : 'online',
        draft: submission.data.draft,
        fullSubmission: data,
        formio: formio,
        syncError: submission.data.syncError ? submission.data.syncError : false
      }
      return submission
    })

    submissions = _map(submissions, 'data')
    submissions = _map(submissions, 'data')
    submissions = _orderBy(submissions, [
      'created'
    ], [
      'desc'
    ])
    return submissions
  }
}
export default LocalSubmission
