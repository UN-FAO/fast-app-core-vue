<template>
  <div>
    <div class="row FormioContainer">
      <div class="formPageContainer">
        <q-card style="background-color: white; max-height: fit-content;" class="formNav" v-if="_isWizard && showPages && !$FAST_CONFIG.TAB_MENU">
          <q-card-title>
            <q-icon  slot="right" flat  color="grey" @click="togglePages" name="menu" v-if="_isWizard && !$FAST_CONFIG.TAB_MENU && showPages">
              <q-tooltip>{{$t('Show pages')}}</q-tooltip>
            </q-icon>
          </q-card-title>
          <q-card-main>
            <q-list separator style="border: none !important">

              <q-item class="formioPagination" multiline style="text-align: left; min-height: 60px; border-radius: 5px;" link v-for="(page, index) in _pages" :key="page.title" @click="goToPage(index)" :ref="'page-'+ index" v-bind:class="currentPage === index ? 'activePage' : ''">
                <q-item-main style=" margin-top: auto;  margin-bottom: auto;" :label="$t(getLabelForPage(page))" label-lines="3" />
              </q-item>
            </q-list>
          </q-card-main>
        </q-card>

        <q-card v-bind:class="getFormClass">
          <q-card-main style="min-height:100vh">
            <q-card-title>

            <q-icon  flat  color="grey" @click="togglePages" name="menu" v-if="_isWizard && !$FAST_CONFIG.TAB_MENU && !showPages">
              <q-tooltip>{{$t('Show pages')}}</q-tooltip>
            </q-icon>
              <breadcrum
                v-bind:class="$getDirection()"
                :parent="$route.query.parent"
                :currentPageTitle="formTitle"
                :isSubmission="true"
              />
            <q-icon
              slot="right"
              flat
              color="primary"
              @click="saveAsDraft()"
              name="fa-floppy-o"
              v-if="this.$route.query.mode !== 'online' &&
               this.$route.query.mode !== 'online-review' &&
               this.$route.query.mode !== 'read-only' && this.$FAST_CONFIG.OFFLINE_FIRST">
              <q-tooltip>{{$t('Save as draft')}}</q-tooltip>
            </q-icon>

            <q-icon slot="right" name="more_vert" color="grey" style="cursor:pointer; margin-left:20px" v-if="this.$FAST_CONFIG.OFFLINE_FIRST">
              <q-popover ref="popover" class="show-menu">
                <q-list link class="no-border" dense separator no-border>

                  <q-item @click="$refs.popover.close(), openRightDrawer()"  v-if="$FAST_CONFIG.HAS_SCORES">
                    <q-item-side icon="assessment"  />
                    <q-item-main :label="$t('Show scores')" />
                  </q-item>

                  <q-item @click="$refs.popover.close(), showReport()"  v-if="$FAST_CONFIG.HAS_REPORT">
                    <q-item-side icon="assignment"  />
                    <q-item-main :label="$t('Report')" />
                  </q-item>

                  <q-item @click="$refs.popover.close(), addSurvey()" v-if="this.$route.query.mode !== 'online' && $FAST_CONFIG.PARALLEL_SURVEYS && this.$route.query.mode !== 'online-review'" >
                    <q-item-side icon="person_add"  />
                    <q-item-main :label="$t('Add participant')" />
                  </q-item>

                  <q-item @click="$refs.popover.close(), groupConfig()" v-if="this.$route.query.mode !== 'online' && $FAST_CONFIG.PARALLEL_SURVEYS && this.$route.query.mode !== 'online-review'" >
                    <q-item-side icon="fa-users"  />
                    <q-item-main :label="$t('Change Group')" />
                  </q-item>

                </q-list>
              </q-popover>
            </q-icon>

            </q-card-title>
            <!--
              <q-btn @click="singleNext()" class="pull-right primary" color="primary">Next Page</q-btn>
                <q-btn @click="clickNext()" class="pull-right primary" color="primary">Full review</q-btn>
                <q-btn @click="submitForm()" class="pull-right primary" color="danger">Submit</q-btn>
              -->
            <!--<q-icon name="thumb_up" />-->
            <q-tabs inverted id="contentForm" >
              <!-- Tabs - notice slot="title" -->

              <q-tab v-bind:class="!$FAST_CONFIG.PARALLEL_SURVEYS ? 'hidden' : ''" default slot="title" name="tab-1" icon="person" :label="participantName" :color="saved ? 'primary' : 'red'" />
              <!-- Targets -->
              <q-tab
                slot="title"
                v-if="participant.submissionId !== $route.params.idSubmission"
                v-for="participant in participants"
                :key="participant.submissionId"
                icon="person"
                :label="participant.participantName"
                :name="participant.participantName"
                :color="saved ? 'primary' : 'red'"
                @click="goToSurvey(participant.submissionId)"
              />

              <q-tab-pane name="tab-1" ref="tab1">

                <formiovue
                  :form="form"
                  :submission="submission"
                  :options="options"
                  :language="language"
                  v-on:change="onSubmissionChange"
                  v-on:submit="onFormSubmit"
                  v-on:error="onFormError"
                  v-if="form && submission && options"
                />


                <div v-bind:style="{ display: customRender ? 'initial' : 'none', color: 'black' }">

                <div
                  v-bind:style="{ display: customRenderType === 'script' ? 'initial' : 'none' }"
                >
                 <executor
                  :submission="changeEvent"
                  :openCpuUrl="$FAST_CONFIG.OPEN_CPU_URL || 'https://public.opencpu.org'"
                  :formioUrl="$FAST_CONFIG.APP_URL"
                  :token="formioToken"
                  />
                </div>
                  <datatable
                    :data="customRenderArray"
                    :form="form"
                    fastMode="editGrid"
                    v-if="form && form.title !== '' && customRenderType === 'datagrid'"
                  />
                </div>
              </q-tab-pane>

            </q-tabs>

          </q-card-main>
        </q-card>

        <q-fixed-position :corner="getButtonPosition()" :offset="[18, 18]" v-if="this.$route.query.mode === 'online-review'">

          <q-fab color="red" icon="add" direction="down" v-if="this.$route.query.mode === 'online-review'">

            <q-fab-action color="green" @click="reviewSubmission('accept')" icon="fa-check">
              <q-tooltip>{{$t('Accept')}}</q-tooltip>
            </q-fab-action>

            <q-fab-action color="red" @click="reviewSubmission('reject')" icon="fa-ban">
              <q-tooltip>{{$t('Delete')}}</q-tooltip>
            </q-fab-action>
          </q-fab>
        </q-fixed-position>

        <!--
              <q-fixed-position v-if="displayDown" style="margin: 18px;position: sticky;z-index: 100;width: 100%;min-height: 63px;" corner="bottom-right" :offset="[18, 18]">
              <q-btn round color="primary" @click="nextQuestion" class="pull-right">
              <q-icon name="fa-arrow-circle-down" />
              </q-btn>
              </q-fixed-position>

              <q-fixed-position v-if="displayUp" style="margin: 18px;position: sticky;z-index: 99;width: 100%;min-height: 63px;    padding-bottom: 70px;" corner="bottom-right" :offset="[18, 18]">
              <q-btn round color="primary" @click="prevQuestion" class="pull-right">
              <q-icon name="fa-arrow-circle-up" />
              </q-btn>
              </q-fixed-position>
          -->
      </div>
    </div>
    <q-tabs slot="footer" style="position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 99;" v-model="tab" v-if="$FAST_CONFIG.TAB_MENU">
      <q-tab
        icon="fa-file"
        slot="title"
        v-for="(page, index) in _pages"
        :key="page.title" @click="goToPage(index)"
        :ref="'page-'+ index + 1"
        :name="(index + 1).toString()"
        v-bind:class="currentPage === index ? 'activePage' : ''"
        :label="$t(getLabelForPage(page))">
      </q-tab>
    </q-tabs>
  </div>
</template>

<script>
import {
  QInput,
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QFab,
  QFabAction,
  QFixedPosition,
  QPullToRefresh,
  QTabs,
  QTab,
  QTabPane,
  QRouteTab,
  QCollapsible,
  QBtn,
  QIcon,
  QTooltip,
  QList,
  QItem,
  QItemSeparator,
  Loading,
  QItemMain,
  QTransition,
  QInnerLoading,
  QSpinnerAudio,
  QPopover,
  QItemSide
} from 'quasar';
import to from 'await-to-js';
import _get from 'lodash/get';
import FormioUtils from 'formiojs/utils';
import {
  Form,
  Auth,
  Submission,
  Event,
  ParallelSurvey,
  OfflinePlugin
} from 'fast-fastjs';
// import formio from 'modules/Formio/components/formio/formio';
import breadcrum from 'components/breadcrum';
import datatable from 'components/dataTable/dataTable';
import { Promise } from 'bluebird';
import executor from '../../components/Rexecutor/executor';
import { Form as vForm } from 'vue-formio';
import Formio from 'formiojs/Formio';
import ErrorFormatter from 'components/dataTable/submission/errorFormatter';
export default {
  components: {
    formiovue: vForm,
    breadcrum,
    datatable,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QFab,
    QFabAction,
    QFixedPosition,
    QPullToRefresh,
    QTabs,
    QTab,
    QRouteTab,
    QTabPane,
    QCollapsible,
    QBtn,
    QIcon,
    QTooltip,
    QList,
    QItem,
    QItemSeparator,
    Loading,
    QItemMain,
    QTransition,
    QInnerLoading,
    QSpinnerAudio,
    QPopover,
    QItemSide,
    QInput,
    executor
  },
  async mounted() {
    this.$eventHub.$on('FAST:LANGUAGE:CHANGED', this.changeLanguage);

    this.$eventHub.on('formio.mounted', (formio) => {
      // this.pages = formio.pages ? formio.pages : [];
    });

    this.$eventHub.on('formio.nextPage', (data) => {
      this.currentPage = data.nextPage.page;
      this.tab = (data.nextPage.page + 1).toString();
      this.currentQuestion = -1;
      window.scrollTo(0, 0);
    });

    this.$eventHub.on('formio.prevPage', (data) => {
      this.currentPage = data.prevPage.page;
      this.tab = (data.prevPage.page + 1).toString();
      this.currentQuestion = -1;
      window.scrollTo(0, 0);
    });

    this.$eventHub.on('formio.render', (data) => {
      this.isWizard = !!data.formio.wizard;
    });

    Event.listen({
      name: 'FAST:FORMIO:RENDERED',
      callback: this.showWizard
    });

    Event.listen({
      name: 'FAST:SUBMISSION:CHANGED',
      callback: this.draftStatusChanged
    });

    Event.listen({
      name: 'FAST:SUBMISSION:CLONE',
      callback: this.clone
    });

    Event.listen({
      name: 'FAST:SUBMISSION:SOFTDELETE',
      callback: this.softDelete
    });
    // document.addEventListener('FAST:SUBMISSION:CANCEL', this.cancel);
    Event.listen({
      name: 'FAST:SUBMISSION:CANCEL',
      callback: this.cancel
    });

    Event.listen({
      name: 'FAST:WIZARD:NEXT',
      callback: this.singleNext
    });

    Event.listen({
      name: 'FAST:WIZARD:PREVIOUS',
      callback: this.singlePrevious
    });

    Event.listen({
      name: 'FAST:WIZARD:VALIDATE',
      callback: this.validate
    });
  },
  beforeDestroy() {
    this.$eventHub.$off('FAST:LANGUAGE:CHANGED', this.changeLanguage);
    Event.remove({
      name: 'FAST:FORMIO:RENDERED',
      callback: this.showWizard
    });

    Event.remove({
      name: 'FAST:SUBMISSION:CANCEL',
      callback: this.cancel
    });
    Event.remove({
      name: 'FAST:SUBMISSION:CHANGED',
      callback: this.draftStatusChanged
    });
    Event.remove({
      name: 'FAST:SUBMISSION:CLONE',
      callback: this.clone
    });
    Event.remove({
      name: 'FAST:SUBMISSION:SOFTDELETE',
      callback: this.softDelete
    });

    Event.remove({
      name: 'FAST:WIZARD:PREVIOUS',
      callback: this.singlePrevious
    });

    Event.remove({
      name: 'FAST:WIZARD:NEXT',
      callback: this.singlePrevious
    });

    Event.remove({
      name: 'FAST:WIZARD:VALIDATE',
      callback: this.validate
    });

    this.$eventHub.$off('VALIDATION_ERRORS');
  },
  asyncData: {
    submission: {
      async get() {
        return new Promise((resolve, reject) => {
          this.$swal({
            title: 'Loading...',
            text: this.$t(
              'Getting the submission. This can take a couple seconds...'
            ),
            showCancelButton: false,
            onOpen: async () => {
              this.$swal.showLoading();
              let resultSubmission;
              if (this.$route.query && this.$route.query.mode) {
                let submissionId =
                  this.$route.params.idSubmission === 'own_unique_from'
                    ? Auth.user()._id
                    : this.$route.params.idSubmission;
                let loadedSubmission = await this.loadSubmission(submissionId);
                this.$swal.close();
                resultSubmission = loadedSubmission.data;
              } else if (this.$route.params.idSubmission) {
                this.$swal.close();
                let s = await Submission.local().get(
                  this.$route.params.idSubmission
                );
                resultSubmission = s.data.data;
              } else {
                this.$swal.close();
                resultSubmission = undefined;
              }
              resolve(resultSubmission);
            }
          });
        });
      },
      transform(result) {
        return { data: result };
      }
    },
    participants: {
      get() {
        return Submission.local().getParallelParticipants(
          this.$route.params.idForm,
          this.$route.params.idSubmission
        );
      },
      transform(result) {
        return result;
      }
    },
    form: {
      get() {
        if (this.$route.params.idForm) {
          return Form.local().findOne({
            'data.path': this.$route.params.idForm
          });
        }
      },
      transform(result) {
        return result.data;
      }
    },
    options: {
      async get() {
        let i18n = await OfflinePlugin.getLocalTranslations();
        let readOnly = !!(
          ['online-review', 'read-only'].indexOf(this.editMode) >= 0
        );

        return { i18n, readOnly };
      },
      transform(result) {
        return result;
      }
    }
  },
  computed: {
    formTitle() {
      return this.form && this.form && this.form.title
        ? this.$t(this.form.title)
        : '';
    },
    participantName() {
      let parallelSurvey = null;
      let submission = this.currentSubmission;
      if (submission && submission.data && submission.data.parallelSurvey) {
        try {
          parallelSurvey = JSON.parse(submission.data.parallelSurvey);
        } catch (e) {
          parallelSurvey = submission.data.parallelSurvey;
        }
        return parallelSurvey.participantName;
      } else {
        return '';
      }
    },
    _pages() {
      return this.pages;
    },
    _isWizard() {
      return this.isWizard;
    },
    getFormClass() {
      let className = '';
      if (this.showPages && this._isWizard && !this.$FAST_CONFIG.TAB_MENU) {
        className = 'formNavActive';
      }
      if (!this.saved) {
        className = className + ' saving';
      }
      return className;
    },
    currentSubmission() {
      if (this.submission && this.submission.data) {
        return this.submission.data;
      } else {
        return {};
      }
    },
    getFormioClass() {
      if (
        this.form &&
        this.form &&
        this.form.properties &&
        this.form.properties.FAST_WIZARD_CUSTOM_NAVIGATION === 'true'
      ) {
        return 'noNavegation';
      }
    }
  },
  data: function() {
    return {
      formUrl: this.$FAST_CONFIG.APP_URL + '/' + this.$route.params.idForm,
      people: [
        {
          name: 'P1'
        }
      ],
      formioToken: Auth.user().x_jwt_token,
      saved: true,
      errors: {},
      isWizard: false,
      pages: [],
      currentPage: 0,
      showPages: this.$FAST_CONFIG.NAVIGATION_OPENED,
      currentQuestion: -1,
      displayUp: false,
      displayDown: true,
      parallelSub: [],
      tab: '1',
      customRender: false,
      customRenderType: '',
      customRenderArray: [],
      changeEvent: null,
      activeSubmission: null,
      FormioInstance: new Formio(this.formUrl),
      RenderedFormInstace: null,
      timeoutId: null,
      editMode: this.$route.query.mode,
      language: localStorage.getItem('defaultLenguage')
        ? localStorage.getItem('defaultLenguage')
        : 'en',
    };
  },
  methods: {
    changeLanguage(language) {
      this.language = language.code;
    },
    registerOfflinePlugin() {
      // De register if there was a previous registration
      Formio.deregisterPlugin('offline');
      // Register the plugin for offline mode
      Formio.registerPlugin(
        OfflinePlugin.getPlugin({
          formio: new Formio(this.formUrl)
        }),
        'offline'
      );
    },
    getButtonPosition() {
      let position = 'top-right';
      if (this.$getDirection() === 'pull-right') {
        position = 'top-left';
      }
      return position;
    },
    showWizard(event) {
      this.isWizard = !!event.detail.data.formio.wizard;
    },
    onSubmissionChange(event) {
      if (event.changed) {
        // TODO This is one step behind of the User actions Needs to be fixed
        this.pages = event.changed.instance.root.pages;
      }
      if (event.data) {
        this.activeSubmission = event.data;
        this.changeEvent = JSON.stringify(event.data);
      }
      if (this.shouldAutoSave()) {
        this.autoSaveTimer();
      }
    },
    onFormSubmit(event) {
      let formSubmission = {
        data: this.activeSubmission,
        draft: false,
        redirect: true,
        trigger: 'formioSubmit',
        syncError: false
      };
      this.save(formSubmission).then((created) => {
        /*
        this.$swal(
          'Draft Saved!',
          'Your submission has been saved! You can continue editing later',
          'success'
        );
        */
        this.redirectIntended({ submission: formSubmission, created });
      });
    },
    onFormError(event) {
      this.$swal({
        type: 'error',
        title: this.$t('Error'),
        html:
          this.$t('You have errors in the submission') +
          '. <br><strong>' +
          this.$t(event[0].component.label) +
          '</strong>: <br>' +
          this.$t(event[0].message)
      }).then(() => {
        let id = event[0].component.id;
        // let element = document.querySelector("[name='data[" + key + "]']")
        document.getElementById(id).scrollIntoView();
        // window.scroll(0, -100);
      });
    },
    cancel() {
      if (document.getElementsByClassName('formio-dialog').length > 0) {
        document
          .getElementsByClassName('formio-dialog-close pull-right')[0]
          .click();
        return;
      }
      if (document.getElementsByClassName('breadCrumbBackToShow').length > 0) {
        document.getElementsByClassName('breadCrumbBackToShow')[0].click();
        return;
      }
      window.history.back();
    },
    async clone() {
      let parent = this.$route.query.parent
        ? this.$route.query.parent
        : btoa(JSON.stringify('null'));
      let clone = this.activeSubmission
        ? this.activeSubmission
        : this.currentSubmission;
      this.$router.push({
        name: 'formio_form_submission',
        params: {
          idForm: this.$route.params.idForm,
          clonedSubmission: clone
        },
        query: {
          parent: parent
        }
      });
    },
    async softDelete() {
      await Submission.remote().softDelete({
        id: this.$route.params.idSubmission,
        formPath: this.$route.params.idForm
      });
      this.cancel();
    },
    showReport() {
      this.$router.push({
        name: 'formio_submission_report',
        params: {
          idForm: this.$route.params.idForm,
          idSubmission: this.$route.params.idSubmission
        }
      });
    },
    async reviewSubmission(revision) {
      let err;
      let submission = this.submission.data;
      submission.data.deleted = revision !== 'accept';

      this.$swal({
        title: 'Saving...',
        text: this.$t(
          'The information is being saved. This can take a couple seconds...'
        ),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          [err] = await to(
            Submission.remote().update(submission, this.$route.params.idForm)
          );

          if (err) {
            this.$swal.close();
            this.$swal(
              this.$t('Save error'),
              this.$t("You don't have access to modify this submission"),
              'error'
            );
            throw new Error('Submission was not saved');
          }
          this.$swal.close();
          this.$router.push({
            name: 'alldata',
            query: {
              form: this.$route.params.idForm
            }
          });
        }
      });
    },
    async save(formSubmission) {
      let id = this.$route.params.idSubmission;
      if (!id) {
        return;
      }
      if (id.includes('_local')) {
        formSubmission._lid = id;
      } else {
        formSubmission._id = id;
      }

      // Normal URL

      let url = this.$FAST_CONFIG.APP_URL + '/' + this.$route.params.idForm;
      if (this.$route.params.idSubmission === 'own_unique_from') {
        url = this.$FAST_CONFIG.APP_URL + '/' + this.$route.query.form;
      }

      let formio = new Formio(url);

      if (this.editMode === 'online' || !this.$FAST_CONFIG.OFFLINE_FIRST) {
        this.onlineSave(formSubmission, formio);
        return;
      }

      this.registerOfflinePlugin();
      return this.FormioInstance.saveSubmission(formSubmission);
    },
    saveAsDraft() {
      let formSubmission = {
        data: this.activeSubmission,
        redirect: true,
        draft: true,
        syncError: false,
        trigger: 'saveAsLocalDraft'
      };

      this.save(formSubmission).then((created) => {
        this.$swal(
          'Draft Saved!',
          'Your submission has been saved! You can continue editing later',
          'success'
        );
        this.redirectIntended({ submission: formSubmission, created });
      });
    },
    autoSaveAsDraft() {
      let formSubmission = {
        data: this.activeSubmission,
        redirect: false,
        draft: true,
        syncError: false,
        trigger: 'autoSaveAsDraft'
      };
      return this.save(formSubmission);
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
    async redirectIntended({ submission, created }) {
      if (submission.redirect === true) {
        switch (this.$FAST_CONFIG.SAVE_REDIRECT) {
          case 'dashboard':
            this.$router.push({
              name: 'dashboard'
            });
            break;
          case 'collected':
            this.$router.push({
              name: 'formio_form_show',
              params: {
                idForm: this.FormioInstance.formId
              }
            });
            break;
          default:
            this.$router.push({
              name: 'dashboard'
            });
            break;
        }
      }
    },
    goToPage(index) {
      if (
        this._pages[index] &&
        this._pages[index].properties &&
        this._pages[index].properties['FAST_CUSTOM_DG']
      ) {
        let dataGridName = this._pages[index].properties['FAST_CUSTOM_DG'];
        this.customRenderType = 'datagrid';
        let component = FormioUtils.getComponent(
          this.form.components,
          dataGridName
        );

        let keys = component.components.reduce((r, c) => {
          r[c.key] = '';
          return r;
        }, {});

        this.customRenderArray = this.submission.data.data[dataGridName];
        this.customRenderArray = this.customRenderArray
          ? this.customRenderArray
          : [];

        this.customRenderArray.forEach((a) => {
          a = { ...keys, ...a };
        });

        this.customRender = true;
        this.currentPage = index;
        this.tab = (index + 1).toString();
        this.currentQuestion = -1;
        window.scrollTo(0, 0);
        return;
      }

      if (
        this._pages[index] &&
        this._pages[index].properties &&
        this._pages[index].properties['FAST_CUSTOM_SCRIPT']
      ) {
        let scriptName = this._pages[index].properties['FAST_CUSTOM_SCRIPT'];
        this.customRenderType = 'script';
        let component = FormioUtils.getComponent(
          this.form.components,
          scriptName
        );
        console.log(component);
        this.customRender = true;
        this.currentPage = index;
        this.tab = (index + 1).toString();
        this.currentQuestion = -1;
        window.scrollTo(0, 0);
        return;
      }

      this.customRender = false;
      try {
        let pageNumber = (index + 1).toString();
        let page = document.querySelectorAll(
          'ul.pagination li:nth-of-type(' + pageNumber + ')'
        )[0];
        page.click();
        this.currentPage = index;
        this.tab = (index + 1).toString();
        this.currentQuestion = -1;
        window.scrollTo(0, 0);
        if (this.$FAST_CONFIG.NAVIGATION_AUTOCLOSE_ON_SELECTION) {
          this.togglePages();
        }
      } catch (e) {
        this.$swal('Complete the required fields');
      }
    },
    singleNext() {
      let button1 = document.querySelectorAll('.btn-wizard-nav-next')[0];
      button1.click();
    },
    singlePrevious() {
      let button1 = document.querySelectorAll('.btn-wizard-nav-previous')[0];
      button1.click();
    },
    clickNext() {
      this.goToPage(0);
      for (var i = 1; i <= 30; ++i) {
        setDelay(i);
      }

      function setDelay(i) {
        setTimeout(function() {
          let button1 = document.querySelectorAll('.btn-wizard-nav-next')[0];
          button1.click();
        }, 300);
      }
    },
    togglePages() {
      this.showPages = !this.showPages;
    },
    reloadPage() {
      this.$swal({
        title: 'Are you sure?',
        text: 'You will lost all unsaved Data',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reload it!'
      }).then(async () => {
        window.location.reload(true);
      });
    },
    nextQuestion() {
      let elements = document.getElementsByClassName('form-group');
      this.currentQuestion =
        this.currentQuestion + 1 >= elements.length
          ? elements.length
          : this.currentQuestion + 1;
      this.displayDown = !(this.currentQuestion + 1 >= elements.length);
      elements[this.currentQuestion].scrollIntoView(true);
      this.displayUp = true;
    },
    prevQuestion() {
      let elements = document.getElementsByClassName('form-group');
      this.currentQuestion =
        this.currentQuestion - 1 <= 0 ? 0 : this.currentQuestion - 1;
      elements[this.currentQuestion].scrollIntoView(true);
      this.displayUp = !(this.currentQuestion <= 0);
      this.displayDown = true;
    },
    openRightDrawer() {
      this.$eventHub.$emit('openRightDrawer');
    },
    draftStatusChanged(e) {
      if (e.detail.data.isSubmit) {
        this.$swal(
          this.$t('Sent!'),
          this.$t('Your submission has been sent!'),
          'success'
        );
      }
      if (e.detail.data === false) {
        this.saved = false;
      } else {
        this.saved = true;
      }
    },
    async addSurvey() {
      let wizard = await ParallelSurvey.createWizard({
        submission: this.currentSubmission,
        vm: this
      });

      this.$swal.setDefaults({
        input: 'text',
        confirmButtonText: this.$t('next') + '&rarr;',
        showCancelButton: true,
        progressSteps: wizard.progressSteps
      });

      this.$swal.queue(wizard.steps).then(async (result) => {
        this.$swal.resetDefaults();

        let surveyData = await ParallelSurvey.createNewSurvey({
          submission: this.currentSubmission,
          vm: this,
          info: result
        });

        let created = await ParallelSurvey.storeNewSurvey({
          vm: this,
          survey: surveyData
        });
        this.$router.push({
          name: 'formio_submission_update',
          params: {
            idForm: this.$route.params.idForm,
            idSubmission: created._id
          }
        });
      });
    },
    async groupConfig() {
      let groupId = _get(
        Submission.local().getParallelSurvey(this.currentSubmission),
        'groupId',
        undefined
      );

      let options = await Submission.local().getGroups(
        this.$route.params.idForm
      );
      let customOptions = {};
      options.forEach((option) => {
        customOptions[option.groupId] = option.groupName;
      });
      let currentGroup = await Submission.local().getParallelSurvey(
        this.currentSubmission
      );
      currentGroup = currentGroup.groupId ? currentGroup.groupId : undefined;
      delete customOptions[currentGroup];

      let steps = [];
      let progressSteps = [];

      if (groupId) {
        progressSteps = ['1'];
        steps = [
          {
            title: this.$t('Change Group'),
            input: 'select',
            inputOptions: customOptions,
            inputPlaceholder: this.$t('Select the destination group'),
            inputValidator: (value) => {
              return new Promise((resolve, reject) => {
                if (value !== '') {
                  resolve();
                } else {
                  let error = new Error(
                    this.$t('You must select a destination group')
                  );
                  reject(error);
                }
              });
            }
          }
        ];
      } else {
        progressSteps = ['1', '2'];
        steps = [
          {
            title: this.$t('Participant Name'),
            text: this.$t('Give the current participant a name'),
            inputValidator: (value) => {
              return new Promise((resolve, reject) => {
                if (value !== '') {
                  resolve();
                } else {
                  let error = new Error(
                    this.$t('The participant name can´t be empty')
                  );
                  reject(error);
                }
              });
            }
          },
          {
            title: 'Select Group',
            input: 'select',
            inputOptions: customOptions,
            inputPlaceholder: this.$t('Select a group to assign'),
            inputValidator: (value) => {
              return new Promise((resolve, reject) => {
                if (value !== '') {
                  resolve();
                } else {
                  let error = new Error(this.$t('You must select a group'));
                  reject(error);
                }
              });
            }
          }
        ];
      }

      this.$swal.setDefaults({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: progressSteps
      });

      this.$swal.queue(steps).then(async (result) => {
        this.$swal.resetDefaults();
        await Submission.local().assingToGroup(
          this.$route.params.idSubmission,
          result
        );
        setTimeout(function() {
          window.location.reload(true);
        }, 1500);
      });
    },
    getLabelForPage(page) {
      let label = page.title;
      return label;
    },
    goToSurvey(id) {
      this.$router.push({
        name: 'formio_submission_update',
        params: {
          idForm: this.$route.params.idForm,
          idSubmission: id
        }
      });
    },
    async loadSubmission(_id, includeLocal) {
      this.loading = true;
      let err;
      let submission;
      let formId =
        (this.$route.params.idSubmission === 'own_unique_from' &&
          this.$route.query.form) ||
        this.$route.params.idForm;
      [err, submission] = await to(
        Submission.remote().find({
          form: formId,
          filter: [
            {
              element: '_id',
              query: '=',
              value: _id
            }
          ],
          limit: 1
        })
      );
      submission = submission && submission[0] ? submission[0] : null;

      if (includeLocal && err) {
        [err, submission] = await to(
          Submission.local().find({
            filter: {
              _id
            }
          })
        );
      }
      if (err) {
        this.$swal.close();
        this.$swal(
          this.$t('Conexion error'),
          this.$t("We couldn't get the submission from the server"),
          'error'
        );
        throw new Error('Submission was not retreived');
      }

      this.loading = false;
      return submission;
    },
    shouldAutoSave() {
      let draftEnabled = this.$FAST_CONFIG.LOCAL_DRAFT_ENABLED;
      let inDraftModes =
        ['online', 'online-review', 'read-only'].indexOf(this.editMode) < 0;
      return !!(draftEnabled && inDraftModes);
    },
    autoSaveTimer() {
      this.saved = false;
      // AutoSave functionality
      // If a timer was already started, clear it.
      if (this.timeoutId) clearTimeout(this.timeoutId);

      // Set timer that will save comment when it fires.
      this.timeoutId = setTimeout(async () => {
        await this.autoSaveAsDraft();
        this.saved = true;
      }, 700);
    }
  }
};
</script>

