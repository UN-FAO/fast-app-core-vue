import md5 from 'md5'
import router from 'config/router'
import CONFIGURATION from 'libraries/fastjs/repositories/Configuration/Configuration'
import User from "libraries/fastjs/repositories/User/User";
import Submission from 'libraries/fastjs/repositories/Submission/SubmissionRepository'
import Event from 'libraries/fastjs/Wrappers/Event'

let StoreForm = class {
  static handle({ submission, formio, hashField }) {
    if ((typeof hashField !== 'undefined')) {
      StoreForm.storeUser({ submission, formio, hashField })
    } else {
      StoreForm.storeSubmission({ submission, formio, hashField })
    }
  }
  /**
   *
   */
  static async storeSubmission({ submission, formio, hashField }) {
    let created = await Submission.add({
      submission: submission,
      formio: formio
    })
    if (!created) {
      return
    }

    if (submission.trigger && submission.trigger === 'resourceCreation') {
    }
    if (submission.trigger && submission.trigger === 'formioSubmit') {
      created.isSubmit = true
    } else {
      created.isSubmit = false
    }

    Event.emit({ name: 'FAST:SUBMISSION:CHANGED', data: created, text: 'Draft Saved' })

    if (submission._id) {
      let config = await CONFIGURATION.getLocal()
      if (submission.redirect === true) {
        switch (config.SAVE_REDIRECT) {
          case 'dashboard':
            router.push({
              name: 'dashboard'
            })
            break;
          case 'collected':
            router.push({
              name: 'formio_form_show',
              params: {
                idForm: formio.formId
              }
            })
            break;
          default:
            router.push({
              name: 'dashboard'
            })
            break;
        }
      }
    } else if (created.data && created.data.trigger && created.data.trigger === "importSubmission") {
      return
    } else {
      router.push({
        name: 'formio_submission_update',
        params: {
          idForm: formio.formId,
          idSubmission: created._id
        }
      })
    }
    return created
  }
  /**
   *
   */
  static async storeUser(formSubmission, formio, redirect, hashField, formId, eventHub) {
    let config = await CONFIGURATION.getLocal()
    console.log('formSubmission', formSubmission.submission)
    formSubmission.submission.data.hashedPassword = md5(formSubmission.submission.data.password, config.MD5_KEY)
    User.storeLocally({
      data: formSubmission.submission.data,
      sync: false,
      formio: formio
    })
      .then(() => {
        router.push({
          path: '/login'
        })
      })
      .catch((error) => {
        eventHub.emit('FAST:USER:REGISTRATION:ERROR', formSubmission.submission.data);
        console.log(error)
      })
  }
}
export default StoreForm
