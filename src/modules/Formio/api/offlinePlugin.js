import LocalForm from 'database/collections/scopes/LocalForm'
import Formio from 'formiojs'
import router from 'config/router'
import store from 'config/store'
import md5 from 'md5'
import {MD5_KEY} from 'config/env'
import Auth from 'modules/Auth/api/Auth'

const OFFLINE_PLUGIN = class {
  static storeForm (formSubmission, formio, redirect, hashField, formId, eventHub) {
  	console.log('trying to store the form', formSubmission)
    if ((typeof hashField !== 'undefined')) {
      formSubmission.data.hashedPassword = md5(formSubmission.data.password, MD5_KEY)
      store.dispatch('storeUserLocally', {data: formSubmission.data, sync: false, formio: formio})
        .then(() => {
          router.push({path: '/login'})
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      store.dispatch('addSubmission', {
        formSubmission: formSubmission,
        formio: formio,
        User: Auth.user().data
      })
        .then((created) => {
          console.log('An element was created')
          eventHub.emit('some', formio)
          return created
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  static getPlugin (formId, getCurrentForm, storeForm, hashField, redirect, eventHub) {
    let plugin = {
      priority: 0,
      request: async (args) => {
        console.log('Performing a request => ', args)
        if (args.method === 'GET' && args.type === 'form') {
          if (args.formio.formId === formId) {
            console.log('Is the same than the local one')
            return getCurrentForm(args)
          }
          let form = await LocalForm.get(args.formio.formId)
          return form
        }
        if (args.method === 'POST' && args.type === 'submission') {
          console.log(args)
          let form = await LocalForm.get(args.formio.formId)
          console.log(form)
          let domainPath = form.machineName.split(':')[0]
          let formPath = form.machineName.split(':')[1]
          let formioURL = 'https://' + domainPath + '.form.io/' + formPath
          let formio = new Formio(formioURL)
          this.storeForm(args.data, formio, redirect, hashField, formId, eventHub)
          return args.data
        }
      }
    }
    return plugin
  }
}

export default OFFLINE_PLUGIN
