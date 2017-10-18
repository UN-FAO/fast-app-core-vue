
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
        
        </div>
        <div ref="formIO" class="formContainer">
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import Formio from 'formiojs'
import FormioForm from 'formiojs/form'
import FormioWizard from 'formiojs/wizard'
import FormioUtils from 'formiojs/utils'
import OFFLINE_PLUGIN from './src/offlinePlugin'
import {QSpinner, QSpinnerGears} from 'quasar'
import GPS from './src/gps'
import Lenguage from './src/lenguage'
import SMS from './src/sms'

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
    },
    localDraft: {
      required: false
    }
  },
  mounted () {
          // Select your stepper element.  
      var stepperElement = document.querySelector('ul.mdl-stepper')
      var Stepper

      // Check if MDL Component Handler is loaded.
      if (typeof componentHandler !== 'undefined') {
        // Get the MaterialStepper instance of element to control it.          
        Stepper = stepperElement.MaterialStepper
        // Moves the stepper to the next step for test.
        Stepper.next()
      } else {
        // Material Design Lite javascript is not loaded or for another  
        // reason MDL Component Handler is not available globally and
        // you can't use (register and upgrade) Stepper component at this point.
      }
    Formio.setToken(this.formioToken)
    Lenguage.listen(this)
    GPS.listen(this)
    SMS.listen(this)
    document.addEventListener('saveAsDraft', this.saveAsLocalDraft)
    // CSS.format(this)
    this.$eventHub.$on('formio.destroyComponent', this.triggerDestroy)
    this.save = _.debounce(this.save, 100)
    this.renderForm()
  },
  beforeDestroy() {
    Lenguage.off(this)
    document.removeEventListener('saveAsDraft', this.saveAsLocalDraft)
  },
  data: () => {
    return {
      formIO: null,
      jsonForm: null,
      jsonSubmission: undefined,
      offlineModePlugin: null,
      loading: true,
      saved: false
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
      let submissionNotLoaded = (typeof this.jsonSubmission !== 'undefined') && _.isEmpty(this.jsonSubmission)

      // Wait until submission is present (if needed)
      if (submissionNotLoaded) { return }

      // Offline plugin functionallity
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
      let comps = FormioUtils.findComponents(Components, {
        'tag': 'p'
      })
      _.map(comps, (comp) => {
        if (this.$t('translations["' + comp.content + '"]') !== 'translations["' + comp.content + '"]') {
          comp.content = this.$t('translations["' + comp.content + '"]')
        }
      })
      return Components
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
      // Get the Plugin
      this.offlineModePlugin = OFFLINE_PLUGIN.getPlugin(this.formId, this.getCurrentForm, this.storeForm, this.hashField, false, this.$eventHub)
      // De register if there was a previous registration
      Formio.deregisterPlugin('offline')
      // Register the plugin for offline mode
      Formio.registerPlugin(this.offlineModePlugin, 'offline')
    },
    /**
     * [saveAsDraft description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    saveAsLocalDraft (e) {
      let formSubmission = {
        data: this.formIO.data,
        redirect: true,
        draft: true,
        trigger: 'saveAsLocalDraft'
      }
      this.save(formSubmission)
      this.$swal(
       'Draft Saved!',
       'Your submission has been saved! You can continue editing later',
       'success'
      )
    },
    /**
     * [autoSaveAsDraft description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    autoSaveAsDraft () {
      let formSubmission = {
        data: this.formIO.data,
        redirect: false,
        draft: true,
        trigger: 'autoSaveAsDraft'
      }
      this.save(formSubmission)
    },
    removeDuplicatedPagination() {
      let x = document.getElementsByClassName('pagination');
      [].forEach.call(x, function (el, index) {
        if (index !== x.length - 1) {
          el.remove()
        }
      })
    },
    /**
     * [createLocalDraft description]
     * @return {[type]} [description]
     */
    createLocalDraft() {
      let formSubmission = {
        data: this.formIO.data,
        redirect: 'Update',
        draft: true,
        trigger: 'createLocalDraft'
      }
      this.save(formSubmission)
    },
    /**
     * [save description]
     * @param  {[type]} formSubmission [description]
     * @return {[type]}                [description]
     */
    save (formSubmission) {
      if (this.jsonSubmission) {
        formSubmission._id = this.jsonSubmission.data._id ? this.jsonSubmission.data._id : this.jsonSubmission._id
      }
      let formio = new Formio(this.formioURL)
      formio.saveSubmission(formSubmission)
    },
    /**
      * [mountFormIOForm description]
      * @return {[type]} [description]
      */
    async mountFormIOForm (savedSubmission) {
      // Optional parameter (If we want to stay on
      // the same page after submission)
      savedSubmission = savedSubmission || null

      // Create FormIOJS plugin instace (Manipulation)
      let formio = new Formio(this.formioURL)

      formio.loadForm().then(async onlineJsonForm => {
        let translations = await OFFLINE_PLUGIN.getLocalTranslations()
        // Create the formIOForm Instance (Renderer)
        if (onlineJsonForm.display === 'wizard') {
          if (_.isEmpty(this.formIO)) {
            this.formIO = new FormioWizard(this.$refs.formIO, translations)
          }
        } else {
          if (_.isEmpty(this.formIO)) {
            this.formIO = new FormioForm(this.$refs.formIO, translations)
          }
        }
        if (_.isEmpty(this.jsonSubmission) && this.$route.name === 'formio_form_submission') {
          this.createLocalDraft()
          return
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
        this.$eventHub.$emit('formio.mounted', this.formIO)
        
        let events = this.formIO.eventListeners

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
        let timeoutId
        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === 'formio.change').length < 1) {
          this.formIO.on('change', (change) => {
            this.removeDuplicatedPagination()
            if (this.localDraft) {
              this.saved = false
              var draftStatus = new CustomEvent('draftStatus',
              {
                'detail': {'data': false, 'text': 'Draft not Saved'}
              }
            )
            document.dispatchEvent(draftStatus)
              // AutoSave functionality
              // If a timer was already started, clear it.
              if (timeoutId) clearTimeout(timeoutId)

              // Set timer that will save comment when it fires.
              timeoutId = setTimeout(() => {
                this.autoSaveAsDraft()
                this.saved = true
              }, 750)
            }
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
            this.$swal({
                title: 'Are you sure?',
                text: 'Submission will be sent when Online. The previous data collected for this submission will be updated',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, send it!'
              }).then(async () => {
                  let formSubmission = {
                    data: submission.data
                  }
                  formSubmission.draft = false
                  formSubmission.redirect = true
                  this.save(formSubmission)
                  this.$swal(
                    'Sent!',
                    'Your submission has been sent!',
                    'success'
                  )
              })
            })
        }
      })
    }
  }
}
</script>
