import * as Database from 'database/Database'
import _map from 'lodash/map'
import _clone from 'lodash/clone'
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import Auth from 'modules/Auth/api/Auth'

const LocalSubmission = class {
  /**
   * [get description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  static async get(id) {
    let db = await Database.get()
    id = id.replace(/\s/g, '')
    let offline = await db.submissions.findOne()
      .where('_id').eq(id).exec()
    let online = await db.submissions.findOne()
      .where('data._id').eq(id).exec()
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

  static async offline(userId, formId) {
    let db = await Database.get()
    let userEmail = Auth.user().data.email || Auth.user().email
    let filter = await db.submissions.find().exec()
    // updated incomplete submission
    filter = _filter(filter, function (o) {
      return ((o.data.sync === false || o.data.draft === false) && o.data.user_email === userEmail)
    })
    filter = _orderBy(filter, ['data.created'], ['asc'])
    return filter
  }

  static async stored(userId, formId) {
    let db = await Database.get()
    return db.submissions
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
      }).exec()
  }

  static async sFind(vm, filter) {
    let userEmail = Auth.user().data.email || Auth.user().email
    const db = await Database.get()

    let submissions = await db.submissions.find(filter).exec()
    submissions = _filter(submissions, function (o) {
      return (
        (o.data.owner && o.data.owner === Auth.user()._id) ||
        (o.data.user_email && o.data.user_email === userEmail)
      )
    })

    submissions = _map(submissions, function (submission) {
      let data = submission.data.data
      let formio = submission.data.formio
      submission = _clone(submission)
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
