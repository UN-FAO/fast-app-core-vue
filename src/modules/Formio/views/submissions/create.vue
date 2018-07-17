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

                <formio
                :formURL="$FAST_CONFIG.APP_URL + '/' + $route.params.idForm"
                :submission="submission"
                :formioToken="formioToken"
                :localDraft="$FAST_CONFIG.LOCAL_DRAFT_ENABLED"
                :readOnly="false"
                :autoCreate="autoCreate"
                :editMode="this.$route.query.mode"
                :parentPage="this.$route.params.FAST_PARENT_PAGE"
                v-bind:style="{ display: !customRender ? 'initial' : 'none' }" />

                <div v-bind:style="{ display: customRender ? 'initial' : 'none', color: 'black' }">

                <div
                  v-bind:style="{ display: customRenderType === 'script' ? 'initial' : 'none' }"
                >
                 <executor
                  :submission="changeEvent"
                  openCpuUrl="https://public.opencpu.org"
                  :formioUrl="$FAST_CONFIG.APP_URL"
                  :token="formioToken"
                  />
                </div>
                  <datatable
                    :data="customRenderArray"
                    :form="currentForm"
                    fastMode="editGrid"
                    v-if="currentForm && currentForm.data.title !== '' && customRenderType === 'datagrid'"
                  />
                </div>
              </q-tab-pane>

            </q-tabs>

          </q-card-main>
        </q-card>

        <q-fixed-position corner="top-right" :offset="[18, 18]" v-if="this.$route.query.mode === 'online-review'">

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
import { Form, Auth, Submission, Event, ParallelSurvey } from 'fast-fastjs';
import formio from 'modules/Formio/components/formio/formio';
import breadcrum from 'components/breadcrum';
import datatable from 'components/dataTable/dataTable';
import { Promise } from 'bluebird';
import executor from '../../components/Rexecutor/executor';
export default {
  components: {
    breadcrum,
    datatable,
    formio,
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
    this.$eventHub.on('formio.mounted', (formio) => {
      this.pages = formio.pages ? formio.pages : [];
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
      name: 'FAST:FORMIO:CHANGE',
      callback: this.onSubmissionChange
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

    this.$eventHub.$on('formio.error', (error) => {
      console.log(error);
      if (
        error.error.message === "Cannot read property 'notice' of null" ||
        error.error.message ===
          "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
      ) {
      } else {
        this.$swal({
          type: 'error',
          title: this.$t('Error'),
          html: this.$t('You have errors in the submission')
        }).then(() => {
          window.scrollTo(0, 0);
        });
      }
    });
  },
  beforeDestroy() {
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

    this.$eventHub.$off('formio.error');
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
              if (this.$route.query && this.$route.query.mode) {
                let loadedSubmission = await this.loadSubmission(
                  this.$route.params.idSubmission
                );
                this.$swal.close();
                resolve({
                  data: loadedSubmission
                });
              }
              if (this.$route.params.idSubmission) {
                this.$swal.close();
                let s = await Submission.local().get(
                  this.$route.params.idSubmission
                );
                resolve(s);
              } else {
                this.$swal.close();
                resolve(undefined);
              }
            }
          });
        });
      },
      transform(result) {
        return result;
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
    currentForm: {
      get() {
        if (this.$route.params.idForm && !Form.message) {
          return Form.local().findOne({
            'data.path': this.$route.params.idForm
          });
        } else {
          return {
            data: {
              title: ''
            }
          };
        }
      },
      transform(result) {
        return result;
      }
    }
  },
  computed: {
    formTitle() {
      return this.currentForm &&
        this.currentForm.data &&
        this.currentForm.data.title
        ? this.$t(this.currentForm.data.title)
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
    }
  },
  data: function() {
    return {
      form: null,
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
      autoCreate:
        !this.$route.params.idSubmission && this.$FAST_CONFIG.OFFLINE_FIRST,
      tab: '1',
      customRender: false,
      customRenderType: '',
      customRenderArray: [],
      changeEvent: null
    };
  },
  methods: {
    onSubmissionChange(event) {
      let data = event.detail.data;
      this.pages = data.formio.pages ? data.formio.pages : [];
      if (data.formio.data && data.formio.data.variables) {
        this.changeEvent = JSON.stringify(data.formio.data);
      }
    },
    cancel() {
      if (document.getElementsByClassName('formio-dialog').length > 0) {
        document
          .getElementsByClassName('formio-dialog-close pull-right')[0]
          .click();
        return;
      }
      window.history.back();
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
    saveAsDraft() {
      // Create the event
      var saveAsDraft = new CustomEvent('saveAsDraft', {
        detail: {
          data: {},
          text: 'Save as Draft Requested'
        }
      });
      document.dispatchEvent(saveAsDraft);
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
          this.currentForm.data.components,
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
          this.currentForm.data.components,
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
    submitForm() {
      let submit = document.querySelectorAll('.btn-wizard-nav-submit')[0];
      if (submit) {
        submit.click();
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

      [err, submission] = await to(
        Submission.remote().find({
          form: this.$route.params.idForm,
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
    }
  }
};
</script>

