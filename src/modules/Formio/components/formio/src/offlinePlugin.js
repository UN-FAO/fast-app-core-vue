import Form from 'database/models/Form'
import Submission from 'database/models/Submission'
import Translation from 'database/models/Translation'
import Formio from 'formiojs'
import router from 'config/router'
import store from 'config/store'
import md5 from 'md5'
import {
  MD5_KEY
} from 'config/env'
import Auth from 'modules/Auth/api/Auth'
import _debounce from 'lodash/debounce'
import _forEach from 'lodash/forEach'
import FORMIOAPI from 'modules/Formio/api/Formio'
import GetRequest from './repositories/offlinePlugin/GetRequest'

const OFFLINE_PLUGIN = class {
  static storeForm(formSubmission, formio, redirect, hashField, formId, eventHub) {
    if ((typeof hashField !== 'undefined')) {
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
    } else {
      store.dispatch('addSubmission', {
        formSubmission: formSubmission,
        formio: formio,
        User: Auth.user().data
      }).then((created) => {
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
  }

  static getPlugin(formioURL, hashField, redirect, eventHub) {
    let formId = formioURL.split("/").pop();
    let plugin = {
      priority: 0,
      staticRequest: async (args) => {
        return
        // Try to get the form associated to the static request
        let formArray = args.url.split('/')

        // Making a static Request to Form.io using the Form path
        let localformId = formArray[4] ? formArray[4] : ''

        // Making a static Request to FORM.io Using formID instead of Name
        if (formArray[5] && formArray[5] === 'form') {
          localformId = formArray[6] ? formArray[6] : ''
        }

        let form = await Form.local().get(localformId)

        console.log('THe form is ', form)
        // If its a external call outside FORM.io (Local Resources)

        if (args.url.indexOf('form.io') === -1 && args.method === 'GET') {
          let a = {
            'count': 811,
            'previous': null,
            'results': [{
              'url': 'https://pokeapi.co/api/v2/pokemon/1/',
              'name': 'aaa'
            }, {
              'url': 'https://pokeapi.co/api/v2/pokemon/2/',
              'name': 'ivysaur'
            }, {
              'url': 'https://pokeapi.co/api/v2/pokemon/3/',
              'name': 'venusaur'
            }, {
              'url': 'https://pokeapi.co/api/v2/pokemon/4/',
              'name': 'charmander'
            }, {
              'url': 'https://pokeapi.co/api/v2/pokemon/5/',
              'name': 'charmeleon'
            }, {
              'url': 'https://pokeapi.co/api/v2/pokemon/12/',
              'name': 'butterfree'
            }, {
              'url': 'https://pokeapi.co/api/v2/pokemon/20/',
              'name': 'raticate'
            }],
            'next': 'https://pokeapi.co/api/v2/pokemon/?offset=20'
          }
          return a
        }
        // If there is no form associated, we stop
        if (!form) {
          console.log('there is no form associated')
          return
        }

        let submissions = await Submission.local().stored(Auth.user()._id, form.path)
        let jsonSubmissions = this.LocalToJson(submissions)
        return jsonSubmissions
      },
      request: async (args) => {
        Formio.clearCache()

        if (args.method === 'GET') {
          let result = GetRequest.handle(args)
          return result
        }

        // If we are trying to get submissions from that form
        if ((args.method === 'POST' || args.method === 'PUT') && args.type === 'submission') {
          let form = await Form.local().get(args.formio.formId)

          let formioPath = 'https://' + form.machineName.split(':')[0] + '.form.io/' + form.path

          let formio = new Formio(formioPath)

          let dStoreForm = _debounce(this.storeForm, 1000)

          let dataToSubmit = args.data
          if (args.data && !args.data.trigger) {
            let formSubmission = {
              data: args.data.data,
              redirect: false,
              draft: false,
              trigger: 'resourceCreation'
            }
            dataToSubmit = formSubmission
          }

          dStoreForm(dataToSubmit, formio, redirect, hashField, formId, eventHub)
          return args.data
        }

        // If we are calling internally to formio
        if (args.url.indexOf('form.io') !== -1 && args.method === 'GET') {
          return FORMIOAPI.getSubmissionsURL(args.url)
        }
      }
    }
    return plugin
  }

  /**
   * Transforms the Local RxDB submissions that
   * are dinamic, to an static array so we
   * can use it as Json input for the
   * selects
   * @param {[type]} rxDBData [description]
   */
  static LocalToJson(rxDBData) {
    let transformedArray = []
    _forEach(rxDBData, function (element) {
      transformedArray.push(element.data)
    })
    return transformedArray
  }

  static async getLocalTranslations() {
    let translations = await Translation.local().getFormTranslations()
    return translations
  }
}

export default OFFLINE_PLUGIN
