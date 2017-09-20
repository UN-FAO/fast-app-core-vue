
<style scoped>
 .desc {
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .pl {
    padding-left: 20px;
  }
</style>
<template>
    <div>
        <div v-if="loading">
          <q-spinner-gears color="primary" :size="100" />
        </div>
        <div ref="formIO" class="formContainer">
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import Formio from 'formiojs'
import FormioUtils from 'formiojs/utils'
import FormioForm from 'formiojs/form'
import FormioWizard from 'formiojs/wizard'
import debounce from 'async-debounce'
import OFFLINE_PLUGIN from 'modules/Formio/api/offlinePlugin'
import {MULTILANGUAGE} from 'config/env'
import {QSpinner, QSpinnerGears, Loading} from 'quasar'

export default {
  name: 'formio',
  components: {
    QSpinner, QSpinnerGears
  },
  props: {
    formioURL: {
      required: true
    },
    submission: {
      required: false
    },
    hashField: {
      required: false
    },
    formioToken: {
      required: false
    }
  },
  mounted () {
    Formio.setToken(this.formioToken)

    this.$eventHub.$on('lenguageSelection', (lenguage) => {
      this.formIO.language = lenguage.code
      this.renderForm()
    })
     
    this.$eventHub.$on('formio.destroyComponent', this.triggerDestroy)

    document.removeEventListener('gpsSucceeded', function (e) {}, false)
    document.removeEventListener('gpsRequested', function (e) {}, false)
    
    document.addEventListener('gpsRequested', (e) => {
      Loading.show({
        message: 'Getting GPS information',
        spinnerSize: 100
      })
    })
    document.addEventListener('gpsSucceeded', (e) => {
      Loading.hide()
      this.renderForm()
      this.$swal(
        'GPS Registered!',
        'Your GPS position was detected',
        'success'
      )
    })
    // Avoid function for been called multiple times
    this.storeForm = debounce(this.storeForm, 500)
    this.renderForm()
  },
  beforeDestroy() {
    this.$eventHub.$off('lenguageSelection', this.renderForm)
  },
  data: () => {
    return {
      formIO: null,
      jsonForm: null,
      jsonSubmission: undefined,
      offlineModePlugin: null,
      loading: true
    }
  },
  watch: {
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
    triggerDestroy () {
      this.$destroy()
    },
    /**
         * [renderForm description]
         * @return {[type]} [description]
         */
    renderForm () {
      console.log('Rendering form')
      let submissionNotLoaded = (typeof this.jsonSubmission !== 'undefined') && _.isEmpty(this.jsonSubmission)

      // Wait until form is present
      if (submissionNotLoaded) {
        console.log('STOPPING RENDERING')
        return
      }

      this.registerOfflinePlugin()

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
      // return OFFLINE_PLUGIN.externalResources(Components)
    },
    /**
         * [setTranslations description]
         * @param {[type]} Components [description]
         */
    setTranslations (Components) {
      let translations = Components
      if (!MULTILANGUAGE) {
        return translations
      }
      return translations
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
    reRenderForm () {
      this.formIO.render()
    },
    /**
      * [registerOfflinePlugin description]
      * @return {[type]} [description]
      */
    registerOfflinePlugin () {
      this.offlineModePlugin = OFFLINE_PLUGIN.getPlugin(this.formId, this.getCurrentForm, this.storeForm, this.hashField, false, this.$eventHub)
      Formio.deregisterPlugin('offline')
      Formio.registerPlugin(this.offlineModePlugin, 'offline')
    },
    /**
      * [mountFormIOForm description]
      * @return {[type]} [description]
      */
    mountFormIOForm (savedSubmission) {
      savedSubmission = savedSubmission || null

      // Create FormIOJS plugin instace (Manipulation)
      let formio = new Formio(this.formioURL)

      formio.loadForm().then(onlineJsonForm => {
        console.log('onlineJsonForm => ', onlineJsonForm)
        console.log('this.jsonSubmission => ', this.jsonSubmission)
        // Create the formIOForm Instance (Renderer)
        if (onlineJsonForm.display === 'wizard') {
          if (_.isEmpty(this.formIO)) {
            this.formIO = new FormioWizard(this.$refs.formIO)
          }
        } else {
          if (_.isEmpty(this.formIO)) {
            this.formIO = new FormioForm(this.$refs.formIO, {
              i18n: {
                es: {
                  'latitude': 'latitud',
                  'longitude': 'longitud',
                  'GPS Position': 'Posicion del GPS',
                  'GPS LOCATIONS': 'Posiciones del GPS',
                  'Name': 'Nombre',
                  'fileUpload': 'Subir un archivo',
                  'addGpslocation': 'Agregar posicion GPS'
                }
              }
            })
          }
        }
        // Clone the original object to avoid changes
        let cloneJsonForm = _.cloneDeep(onlineJsonForm)

        // Load data stored locally
        cloneJsonForm.components = this.loadExternalResources(onlineJsonForm.components)
        
        // Translate the form
        cloneJsonForm.components = this.setTranslations(_.cloneDeep(onlineJsonForm.components))

        // Define the form to display
        this.formIO.setForm(cloneJsonForm)

        // Set Submission if we are Updating
        this.formIO.submission = !_.isEmpty(this.jsonSubmission) ? {data: this.jsonSubmission.data.data} : {data: {}}

        if (onlineJsonForm.display === 'wizard') {
          this.formIO.data = !_.isEmpty(this.jsonSubmission) ? this.jsonSubmission.data.data : {}
        } else {
          this.formIO.submission = savedSubmission ? {data: savedSubmission.data} : this.formIO.submission
        }

        let events = this.formIO.eventListeners
        console.log('this.formIO => ', this.formIO, events)
        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === 'formio.render').length < 1) {
          this.formIO.on('render', (render) => {
            this.loading = false
            this.$eventHub.$emit('formio.render', {render: render, formio: this.formIO})
          })
        }
  
        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === 'formio.error').length < 1) {
          this.formIO.on('error', (error) => {
            this.$eventHub.$emit('formio.error', {error: error, formio: this.formIO})
          })
        }

        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === 'formio.change').length < 1) {
          this.formIO.on('change', (change) => {
            this.$eventHub.$emit('formio.change', {change: change, formio: this.formIO})
          })
        }

        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === 'formio.nextPage').length < 1) {
          this.formIO.on('nextPage', (nextPage) => {
            this.$eventHub.$emit('formio.nextPage', {nextPage: nextPage, formio: this.formIO})
          })
        }

        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === 'formio.prevPage').length < 1) {
          this.formIO.on('prevPage', (prevPage) => {
            this.$eventHub.$emit('formio.prevPage', {prevPage: prevPage, formio: this.formIO})
          })
        }
        
        // Ad submit event listener only if its not present before
        if (events.filter(e => e.type === 'formio.submit').length < 1) {
          /**
           * This function manages how the form is 
           * submitted for Offline behaivor
           * @param  {[type]} 'submit'    [description]
           * @param  {[type]} (submission [description]
           * @return {[type]}             [description]
           */
          this.formIO.on('submit', (submission) => {
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
            formSubmission.redirect = true
            formio.saveSubmission(formSubmission)
          })
        }
      })
    }
  }
}
</script>
