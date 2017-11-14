import * as Database from 'database/Database'
import _ from 'lodash'

const getters = {
  /**
   * [description]
   * @param  {[type]} state    [description]
   * @param  {[type]} getters) [description]
   * @return {[type]}          [description]
   */
  getFormById: (state, getters) => (id) => {
    return _.filter(state.forms, {
      '_id': String(id)
    })[0]
  },

  getSubmissionByFormId: (state, getters) => async(id) => {
    let db = await Database.get()
    let submissions = await db.submissions.find().where('data.form').eq(id).exec()

    let submissionData = _.map(submissions, 'data')

    _.map(submissionData, function (submission, index) {
      submission.data.created = submission.created
      submission.data.submission_id = submission._id
    })
    return _.map(submissionData, 'data')
  }
}

export default getters
