<template>
    <div>
        <div ref="formIO" class="formContainer">
        </div>
    </div>
</template>
<script>
import _debounce from 'lodash/debounce';
import _cloneDeep from 'lodash/cloneDeep';
import _map from 'lodash/map';
import _get from 'lodash/get';
import Formio from 'formiojs/Formio';
import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';
Components.setComponents(AllComponents);
import FormioForm from 'formiojs/Form';
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
      this.renderForm();
    },
    language: function() {
      this.renderForm();
    }
  },
  data: () => {
    return {
      formioRenderInstance: null,
      offlineModePlugin: null,
      saved: false
    };
  },
  mounted() {
    Formio.forms = {};
    Formio.setToken(this.formioToken);
    Lenguage.listen(this);
    GPS.listen(this);
    // SMS.listen(this)
    Event.listen({
      name: 'FAST:SUBMISSION:SUBMIT',
      callback: this.remoteSubmit
    });

    document.addEventListener('saveAsDraft', this.saveAsLocalDraft);
    document.addEventListener('autoSaveDraft', this.autoSaveAsDraft);

    this.save = _debounce(this.save, 400);
    this.renderForm();
  },
  beforeDestroy() {
    Lenguage.off(this);
    Event.remove({
      name: 'FAST:SUBMISSION:SUBMIT',
      callback: this.remoteSubmit
    });
    document.removeEventListener('saveAsDraft', this.saveAsLocalDraft);
    document.removeEventListener('autoSaveDraft', this.autoSaveAsDraft);
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
    async createFormioInstance(onlineJsonForm, options) {
      options.readOnly = !!(
        this.editMode === 'online-review' || this.editMode === 'read-only'
      );
      /* eslint-disable */
      options.buttonSettings = {
        showCanel:
          _get(
            onlineJsonForm,
            'properties.FAST_WIZARD_SHOW_CANCEL',
            undefined
          ) && onlineJsonForm.properties.FAST_WIZARD_SHOW_CANCEL === 'false'
            ? false
            : true,
        showNext:
          _get(
            onlineJsonForm,
            'properties.FAST_WIZARD_SHOW_CANCEL',
            undefined
          ) && onlineJsonForm.properties.FAST_WIZARD_SHOW_CANCEL === 'false'
            ? false
            : true,
        showPrevious:
          _get(
            onlineJsonForm,
            'properties.FAST_WIZARD_SHOW_CANCEL',
            undefined
          ) && onlineJsonForm.properties.FAST_WIZARD_SHOW_CANCEL === 'false'
            ? false
            : true,
        /* eslint-enable */
        clickable: true
      };

      // Create the formIOForm Instance (Renderer)
      this.formioRenderInstance = await new FormioForm(
        this.$refs.formIO,
        onlineJsonForm,
        options
      ).render();

      this.formioRenderInstance.url = this.formURL;
      this.formioRenderInstance.form = onlineJsonForm;
    },
    async mountFormIOForm() {
      // Create FormIOJS plugin instace (Manipulation)
      let formio = new Formio(this.formURL);

      formio.loadForm().then(async (onlineJsonForm) => {
        let translations = await OfflinePlugin.getLocalTranslations();

        await this.createFormioInstance(onlineJsonForm, translations);

        // Autocreate record, go directly to edit (an have autosave functionality)
        if (this.autoCreate) {
          this.createLocalDraft();
          return;
        }

        this.setSubmission();
        // Clone the original object to avoid changes
        let cloneJsonForm = _cloneDeep(onlineJsonForm);

        // Load data stored locally
        cloneJsonForm.components = this.loadExternalResources(
          onlineJsonForm.components
        );

        // Generate some custom translations
        cloneJsonForm.components = this.setTranslations(
          _cloneDeep(onlineJsonForm.components)
        );

        // Define the form to display
        this.formioRenderInstance.setForm(cloneJsonForm);

        // When the submission has been added the form is mounted
        this.$eventHub.$emit('formio.mounted', this.formioRenderInstance);

        this.formioRenderInstance.language = localStorage.getItem(
          'defaultLenguage'
        )
          ? localStorage.getItem('defaultLenguage')
          : 'en';

        this.formioRenderInstance.on('render', (render) => {
          Event.emit({
            name: 'FAST:FORMIO:RENDERED',
            data: {
              render: render,
              formio: this.formioRenderInstance
            },
            text: 'Form fully rendered'
          });
        });

        // Add error event listener only if we do not have it
        this.formioRenderInstance.on('error', (error) => {
          this.$eventHub.$emit('formio.error', {
            error: error,
            formio: this.formioRenderInstance
          });
        });

        let timeoutId;

        this.formioRenderInstance.on('change', (change) => {
          Event.emit({
            name: 'FAST:FORMIO:CHANGE',
            data: { change: change, formio: this.formioRenderInstance },
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

        // Add error event listener only if we do not have it
        this.formioRenderInstance.on('nextPage', (nextPage) => {
          this.$eventHub.$emit('formio.nextPage', {
            nextPage: nextPage,
            formio: this.formioRenderInstance
          });
        });

        // Add error event listener only if we do not have it
        this.formioRenderInstance.on('prevPage', (prevPage) => {
          this.$eventHub.$emit('formio.prevPage', {
            prevPage: prevPage,
            formio: this.formioRenderInstance
          });
        });

        // Ad submit event listener only if its not present before
        this.formioRenderInstance.on('submit', (submission) => {
          let formSubmission = {
            data: this.formioRenderInstance.data,
            draft: false,
            redirect: true,
            trigger: 'formioSubmit',
            syncError: false
          };

          this.save(formSubmission);
        });
      });
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
        data: this.formioRenderInstance.data,
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
        data: this.formioRenderInstance.data,
        redirect: false,
        draft: true,
        syncError: false,
        trigger: 'autoSaveAsDraft'
      };
      this.save(formSubmission);
    },
    /**
     * [createLocalDraft description]
     * @return {[type]} [description]
     */
    createLocalDraft() {
      // Create the new Submission from the Cloned one
      if (this.$route.params.clonedSubmission) {
        this.formioRenderInstance.data = Object.assign(
          {},
          this.$route.params.clonedSubmission
        );
      }

      let formSubmission = {
        data: this.formioRenderInstance.data,
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
      if (this.submission) {
        formSubmission._id = _get(
          this.submission,
          'data._id',
          this.submission._id
        );
        formSubmission._lid = _get(
          this.submission,
          'data._lid',
          this.submission._id
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
      if (this.saved === false) {
        this.sleep(2000)
      }
      formio.saveSubmission(formSubmission).then((created) => {
        this.redirectIntended({ submission: formSubmission, created, formio });
      });
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
                  params: { idForm: formio.formId },
                  query: { parent: this.$route.query.parent }
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
    setSubmission() {
      let submission =
        _get(this.$route.params, 'clonedSubmission.data', undefined) ||
        _get(this.submission, 'data.data', {});
      this.formioRenderInstance.submission = { data: submission };
    },
    remoteSubmit(event) {
      let data = event.detail.data;
      if (data.isScript) {
        this.formioRenderInstance.data[data.field] = data.script;
      }

      let formSubmission = {
        data: this.formioRenderInstance.data,
        draft: false,
        redirect: true,
        trigger: 'formioSubmit',
        syncError: false
      };

      this.save(formSubmission);
    },
    sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > milliseconds) {
          break;
        }
      }
    }
  }
};
</script>
