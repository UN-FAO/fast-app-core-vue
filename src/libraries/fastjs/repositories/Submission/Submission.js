import moment from 'moment'
import _cloneDeep from 'lodash/cloneDeep'
import Auth from 'libraries/fastjs/repositories/Auth/Auth'
import SyncHelper from 'libraries/fastjs/database/helpers/SyncHelper'

let Submission = (() => {
  /**
   *
   * @param {*} submitedForm
   * @param {*} formio
   */
  async function add(submitedForm, formio) {
    let submission = _cloneDeep(submitedForm)
    submission = {
      ...submission,
      sync: false,
      user_email: Auth.userEmail(),
      formio: formio
    }
    submission = SyncHelper.deleteNulls(submission)
    // If we are updating the submission
    if (submitedForm._id) {
      return handleUpdate(submitedForm, submission)
    }
    // If we are creating a new draft from scratch or a resource
    let newSubmission = handleCreate(submission)
    switch (submitedForm.trigger) {
      case 'importSubmission':
      case 'createLocalDraft':
      case 'resourceCreation':
        return newSubmission
        break;
      case 'createParalelSurvey':
        newSubmission.trigger = 'createParalelSurvey'
        newSubmission.data.data.parallelSurvey = Submission.local().setParallelSurvey({
          ...Submission.local().getParallelSurvey(newSubmission),
          submissionId: newSubmission._id
        })
        await Submission.local().update(newSubmission)
        return newSubmission
        break;
    }
  }

  async function handleCreate(submission) {
    submission.created = moment().format()
    let newSubmission = await Submission.local().insert({
      data: submission
    })
    return newSubmission
  }

  async function handleUpdate(submitedForm, submission) {
    submission = {
      ...submission,
      type: 'update',
      updated: moment().format()
    }
    let localSubmission = await Submission.local().get(submitedForm._id)

    if (await shouldUpdate(localSubmission, submission)) {
      localSubmission.data = submission
      await Submission.local().update(localSubmission)
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
