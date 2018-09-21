<template>
    <div>
        <div ref="formIO" class="formContainer">
        </div>
    </div>
</template>
<script>

import _map from 'lodash/map';
import _get from 'lodash/get';
import Formio from 'formiojs/Formio';
import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';
Components.setComponents(AllComponents);

import FormioUtils from 'formiojs/utils';

import Lenguage from './src/lenguage';
import { Event, Hash } from 'fast-fastjs';
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
    },
    async mountFormIOForm() {
        // Add error event listener only if we do not have it
        this.formioRenderInstance.on('error', (error) => {
          this.$eventHub.$emit('formio.error', {
            error: error,
            formio: this.formioRenderInstance
          });
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

      let url = this.$FAST_CONFIG.APP_URL + '/' + this.$route.params.idForm;
      if (this.$route.params.idSubmission === 'own_unique_from') {
        url = this.$FAST_CONFIG.APP_URL + '/' + this.$route.query.form;
      }

      // Send reset Email
      if (
        this.$route.name === 'sendreset' &&
        this.$route.query.token &&
        this.$route.query.token !== ''
      ) {
        let user = await Formio.currentUser();
        formSubmission.data = Object.assign({}, user.data, formSubmission.data);
        formSubmission.data.hashedPassword = await Hash.string(
          formSubmission.data.password
        );
        formSubmission._id = user._id;
        url = this.$FAST_CONFIG.APP_URL + '/user';
      }

      if (this.$route.name === 'sendreset' && !this.$route.query.token) {
        url = this.$FAST_CONFIG.APP_URL + '/sendreset';
      }

      let formio = new Formio(url);

      if (
        this.editMode === 'online' ||
        !this.$FAST_CONFIG.OFFLINE_FIRST ||
        (this.$route.name === 'sendreset' && this.$route.query.token)
      ) {
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
              } else if (
                this.$route.name === 'sendreset' &&
                this.$route.query.token
              ) {
                this.$router.push({
                  name: 'login'
                });
              } else if (this.editMode === 'online-review') {
                this.$router.push({
                  name: 'reviewers'
                });
              } else if (
                this.$route.params.idSubmission === 'own_unique_from'
              ) {
                // If we are editting the profile
                this.$router.push({
                  path: '/page/user-profile'
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
    }
  }
};
</script>
