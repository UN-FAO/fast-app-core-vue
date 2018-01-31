import Formio from 'formiojs'
import _forEach from 'lodash/forEach'
import Form from 'database/models/Form'
import Auth from 'modules/Auth/api/Auth'
import Submission from 'database/models/Submission'
import Translation from 'database/models/Translation'
import GetRequest from './repositories/offlinePlugin/GetRequest'
import PostRequest from './repositories/offlinePlugin/PostRequest'

const OFFLINE_PLUGIN = class {
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

        // If we are trying to save a submission
        if ((args.method === 'POST' || args.method === 'PUT')) {
          let submission = await PostRequest.handle(args, redirect, hashField, formId, eventHub)
          return submission
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
