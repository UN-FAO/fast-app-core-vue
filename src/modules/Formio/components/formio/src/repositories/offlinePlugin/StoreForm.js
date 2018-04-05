import md5 from 'md5'
import router from 'config/router'
import CONFIGURATION from 'libraries/fastjs/repositories/Configuration/Configuration'
import User from "libraries/fastjs/repositories/User/User";
import Submission from 'libraries/fastjs/repositories/Submission/Submission'

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
    }

    var draftStatus = new CustomEvent('draftStatus', {
      'detail': {
        'data': created,
        'text': 'Draft Saved'
      }
    })
    document.dispatchEvent(draftStatus)
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
    formSubmission.data.hashedPassword = md5(formSubmission.data.password, config.MD5_KEY)
    User.storeLocally({
      data: formSubmission.data,
      sync: false,
      formio: formio
    })
      .then(() => {
        router.push({
          path: '/login'
        })
      })
      .catch((error) => {
        eventHub.emit('FAST:USER:REGISTRATION:ERROR', formSubmission.data);
        console.log(error)
      })
  }
}
export default StoreForm
