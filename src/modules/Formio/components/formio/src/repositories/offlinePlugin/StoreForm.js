import md5 from 'md5'
import store from 'config/store'
import router from 'config/router'
import { MD5_KEY } from 'config/env'
import Auth from 'modules/Auth/api/Auth'

let StoreForm = class {
  /**
    *
    * @param {*} formSubmission
    * @param {*} formio
    * @param {*} redirect
    * @param {*} hashField
    * @param {*} formId
    * @param {*} eventHub
    */
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
  static storeSubmission(formSubmission, formio, redirect, hashField, formId, eventHub) {
    console.log('We are going to store a submission', {
        formSubmission: formSubmission,
        formio: formio,
        User: Auth.user().data
      })
    store.dispatch('addSubmission', {
        formSubmission: formSubmission,
        formio: formio,
        User: Auth.user().data
      })
      .then((created) => {
        if (!created) {
          return
        }

        if (created.trigger && created.trigger === 'resourceCreation') {
          console.log('We got a resource creation')
          return
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
            router.push({
              name: 'formio_form_show',
              params: {
                idForm: formId
              }
            })
          }
        } else if (created.data && created.data.trigger && created.data.trigger === "importSubmission") {
          eventHub.emit("FAST-DATA_IMPORTED");
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
      })
        .catch((error) => {
          console.log(error)
        })
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
