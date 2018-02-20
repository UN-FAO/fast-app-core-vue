import md5 from 'md5'
import store from 'config/store'
import router from 'config/router'
import { MD5_KEY, SAVE_REDIRECT } from 'config/env'
import Auth from 'modules/Auth/api/Auth'

let StoreForm = class {
  static handle(formSubmission, formio, redirect, hashField, formId, eventHub) {
    if ((typeof hashField !== 'undefined')) {
      StoreForm.storeUser(formSubmission, formio, redirect, hashField, formId, eventHub)
    } else {
      StoreForm.storeSubmission(formSubmission, formio, redirect, hashField, formId, eventHub)
    }
  }
  /**
   *
   */
  static async storeSubmission(formSubmission, formio, redirect, hashField, formId, eventHub) {
    let created = await store.dispatch('addSubmission', {
      formSubmission: formSubmission,
      formio: formio,
      User: Auth.user().data
    })

    if (!created) {
      return
    }

    if (formSubmission.trigger && formSubmission.trigger === 'resourceCreation') {
      console.log('formSubmission', formSubmission)
    }
    console.log('formSubmission', formSubmission)
    if (formSubmission.trigger && formSubmission.trigger === 'formioSubmit') {
      created.isSubmit = true
      console.log('formSubmission', formSubmission)
    }

    var draftStatus = new CustomEvent('draftStatus', {
      'detail': {
        'data': created,
        'text': 'Draft Saved'
      }
    })
    document.dispatchEvent(draftStatus)
    if (formSubmission._id) {
      if (formSubmission.redirect === true) {
        switch (SAVE_REDIRECT) {
          case 'dashboard':
            router.push({
              name: 'dashboard'
            })
            break;
          case 'collected':
            router.push({
              name: 'formio_form_show',
              params: {
                idForm: formId
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
          idForm: formId,
          idSubmission: created._id
        }
      })
    }
    return created
  }
  /**
   *
   */
  static storeUser(formSubmission, formio, redirect, hashField, formId, eventHub) {
    formSubmission.data.hashedPassword = md5(formSubmission.data.password, MD5_KEY)
    store.dispatch('storeUserLocally', {
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
        console.log(error)
      })
  }
}
export default StoreForm
