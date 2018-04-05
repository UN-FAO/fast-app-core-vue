import moment from 'moment'
import Auth from 'libraries/fastjs/repositories/Auth/Auth'
import SyncHelper from 'libraries/fastjs/database/helpers/SyncHelper'
import SubmissionModel from 'libraries/fastjs/database/models/Submission'

let Submission = (() => {
  /**
   *
   * @param {*} submitedForm
   * @param {*} formio
   */
  async function add({ submission, formio }) {
    submission = SyncHelper.deleteNulls(submission)
    console.log('submission', submission)
    // If we are updating the submission
    if (submission._id) {
      return handleUpdate(submission, submission)
    }

    submission = {
      ...submission,
      sync: false,
      user_email: Auth.userEmail(),
      formio: formio
    }
    // If we are creating a new draft from scratch or a resource
    let newSubmission = await handleCreate(submission)
    switch (submission.trigger) {
      case 'importSubmission':
      case 'createLocalDraft':
      case 'resourceCreation':
        return newSubmission
        break;
      case 'createParalelSurvey':
        newSubmission.trigger = 'createParalelSurvey'
        newSubmission.data.data.parallelSurvey = SubmissionModel.local().setParallelSurvey({
          ...SubmissionModel.local().getParallelSurvey(newSubmission),
          submissionId: newSubmission._id
        })
        await SubmissionModel.local().update(newSubmission)
        return newSubmission
        break;
    }
  }

  async function handleCreate(submission) {
    submission.created = moment().unix()
    let newSubmission = await SubmissionModel.local().insert({
      data: submission
    })
    return newSubmission
  }

  async function handleUpdate(submitedForm, submission) {
    submission = {
      ...submission,
      type: 'update',
      updated: moment().unix()
    }
    let localSubmission = await SubmissionModel.local().get(submitedForm._id)

    if (await shouldUpdate(localSubmission, submission)) {
      localSubmission.data = submission
      await SubmissionModel.local().update(localSubmission)
    }
    return localSubmission
  }

  async function shouldUpdate(localSubmission, submission) {
    // Cases where we want to update
    let sendingSubmission = submission.draft === false
    let fromDraftToSubmission = (localSubmission.data.draft === false) && (submission.draft === false)
    let autoSave = submission.trigger === 'autoSaveAsDraft'
    let isSynced = !!(localSubmission.data.access && Array.isArray(localSubmission.data.access))
    let hasError = localSubmission.data.syncError !== false && typeof localSubmission.data.syncError !== 'undefined'
    return ((sendingSubmission || (fromDraftToSubmission)) && !autoSave) || (!isSynced && autoSave && !hasError)
  }

  return Object.freeze({
    add
  });
})()
export default Submission
