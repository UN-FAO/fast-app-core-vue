import LocalForm from 'database/collections/scopes/LocalForm'
import LocalSubmission from 'database/collections/scopes/LocalSubmission'
import Formio from 'formiojs'
import router from 'config/router'
import store from 'config/store'
import md5 from 'md5'
import {MD5_KEY} from 'config/env'
import Auth from 'modules/Auth/api/Auth'
import _ from 'lodash'

const OFFLINE_PLUGIN = class {
  /**
	 * Stores the Formio submission locally, to allow for
	 * offline use. Then the submission can manually 
	 * be poushed to Form.io afterward
	 * @param  {[type]} formSubmission [description]
	 * @param  {[type]} formio         [description]
	 * @param  {[type]} redirect       [description]
	 * @param  {[type]} hashField      [description]
	 * @param  {[type]} formId         [description]
	 * @param  {[type]} eventHub       [description]
	 * @return {[type]}                [description]
	 */
  static storeForm (formSubmission, formio, redirect, hashField, formId, eventHub) {
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
         	if (formSubmission.redirect === true)	{
         		   router.push({
              name: 'formio_form_show',
          	params: {
           	 idForm: formId,
           	 newsubmission: 'true'
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

  /**
   * Defines the Offline Plugin to use with Form.io JS
   * library. When we want to create an online submission
   * this plugin must be desactivated.
   * @param  {[type]} formId         [description]
   * @param  {[type]} getCurrentForm [description]
   * @param  {[type]} storeForm      [description]
   * @param  {[type]} hashField      [description]
   * @param  {[type]} redirect       [description]
   * @param  {[type]} eventHub       [description]
   * @return {[type]}                [description]
   */
  static getPlugin (formId, getCurrentForm, storeForm, hashField, redirect, eventHub) {
    let plugin = {
      priority: 0,
      staticRequest: async (args) => {
        // If its a external call
        if (args.url.indexOf('form.io') === -1 && args.method === 'GET') {
        	let a = {'count': 811, 'previous': null, 'results': [{'url': 'https://pokeapi.co/api/v2/pokemon/1/', 'name': 'aaa'}, {'url': 'https://pokeapi.co/api/v2/pokemon/2/', 'name': 'ivysaur'}, {'url': 'https://pokeapi.co/api/v2/pokemon/3/', 'name': 'venusaur'}, {'url': 'https://pokeapi.co/api/v2/pokemon/4/', 'name': 'charmander'}, {'url': 'https://pokeapi.co/api/v2/pokemon/5/', 'name': 'charmeleon'}, {'url': 'https://pokeapi.co/api/v2/pokemon/6/', 'name': 'charizard'}, {'url': 'https://pokeapi.co/api/v2/pokemon/7/', 'name': 'squirtle'}, {'url': 'https://pokeapi.co/api/v2/pokemon/8/', 'name': 'wartortle'}, {'url': 'https://pokeapi.co/api/v2/pokemon/9/', 'name': 'blastoise'}, {'url': 'https://pokeapi.co/api/v2/pokemon/10/', 'name': 'caterpie'}, {'url': 'https://pokeapi.co/api/v2/pokemon/11/', 'name': 'metapod'}, {'url': 'https://pokeapi.co/api/v2/pokemon/12/', 'name': 'butterfree'}, {'url': 'https://pokeapi.co/api/v2/pokemon/13/', 'name': 'weedle'}, {'url': 'https://pokeapi.co/api/v2/pokemon/14/', 'name': 'kakuna'}, {'url': 'https://pokeapi.co/api/v2/pokemon/15/', 'name': 'beedrill'}, {'url': 'https://pokeapi.co/api/v2/pokemon/16/', 'name': 'pidgey'}, {'url': 'https://pokeapi.co/api/v2/pokemon/17/', 'name': 'pidgeotto'}, {'url': 'https://pokeapi.co/api/v2/pokemon/18/', 'name': 'pidgeot'}, {'url': 'https://pokeapi.co/api/v2/pokemon/19/', 'name': 'rattata'}, {'url': 'https://pokeapi.co/api/v2/pokemon/20/', 'name': 'raticate'}], 'next': 'https://pokeapi.co/api/v2/pokemon/?offset=20'}
        	return a
        }
        let formId = args.url.split('/')
        formId = formId[4] ? formId[4] : ''
        let form = await LocalForm.get(formId)
        let submissions = await LocalSubmission.stored(Auth.user()._id, form.name)
        let jsonSubmissions = this.LocalToJson(submissions)
      	return jsonSubmissions
      },
      request: async (args) => {
        if (args.method === 'GET' && args.type === 'form') {
          if (args.formio.formId === formId) {
            return getCurrentForm(args)
          }
          let form = await LocalForm.get(args.formio.formId)
          return form
        }
        if ((args.method === 'POST' || args.method === 'PUT') && args.type === 'submission') {
        	console.log('args => ', args)
        	let form = await LocalForm.get(args.formio.formId)
        	console.log('form => ', form)
          let formioURL = 'https://' + form.machineName.split(':')[0] + '.form.io/' + form.path
          console.log('formioURL => ', formioURL)
          let formio = new Formio(formioURL)
          let dStoreForm = _.debounce(this.storeForm, 300)
          dStoreForm(args.data, formio, redirect, hashField, formId, eventHub)
          return args.data
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
  static LocalToJson (rxDBData) {
  	let transformedArray = []
  	_.forEach(rxDBData, function (element) {
		  transformedArray.push(element.data)
    })
    return transformedArray
  }
}

export default OFFLINE_PLUGIN
