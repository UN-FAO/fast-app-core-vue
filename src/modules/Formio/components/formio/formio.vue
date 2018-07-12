<template>
    <div>
        <div ref="formIO" class="formContainer">
        </div>
    </div>
</template>
<script>
import _debounce from 'lodash/debounce';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import _map from 'lodash/map';
import _get from 'lodash/get';
import Formio from 'formiojs';
import FormioForm from 'formiojs/form';
import FormioWizard from 'formiojs/wizard';
import FormioUtils from 'formiojs/utils';
import GPS from './src/gps';
import Lenguage from './src/lenguage';
import { Event, OfflinePlugin } from 'fast-fastjs';
import router from 'config/router';
import ErrorFormatter from 'components/dataTable/submission/errorFormatter';
// import SMS from './src/sms'

export default {
  name: 'formio',
  props: {
    formURL: {
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
    },
    parentPage: {
      required: false
    },
    options: {
      type: Object,
      default: () => ({})
    },
    autoCreate: {
      required: false
    },
    editMode: {
      required: false
    }
  },
  watch: {
    submission: function(value) {
      this.jsonSubmission = value;
      this.renderForm();
    },
    language: function() {
      this.renderForm();
    }
  },
  mounted() {
    Formio.forms = {};
    Formio.setToken(this.formioToken);
    Lenguage.listen(this);
    GPS.listen(this);
    // SMS.listen(this)

    document.addEventListener('saveAsDraft', this.saveAsLocalDraft);
    document.addEventListener('autoSaveDraft', this.autoSaveAsDraft);

    this.save = _debounce(this.save, 400);
    this.renderForm();
  },
  beforeDestroy() {
    Lenguage.off(this);
    document.removeEventListener('saveAsDraft', this.saveAsLocalDraft);
    document.removeEventListener('autoSaveDraft', this.autoSaveAsDraft);
  },
  data: () => {
    return {
      formIO: null,
      jsonSubmission: undefined,
      offlineModePlugin: null,
      saved: false,
      currentForm: null
    };
  },
  methods: {
    /**
     * [renderForm description]
     * @return {[type]} [description]
     */
    renderForm() {
      // Offline plugin functionallity
      this.registerOfflinePlugin();
      // Solving problem of multiple classes added to the element
      // YES! its a pork around
      let x = document.getElementsByClassName('formio-form');
      [].forEach.call(x, function(el) {
        el.classList.remove('formio-form');
        el.classList.add('formio-form');
      });
      this.mountFormIOForm();
    },
    /**
     * [loadExternalResources description]
     * @param  {[type]} Components [description]
     * @return {[type]}            [description]
     */
    loadExternalResources(Components) {
      // return OfflinePlugin.externalResources(Components)
    },
    /**
     * [setTranslations description]
     * @param {[type]} Components [description]
     */
    setTranslations(Components) {
      let comps = FormioUtils.findComponents(Components, {
        type: 'htmlelement'
      });

      _map(comps, (comp) => {
        if (this.$t(comp.content) !== comp.content) {
          comp.content = this.$t(comp.content);
        }
      });
      return Components;
    },
    /**
     * [registerOfflinePlugin description]
     * @return {[type]} [description]
     */
    registerOfflinePlugin() {
      // De register if there was a previous registration
      Formio.deregisterPlugin('offline');
      // Register the plugin for offline mode
      Formio.registerPlugin(
        OfflinePlugin.getPlugin({
          formio: new Formio(this.formURL),
          hashField: this.hashField
        }),
        'offline'
      );
    },
    /**
     * [saveAsDraft description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    saveAsLocalDraft(e) {
      let formSubmission = {
        data: this.formIO.data,
        redirect: true,
        draft: true,
        syncError: false,
        trigger: 'saveAsLocalDraft'
      };
      this.save(formSubmission);
      this.$swal(
        'Draft Saved!',
        'Your submission has been saved! You can continue editing later',
        'success'
      );
    },
    /**
     * [autoSaveAsDraft description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    autoSaveAsDraft() {
      let formSubmission = {
        data: this.formIO.data,
        redirect: false,
        draft: true,
        syncError: false,
        trigger: 'autoSaveAsDraft'
      };
      this.save(formSubmission);
    },
    /**
     * [removeDuplicatedPagination description]
     * @return {[type]} [description]
     */
    removeDuplicatedPagination() {
      let x = document.getElementsByClassName('pagination');
      if (x.length > 2) {
        [].forEach.call(x, function(el, index) {
          if (index !== x.length - 1) {
            el.remove();
          }
        });
      }
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
      };
      this.save(formSubmission);
    },
    /**
     * [save description]
     * @param  {[type]} formSubmission [description]
     * @return {[type]}                [description]
     */
    async save(formSubmission) {
      if (this.jsonSubmission) {
        formSubmission._id = _get(
          this.jsonSubmission,
          'data._id',
          this.jsonSubmission._id
        );
        formSubmission._lid = _get(
          this.jsonSubmission,
          'data._lid',
          this.jsonSubmission._id
        );
      }
      let formio = new Formio(this.formURL);

      if (this.editMode === 'online' || !this.$FAST_CONFIG.OFFLINE_FIRST) {
        this.onlineSave(formSubmission, formio);
        return;
      }

      if (this.editMode === 'online-review') {
        this.onlineReview(formSubmission, formio);
        return;
      }
      if (this.editMode === 'read-only') {
        this.$swal('Error', 'Cannot submit on read only mode', 'error');
        return;
      }
      formio.saveSubmission(formSubmission).then((created) => {
        this.redirectIntended({ submission: formSubmission, created, formio });
      });
    },
    async redirectIntended({ submission, created, formio }) {
      if (submission._id) {
        if (submission.redirect === true) {
          switch (this.$FAST_CONFIG.SAVE_REDIRECT) {
            case 'dashboard':
              router.push({
                name: 'dashboard'
              });
              break;
            case 'collected':
              router.push({
                name: 'formio_form_show',
                params: {
                  idForm: formio.formId
                }
              });
              break;
            default:
              router.push({
                name: 'dashboard'
              });
              break;
          }
        }
      } else if (
        created.data &&
        created.data.trigger &&
        created.data.trigger === 'importSubmission'
      ) {
        return;
      } else {
        router.push({
          name: 'formio_submission_update',
          params: {
            idForm: formio.formId,
            idSubmission: created._id
          }
        });
      }
    },
    onlineSave(submission, formio) {
      this.$swal({
        title: 'Saving...',
        text: this.$t(
          'The information is being saved. This can take a couple seconds...'
        ),
        showCancelButton: false,
        onOpen: async () => {
          Formio.deregisterPlugin('offline');
          this.$swal.showLoading();
          formio
            .saveSubmission(submission)
            .then((updated) => {
              this.$swal.close();
              if (this.parentPage) {
                this.$router.push({
                  name: this.parentPage
                });
              } else if (this.editMode === 'online-review') {
                this.$router.push({
                  name: 'reviewers'
                });
              } else if (
                this.editMode === 'online' ||
                this.editMode === 'read-only' ||
                !this.$FAST_CONFIG.OFFLINE_FIRST
              ) {
                this.$router.push({
                  name: 'formio_form_show',
                  params: { idForm: formio.formId }
                });
              }
            })
            .catch((e) => {
              console.log(e);
              let errorString = ErrorFormatter.format({ errors: e, vm: this });
              this.$swal({
                title: e.name,
                type: 'info',
                html: errorString,
                showCloseButton: true,
                showCancelButton: false,
                confirmButtonText: 'OK'
              });
              this.renderForm();
            });
        }
      });
    },
    setSubmission(onlineJsonForm) {
      if (
        (this.editMode === 'online' || this.editMode === 'online-review') &&
        this.submission &&
        !this.jsonSubmission
      ) {
        this.formIO.submission = {
          data: _get(this.submission, 'data.data', {})
        };

        // If we are creating a wizard
        if (onlineJsonForm.display === 'wizard') {
          this.formIO.data = _get(this.submission, 'data.data', {});
        }
        this.jsonSubmission = this.submission;
      } else {
        this.formIO.submission = {
          data: _get(this.jsonSubmission, 'data.data', {})
        };

        // If we are creating a wizard
        if (onlineJsonForm.display === 'wizard') {
          this.formIO.data = _get(this.jsonSubmission, 'data.data', {});
        }
      }
    },
    /**
     * [createFormioInstance description]
     * @param  {[type]} onlineJsonForm [description]
     * @param  {[type]} translations   [description]
     * @return {[type]}                [description]
     */
    createFormioInstance(onlineJsonForm, translations) {
      translations.readOnly = !!(
        this.editMode === 'online-review' || this.editMode === 'read-only'
      );
      if (!_isEmpty(this.formIO)) {
        return;
      }
      // Create the formIOForm Instance (Renderer)
      if (onlineJsonForm.display === 'wizard') {
        this.formIO = new FormioWizard(this.$refs.formIO, translations);
      } else {
        this.formIO = new FormioForm(this.$refs.formIO, translations);
      }
      this.formIO.url = this.formURL;
    },
    /**
     * [mountFormIOForm description]
     * @return {[type]} [description]
     */
    async mountFormIOForm(savedSubmission) {
      // Optional parameter (If we want to stay on
      // the same page after submission)
      savedSubmission = savedSubmission || null;

      // Create FormIOJS plugin instace (Manipulation)
      let formio = new Formio(this.formURL);

      formio.loadForm().then(async (onlineJsonForm) => {
        let translations = await OfflinePlugin.getLocalTranslations();

        this.createFormioInstance(onlineJsonForm, translations);

        // Autocreate record, go directly to edit (an have autosave functionality)
        if (this.autoCreate) {
          this.createLocalDraft();
          return;
        }

        if (this.submission && this.editMode && !this.jsonSubmission) {
          this.setSubmission(onlineJsonForm);
        }

        if (this.jsonSubmission) {
          // Set Submission if we are Updating
          this.setSubmission(onlineJsonForm);
        }
        // Clone the original object to avoid changes
        let cloneJsonForm = _cloneDeep(onlineJsonForm);
        this.currentForm = _cloneDeep(onlineJsonForm);

        // Load data stored locally
        cloneJsonForm.components = this.loadExternalResources(
          onlineJsonForm.components
        );

        // Generate some custom translations
        cloneJsonForm.components = this.setTranslations(
          _cloneDeep(onlineJsonForm.components)
        );

        // Fixing problem with data not updating on loading
        // TODO this should be removed and ask for a fix in the library
        let components = FormioUtils.findComponents(cloneJsonForm.components, {
          input: true,
          type: 'number'
        });
        _map(components, function(c) {
          c.defaultValue = 'default';
        });

        // Define the form to display
        this.formIO.setForm(cloneJsonForm);

        // When the submission has been added the form is mounted
        this.$eventHub.$emit('formio.mounted', this.formIO);

        this.formIO.language = localStorage.getItem('defaultLenguage')
          ? localStorage.getItem('defaultLenguage')
          : 'en';

        // Define all the Listeners for the different FORM.io Events
        let events = this.formIO.eventListeners;

        // Add error event listener only if we do not have it
        if (events.filter((e) => e.type === 'formio.render').length < 1) {
          this.formIO.on('render', (render) => {
            this.$eventHub.$emit('formio.render', {
              render: render,
              formio: this.formIO
            });
          });
        }

        // Add error event listener only if we do not have it
        if (events.filter((e) => e.type === 'formio.error').length < 1) {
          this.formIO.on('error', (error) => {
            this.$eventHub.$emit('formio.error', {
              error: error,
              formio: this.formIO
            });
          });
        }
        let timeoutId;

        if (events.filter((e) => e.type === 'formio.change').length < 1) {
          this.formIO.on('change', (change) => {
            this.removeDuplicatedPagination();
            Event.emit({
              name: 'FAST:FORMIO:CHANGE',
              data: { change: change, formio: this.formIO },
              text: 'Submission changed'
            });
            if (
              this.localDraft &&
              this.editMode !== 'online' &&
              this.editMode !== 'online-review' &&
              this.editMode !== 'read-only'
            ) {
              if (this.$FAST_CONFIG.OFFLINE_FIRST) {
                this.saved = false;
                Event.emit({
                  name: 'FAST:SUBMISSION:CHANGED',
                  data: false,
                  text: 'Draft not Saved'
                });
                // AutoSave functionality
                // If a timer was already started, clear it.
                if (timeoutId) clearTimeout(timeoutId);

                // Set timer that will save comment when it fires.
                timeoutId = setTimeout(() => {
                  this.autoSaveAsDraft();
                  this.saved = true;
                }, 700);
              }
            }
          });
        }

        // Add error event listener only if we do not have it
        if (events.filter((e) => e.type === 'formio.nextPage').length < 1) {
          this.formIO.on('nextPage', (nextPage) => {
            this.$eventHub.$emit('formio.nextPage', {
              nextPage: nextPage,
              formio: this.formIO
            });
          });
        }

        // Add error event listener only if we do not have it
        if (events.filter((e) => e.type === 'formio.prevPage').length < 1) {
          this.formIO.on('prevPage', (prevPage) => {
            this.$eventHub.$emit('formio.prevPage', {
              prevPage: prevPage,
              formio: this.formIO
            });
          });
        }

        // Ad submit event listener only if its not present before
        if (events.filter((e) => e.type === 'formio.submit').length < 1) {
          /**
           * This function manages how the form is
           * submitted for Offline behaivor
           * @param  {[type]} 'submit'    [description]
           * @param  {[type]} (submission [description]
           * @return {[type]}             [description]
           */
          this.formIO.on('submit', (submission) => {
            let formSubmission = {
              data: this.formIO.data,
              draft: false,
              redirect: true,
              trigger: 'formioSubmit',
              syncError: false
            };

            this.save(formSubmission);
          });
        }
      });
    }
  }
};
</script>
