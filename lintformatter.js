import _ from 'lodash'
import Auth from 'modules/Auth/api/Auth'
import Formio from 'formiojs'
import FormioUtils from 'formiojs/utils'
import FormioForm from 'formiojs/form'
import debounce from 'async-debounce'
import md5 from 'md5'
import {MD5_KEY} from 'config/env'
export default {
  name: 'formio',
  props: {
    formioURL: {
      required: true
    },
    localJsonForm: {
      required: false
    },
    submission: {
      required: false
    },
    hashField: {
      required: false
    }
  },
  mounted () {
    console.log('component mounted')

    Formio.setToken(Auth.user().x_jwt_token)
    this.$eventHub.$on('lenguageSelection', () => {
      this.renderForm()
    })
    // Avoid function for been called multiple times
    this.storeForm = debounce(this.storeForm, 300)
    this.renderForm()
  },
  data: () => {
    return {
      formIO: null,
      jsonForm: null,
      jsonSubmission: undefined
    }
  },
  watch: {
    // Re render form on changes
    localJsonForm: function (value) {
      this.jsonForm = value
      this.renderForm()
    },
    submission: function (value) {
      this.jsonSubmission = value
      this.renderForm()
    }
  },
  computed: {
    formId () {
      return this.formioURL.split('/').pop()
    },
    baseURL () {
      return 'https://' + this.formioURL.split('/')[2] + '/'
    },
    formioPath () {
      return this.jsonForm ? this.jsonForm.path : ''
    }
  },
  methods: {
    /**
         * Refresh when pulled Down
         * @return {[type]} [description]
         */
    refreshForm () {
      this.renderForm()
    },
    /**
         * [renderForm description]
         * @return {[type]} [description]
         */
    renderForm () {
      console.log('Rendering form')
      let submissionNotLoaded = (typeof this.jsonSubmission !== 'undefined') && _.isEmpty(this.jsonSubmission)
      let jsonFormNotLoaded = (typeof this.localJsonForm !== 'undefined') && _.isEmpty(this.jsonForm)

      // Wait until form is present
      if (submissionNotLoaded || jsonFormNotLoaded) {
        console.log('Stoping render', submissionNotLoaded, jsonFormNotLoaded)
        return
      }

      // this.registerOfflinePlugin()

      // Solving problem of multiple classes added to the element
      // YES! its a pork around
      let x = document.getElementsByClassName('formio-form');
      [].forEach.call(x, function (el) {
        el.classList.remove('formio-form')
        el.classList.add('formio-form')
      })

      this.mountFormIOForm()
    },
    /**
         * [loadExternalResources description]
         * @param  {[type]} Components [description]
         * @return {[type]}            [description]
         */
    loadExternalResources (Components) {
      FormioUtils.eachComponent(Components, function (component) {
        if (component.type === 'select') {
          if (component.dataSrc === 'url') {
            delete component.selectValues
            // select.multiple = true
            component.data.url = ''
            component.dataSrc = 'values'
            component.project = ''
            component.resource = ''

            component.data.values = [
              {
                label: 'charmander',
                value: 'charmander',
                name: 'charmander',
                nameOfPastoral: 'charmander'
              },
              {
                label: 'pikachu',
                value: 'pikachu',
                name: 'pikachu',
                nameOfPastoral: 'pikachu'
              },
              {
                label: 'squirtle',
                value: 'squirtle',
                name: 'squirtle',
                nameOfPastoral: 'squirtle'
              }]
          } else if (component.dataSrc === 'resource') {
            delete component.selectValues
            // select.multiple = true
            component.data.url = ''
            component.dataSrc = 'values'
            component.project = ''
            component.resource = ''

            component.data.values = [
              {
                label: 'charmander2',
                value: 'charmander2',
                name: 'charmander2',
                nameOfPastoral: 'charmander2'
              },
              {
                label: 'pikachu2',
                value: 'pikachu2',
                name: 'pikachu2',
                nameOfPastoral: 'pikachu2'
              },
              {
                label: 'squirtle2',
                value: 'squirtle2',
                name: 'squirtle2',
                nameOfPastoral: 'squirtle2'
              }]
          }
        }
      }
      )

      return Components
    },
    /**
         * [setTranslations description]
         * @param {[type]} Components [description]
         */
    setTranslations (Components) {
      let translations = Components
      FormioUtils.eachComponent(translations, (component, index) => {
        if (component.label === 'projectID' || component.label === 'projectName') {
          return
        }
        if (component.label &&
                    component.label !== '') {
          let tLabel = component.label.replace('translations.', '')
          tLabel = tLabel.replace(/[^a-zA-Z0-9]/g, '_')
          tLabel = tLabel.split(' ').join('_')
          component.label = this.$t('translations.' + tLabel)
        }

        if (component.description &&
                    component.description !== '') {
          let tDescription = component.description.replace('translations.', '')
          tDescription = tDescription.replace(/[^a-zA-Z0-9]/g, '_')
          tDescription = tDescription.split(' ').join('_')
          component.description = this.$t('translations.' + tDescription)
        }

        if (component.placeholder &&
                    component.placeholder !== '') {
          let tPlaceholder = component.placeholder.replace('translations.', '')
          tPlaceholder = tPlaceholder.replace(/[^a-zA-Z0-9]/g, '_')
          tPlaceholder = tPlaceholder.split(' ').join('_')
          component.placeholder = this.$t('translations.' + tPlaceholder)
        }
      })
      return translations
    },
    getCurrentForm () {
      return this.jsonForm
    },
    /**
         * [registerOfflinePlugin description]
         * @return {[type]} [description]
         */
    registerOfflinePlugin () {
      let self = this
      var offlineMode = {
        priority: 0,
        request: (requestArgs) => {
          return self.getCurrentForm()
        }
      }
      Formio.deregisterPlugin('offline')
      Formio.registerPlugin(offlineMode, 'offline')
    },
    /**
         * [mountFormIOForm description]
         * @return {[type]} [description]
         */
    mountFormIOForm (savedSubmission) {
      savedSubmission = savedSubmission || null
      // Create the formIOForm Instance (Renderer)
      this.formIO = new FormioForm(this.$refs.formIO)

      // Create FormIOJS plugin instace (Manipulation)
      let formio = new Formio(this.formioURL)

      formio.loadForm().then(onlineJsonForm => {
        // Clone the original object to avoid changes
        let cloneJsonForm = _.cloneDeep(onlineJsonForm)

        // Load data stored locally
        // cloneJsonForm.components = this.loadExternalResources(onlineJsonForm.components)
        
        // Translate the form
        cloneJsonForm.components = this.setTranslations(_.cloneDeep(onlineJsonForm.components))

        // this.formIO.form= cloneJsonForm
        this.formIO.setForm(cloneJsonForm)
        console.log('The form about to save is: ', this.jsonSubmission)
        // Set Submission if we are Updating
        this.formIO.submission = !_.isEmpty(this.jsonSubmission) ? {data: this.jsonSubmission.data.data} : {data: {}}
        
        this.formIO.submission = savedSubmission ? {data: savedSubmission.data} : this.formIO.submission
        
        this.formIO.on('error', (error) => {
          console.log('There is an error', error)
        })

        this.formIO.on('submit', async (submission) => {
          let formSubmission = {
            data: submission.data
          }
          // If we have the recent submission, then use it
          if (savedSubmission) {
            formSubmission._id = savedSubmission._id
          // If we are editing, then use the json
          } else if (this.jsonSubmission) {
            formSubmission._id = this.jsonSubmission.data._id ? this.jsonSubmission.data._id : this.jsonSubmission._id
          }
          console.log('The form about to save is ----: ', this.jsonSubmission)
          this.storeForm(formSubmission, formio)
        })
      })
    },
    storeForm (formSubmission, formio) {
      console.log('formSubmission => ', formSubmission)
      console.log('formio => ', formio)
      console.log('this => ', this)

      if ((typeof this.hashField !== 'undefined')) {
        formSubmission.data.hashedPassword = md5(formSubmission.data.password, MD5_KEY)
        this.$store.dispatch('storeUserLocally', {data: values, sync: false, formio: formio})
          .then(() => {
            this.formContainer.reset()
            this.$router.push({path: '/login'})
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        this.$store.dispatch('addSubmission', {
          formSubmission: formSubmission,
          formio: formio,
          User: Auth.user().data
        })
          .then((created) => {
            console.log('An element was created')
            this.$router.push({
              name: 'formio_form_show',
              params: {
                idForm: this.formId,
                newsubmission: 'true'
              }
            })
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }
}
