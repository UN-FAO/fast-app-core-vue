
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
    },
    formioToken: {
      required: false
    }
  },
  mounted () {
    Formio.setToken(this.formioToken)
    this.$eventHub.$on('lenguageSelection', () => {
      this.renderForm()
    })
    document.removeEventListener('gpsRequested', function (e) {}, false)
    document.addEventListener('gpsRequested', (e) => {
      this.renderForm()
    })
    // Avoid function for been called multiple times
    this.storeForm = debounce(this.storeForm, 500)
    this.renderForm()
  },
  data: () => {
    return {
      formIO: null,
      jsonForm: null,
      jsonSubmission: undefined,
      offlineModePlugin: null
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
        console.log('this.localJsonForm => ', this.localJsonForm)
        // Create the formIOForm Instance (Renderer)
        if (onlineJsonForm.display === 'wizard') {
          if (_.isEmpty(this.formIO)) {
            this.formIO = new FormioWizard(this.$refs.formIO)
          }
        } else {
          if (_.isEmpty(this.formIO)) {
            this.formIO = new FormioForm(this.$refs.formIO)
          }
        }
        // Clone the original object to avoid changes
        let cloneJsonForm = _.cloneDeep(onlineJsonForm)

        // Load data stored locally
        cloneJsonForm.components = this.loadExternalResources(onlineJsonForm.components)
        
        // Translate the form
        cloneJsonForm.components = this.setTranslations(_.cloneDeep(onlineJsonForm.components))

        // this.formIO.form= cloneJsonForm
        this.formIO.setForm(cloneJsonForm)
        console.log('The form about to save is: ', this.jsonSubmission)
        // Set Submission if we are Updating
        this.formIO.submission = !_.isEmpty(this.jsonSubmission) ? {data: this.jsonSubmission.data.data} : {data: {}}
        if (onlineJsonForm.display === 'wizard') {
          console.log('this.formIO => ', this.formIO)
          // this.formIO.data = !_.isEmpty(this.jsonSubmission) ? {data: this.jsonSubmission.data.data} : {data: {}}
        }
        
        this.formIO.submission = savedSubmission ? {data: savedSubmission.data} : this.formIO.submission

        this.formIO.on('error', (error) => {
          console.log('There is an error', error)
        })
        if (this.formIO.eventListeners.filter(e => e.type === 'formio.submit').length > 0) {
          return
        }
        /**
         * This function manages how the form is submitted
         * for Offline behaivor
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
      })
    }
  }
}
</script>
