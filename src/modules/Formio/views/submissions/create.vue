<template>
  <div class="container-fluid">
    <div class="row FormioContainer">
      <div class="formPageContainer" style="margin-top:30px; overflow-x:scroll;margin-bottom: 100px;">


        <q-card style="background-color: white; max-height: fit-content;" class="formNav" v-if="_isWizard && showPages && !$FAST_CONFIG.TAB_MENU">
          <q-card-main>
            <q-list separator style="border: none !important">

              <q-item class="formioPagination" multiline style="text-align: left; min-height: 60px; border-radius: 5px;" link v-for="(page, index) in _pages" :key="page.title" @click="goToPage(index)" :ref="'page-'+ index" v-bind:class="currentPage === index ? 'activePage' : ''">
                <q-item-main style=" margin-top: auto;  margin-bottom: auto;" :label="$t(getLabelForPage(page))" label-lines="3" />
              </q-item>
            </q-list>
          </q-card-main>
        </q-card>

        <q-card color="white" v-bind:class="getFormClass" style="">
          <q-card-main>
            <!--
              <q-btn @click="singleNext()" class="pull-right primary" color="primary">Next Page</q-btn>
                <q-btn @click="clickNext()" class="pull-right primary" color="primary">Full review</q-btn>
                <q-btn @click="submitForm()" class="pull-right primary" color="danger">Submit</q-btn>
              -->
            <!--<q-icon name="thumb_up" />-->
            <q-tabs inverted id="contentForm" v-model="selectedTab">
              <!-- Tabs - notice slot="title" -->

              <q-tab v-bind:class="!$FAST_CONFIG.PARALLEL_SURVEYS ? 'hidden' : ''" default slot="title" name="tab-1" icon="person" :label="participantName" :color="saved ? 'primary' : 'red'" />
              <!-- Targets -->
              <q-tab slot="title" v-if="participant.submissionId !== $route.params.idSubmission" v-for="participant in participants" :key="participant.submissionId" icon="person" :label="participant.participantName" :color="saved ? 'primary' : 'red'" @click="goToSurvey(participant.submissionId)"
              />

              <q-tab-pane name="tab-1" ref="tab1">

                <formio :formURL="$FAST_CONFIG.APP_URL + '/' + $route.params.idForm" :submission="submission" :formioToken="formioToken" :localDraft="$FAST_CONFIG.LOCAL_DRAFT_ENABLED" :readOnly="readOnly" :autoCreate="autoCreate" :editMode="this.$route.params.FAST_EDIT_MODE"
                  v-bind:style="{ display: !customRender ? 'initial' : 'none' }" />

                <div v-bind:style="{ display: customRender ? 'initial' : 'none', color: 'black' }">

                  <datatable
                    :data="customRenderArray"
                    :form="currentForm"
                    fastMode="editGrid"
                    v-if="currentForm && currentForm.data.title !== ''"
                  />
                </div>
              </q-tab-pane>

            </q-tabs>

          </q-card-main>
        </q-card>

        <q-fixed-position corner="top-right" :offset="[18, 18]">
          <q-fab color="red" icon="add" direction="down" v-if="!this.$route.params.FAST_EDIT_MODE">

            <q-fab-action color="primary" @click="saveAsDraft()" icon="fa-floppy-o">
              <q-tooltip>{{$t('Save as draft')}}</q-tooltip>
            </q-fab-action>

            <q-fab-action v-bind:class="!$FAST_CONFIG.PARALLEL_SURVEYS ? 'hidden' : ''" color="amber" @click="addSurvey()" icon="person_add">
              <q-tooltip>{{$t('Add participant')}}</q-tooltip>
            </q-fab-action>

            <q-fab-action v-bind:class="!$FAST_CONFIG.PARALLEL_SURVEYS ? 'hidden' : ''" color="purple-6" @click="groupConfig()" icon="fa-users">
              <q-tooltip>{{$t("Change Group")}}</q-tooltip>

            </q-fab-action>


            <q-fab-action color="red" @click="openRightDrawer()" icon="assessment" v-if="$FAST_CONFIG.HAS_SCORES">
              <q-tooltip>{{$t('Show scores')}}</q-tooltip>
            </q-fab-action>

            <q-fab-action color="secondary" @click="togglePages" icon="menu" v-if="_isWizard && !$FAST_CONFIG.TAB_MENU">
              <q-tooltip>{{$t('Show pages')}}</q-tooltip>
            </q-fab-action>

            <q-fab-action color="secondary" @click="exportPDF()" icon="print"></q-fab-action>

          </q-fab>
          <q-fab color="red" icon="add" direction="down" v-if="this.$route.params.FAST_EDIT_MODE">

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
    <q-tabs slot="footer" v-model="tab" v-if="$FAST_CONFIG.TAB_MENU" class="floatingPagination">
      <q-tab icon="fa-file" slot="title" v-for="(page, index) in _pages" :key="page.title" @click="goToPage(index)" :ref="'page-'+ index + 1" :name="index + 1" v-bind:class="currentPage === index ? 'activePage' : ''" :label="$t(getLabelForPage(page))">
      </q-tab>
    </q-tabs>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
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
  QSpinnerAudio
} from "quasar";
import to from "await-to-js";
import uuidv4 from "uuid/v4";
import _get from "lodash/get";
import Formio from "formiojs";
import _forEach from "lodash/forEach";
import _groupBy from "lodash/groupBy";
import _debounce from "lodash/debounce";
import FormioUtils from "formiojs/utils";
import Form from "libraries/fastjs/database/models/Form";
import Auth from "modules/Auth/api/Auth";
import Submission from "libraries/fastjs/database/models/Submission";
import formio from "modules/Formio/components/formio/formio";
import OFFLINE_PLUGIN from "modules/Formio/components/formio/src/offlinePlugin";
import PdfExport from "modules/Wrappers/PdfExport";
import datatable from "components/dataTable/dataTable";
export default {
  components: {
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
    QSpinnerAudio
  },
  async mounted() {
    this.$eventHub.on("formio.mounted", formio => {
      this.pages = formio.pages ? formio.pages : [];
    });

    this.$eventHub.on("formio.nextPage", data => {
      this.currentPage = data.nextPage.page;
      this.tab = data.nextPage.page + 1;
      this.currentQuestion = -1;
      window.scrollTo(0, 0);
    });

    this.$eventHub.on("formio.prevPage", data => {
      this.currentPage = data.prevPage.page;
      this.tab = data.prevPage.page + 1;
      this.currentQuestion = -1;
      window.scrollTo(0, 0);
    });

    this.$eventHub.on("formio.render", data => {
      this.isWizard = !!data.formio.wizard;
    });

    this.validateRequired = _debounce(this.validateRequired, 400);
    this.createScorePanels = _debounce(this.createScorePanels, 400);

    this.$eventHub.on("formio.change", data => {
      this.pages = data.formio.pages ? data.formio.pages : [];
      this.validateRequired(this.pages, data);
      this.createScorePanels(this.pages, data);
    });

    document.addEventListener("draftStatus", this.draftStatusChanged);

    this.$eventHub.$on("formio.error", error => {
      console.log(error);
      if (
        error.error.message === "Cannot read property 'notice' of null" ||
        error.error.message ===
          "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
      ) {
      } else {
        this.$swal({
          type: "error",
          title: "Error",
          html: "You have errors in the submission"
        }).then(() => {
          window.scrollTo(0, 0);
        });
      }
    });
    this.$eventHub.on("VALIDATION_ERRORS", data => {
      /*
              this.errors = data
              let submitButton = document.querySelector('.btn-wizard-nav-submit')
              if (submitButton && this.errors.count > 0) {
                submitButton.disabled = true
              } else {
                if (submitButton) {
                  submitButton.disabled = false
                }
              }
              */
    });
  },
  beforeDestroy() {
    document.removeEventListener("draftStatus", this.draftStatusChanged);
    this.$eventHub.$off("formio.error");
    this.$eventHub.$off("VALIDATION_ERRORS");
  },
  asyncData: {
    submission: {
      get() {
        if (this.$route.params.fullSubmision) {
          return {
            data: this.$route.params.fullSubmision
          };
        }
        if (this.$route.params.idSubmission) {
          return Submission.local().get(this.$route.params.idSubmission);
        } else {
          return undefined;
        }
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
    }
  },
  asyncComputed: {
    currentForm: {
      get() {
        if (this.$route.params.idForm) {
          return Form.local().findOne({
            "data.path": this.$route.params.idForm
          });
        } else {
          return {
            data: {
              title: ""
            }
          };
        }
      }
    }
  },
  computed: {
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
        return "";
      }
    },
    _pages() {
      return this.pages;
    },
    _isWizard() {
      return this.isWizard;
    },
    getFormClass() {
      let className = "";
      if (this.showPages && this._isWizard && !this.$FAST_CONFIG.TAB_MENU) {
        className = "formNavActive";
      }
      if (!this.saved) {
        className = className + " saving";
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
          name: "P1"
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
      autoCreate: !this.$route.params.idSubmission,
      readOnly: false,
      tab: 1,
      customRender: false,
      customRenderArray: []
    };
  },
  methods: {
    ...mapActions(["getResources"]),
    async reviewSubmission(revision) {
      let err;
      let submission = this.$route.params.fullSubmision;

      submission.data.deleted = revision !== "accept";

      [err] = await to(
        Submission.remote(this.$route.params.idForm).save({
          submission: submission
        })
      );

      if (err) throw new Error("Submission was not saved");

      this.$router.push({
        name: "alldata",
        query: {
          form: this.$route.params.idForm
        }
      });
    },
    saveAsDraft() {
      // Create the event
      var saveAsDraft = new CustomEvent("saveAsDraft", {
        detail: {
          data: {},
          text: "Save as Draft Requested"
        }
      });
      document.dispatchEvent(saveAsDraft);
    },
    createScorePanels(pages, data) {
      // Search all of the Score components in different pages
      let scorePanels = [];
      _forEach(pages, page => {
        let panels = FormioUtils.findComponents(page.components, {
          type: "panel"
        });
        if (panels.length > 0) {
          _forEach(panels, (panel, index) => {
            // Make sure that the panel contains Score
            if (panel.key.indexOf("score") !== -1) {
              _forEach(panel.components, (component, cindex) => {
                // Search the current value of the Score and add it
                component.value = data.formio.data[component.key];
              });
              scorePanels.push(panel);
            }
          });
        }
      });
      this.scorePanels = scorePanels;
    },
    goToPage(index) {
      if (
        this._pages[index] &&
        this._pages[index].properties &&
        this._pages[index].properties["custom-render"]
      ) {
        let dataGridName = this._pages[index].properties["custom-render"];
        console.log("this.submission", this.submission);
        this.customRenderArray = this.submission.data.data[dataGridName];
        this.customRenderArray = this.customRenderArray
          ? this.customRenderArray
          : [];
        this.customRender = true;
        this.currentPage = index;
        this.tab = index + 1;
        this.currentQuestion = -1;
        window.scrollTo(0, 0);
        return;
      }
      this.customRender = false;
      try {
        let pageNumber = index + 1;
        let page = document.querySelectorAll(
          "ul.pagination li:nth-of-type(" + pageNumber + ")"
        )[0];
        page.click();
        this.currentPage = index;
        this.tab = index + 1;
        this.currentQuestion = -1;
        window.scrollTo(0, 0);
        if (this.$FAST_CONFIG.NAVIGATION_AUTOCLOSE_ON_SELECTION) {
          this.togglePages();
        }
      } catch (e) {
        this.$swal("Complete the required fields");
      }
    },
    singleNext() {
      let button1 = document.querySelectorAll(".btn-wizard-nav-next")[0];
      button1.click();
    },
    clickNext() {
      this.goToPage(0);
      for (var i = 1; i <= 30; ++i) {
        setDelay(i);
      }

      function setDelay(i) {
        setTimeout(function() {
          let button1 = document.querySelectorAll(".btn-wizard-nav-next")[0];
          button1.click();
        }, 300);
      }
    },
    submitForm() {
      let submit = document.querySelectorAll(".btn-wizard-nav-submit")[0];
      if (submit) {
        submit.click();
      }
    },
    togglePages() {
      this.showPages = !this.showPages;
    },
    exportPDF() {
      PdfExport.export(this.currentForm, this.currentSubmission, "a4", "p"); // passing currentForm, currentSubmission, pagesize and pageOrientation
    },
    reloadPage() {
      this.$swal({
        title: "Are you sure?",
        text: "You will lost all unsaved Data",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reload it!"
      }).then(async () => {
        window.location.reload(true);
      });
    },
    nextQuestion() {
      let elements = document.getElementsByClassName("form-group");
      this.currentQuestion =
        this.currentQuestion + 1 >= elements.length
          ? elements.length
          : this.currentQuestion + 1;
      this.displayDown = !(this.currentQuestion + 1 >= elements.length);
      elements[this.currentQuestion].scrollIntoView(true);
      this.displayUp = true;
    },
    prevQuestion() {
      let elements = document.getElementsByClassName("form-group");
      this.currentQuestion =
        this.currentQuestion - 1 <= 0 ? 0 : this.currentQuestion - 1;
      elements[this.currentQuestion].scrollIntoView(true);
      this.displayUp = !(this.currentQuestion <= 0);
      this.displayDown = true;
    },
    openRightDrawer() {
      this.$eventHub.$emit("openRightDrawer");
    },
    draftStatusChanged(e) {
      if (e.detail.data.isSubmit) {
        this.$swal(
          this.$t("Sent!"),
          this.$t("Your submission has been sent!"),
          "success"
        );
      }
      if (e.detail.data === false) {
        this.saved = false;
      } else {
        this.saved = true;
      }
    },
    addSurvey() {
      let groupId = _get(
        Submission.local().getParallelSurvey(this.currentSubmission),
        "groupId",
        undefined
      );

      let steps = [];
      let progressSteps = [];
      if (groupId) {
        progressSteps = ["1"];
        steps = [
          {
            title: this.$t("Participant Name"),
            text: this.$t("Give the next participant a name")
          }
        ];
      } else {
        progressSteps = ["1", "2", "3"];
        steps = [
          {
            title: this.$t("Group Name"),
            text: this.$t("Give the group a name"),
            inputValidator: value => {
              return new Promise((resolve, reject) => {
                if (value !== "") {
                  resolve();
                } else {
                  let error = new Error(
                    this.$t("The group name is already taken")
                  );
                  reject(error);
                }
              });
            }
          },
          {
            title: this.$t("Participant Name"),
            text: this.$t("Give the current participant a name")
          },
          {
            title: this.$t("Participant Name"),
            text: this.$t("Give the next participant a name")
          }
        ];
      }

      this.$swal.setDefaults({
        input: "text",
        confirmButtonText: "Next &rarr;",
        showCancelButton: true,
        progressSteps: progressSteps
      });

      this.$swal.queue(steps).then(result => {
        let surveyData;
        this.$swal.resetDefaults();
        if (!groupId) {
          let groupId = uuidv4();
          let parallelSurvey = {
            groupId: groupId,
            groupName: result[0],
            participantName: result[1],
            submissionId: this.currentSubmission._id
          };
          this.currentSubmission.data.parallelSurvey = Submission.local().setParallelSurvey(
            parallelSurvey
          );
          surveyData = {
            parallelSurvey: Submission.local().setParallelSurvey({
              ...parallelSurvey,
              participantName: result[2]
            })
          };
        } else {
          let parallelsurveyInfo = Submission.local().getParallelSurvey(
            this.currentSubmission
          );
          parallelsurveyInfo.participantName = result[0];
          surveyData = {
            parallelSurvey: Submission.local().setParallelSurvey(
              parallelsurveyInfo
            )
          };
        }
        this.createNewSurvey(surveyData);
      });
    },
    async groupConfig() {
      let groupId = _get(
        Submission.local().getParallelSurvey(this.currentSubmission),
        "groupId",
        undefined
      );
      let options = await Submission.local().getGroups(
        this.$route.params.idForm
      );
      let customOptions = {};
      options.forEach(option => {
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
        progressSteps = ["1"];
        steps = [
          {
            title: this.$t("Change Group"),
            input: "select",
            inputOptions: customOptions,
            inputPlaceholder: this.$t("Select the destination group"),
            inputValidator: value => {
              return new Promise((resolve, reject) => {
                if (value !== "") {
                  resolve();
                } else {
                  let error = new Error(
                    this.$t("You must select a destination group")
                  );
                  reject(error);
                }
              });
            }
          }
        ];
      } else {
        progressSteps = ["1", "2"];
        steps = [
          {
            title: this.$t("Participant Name"),
            text: this.$t("Give the current participant a name"),
            inputValidator: value => {
              return new Promise((resolve, reject) => {
                if (value !== "") {
                  resolve();
                } else {
                  let error = new Error(
                    this.$t("The participant name can´t be empty")
                  );
                  reject(error);
                }
              });
            }
          },
          {
            title: "Select Group",
            input: "select",
            inputOptions: customOptions,
            inputPlaceholder: this.$t("Select a group to assign"),
            inputValidator: value => {
              return new Promise((resolve, reject) => {
                if (value !== "") {
                  resolve();
                } else {
                  let error = new Error(this.$t("You must select a group"));
                  reject(error);
                }
              });
            }
          }
        ];
      }

      this.$swal.setDefaults({
        input: "text",
        confirmButtonText: "Next &rarr;",
        showCancelButton: true,
        progressSteps: progressSteps
      });

      this.$swal.queue(steps).then(async result => {
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
    createNewSurvey(surveyData) {
      // De register if there was a previous registration
      Formio.deregisterPlugin("offline");
      // Register the plugin for offline mode
      Formio.registerPlugin(
        OFFLINE_PLUGIN.getPlugin(
          this.$FAST_CONFIG.APP_URL + "/" + this.$route.params.idForm,
          this.hashField,
          false,
          this.$eventHub
        ),
        "offline"
      );

      let formSubmission = {
        data: surveyData,
        redirect: "Update",
        draft: true,
        trigger: "createParalelSurvey"
      };
      let formio = new Formio(
        this.$FAST_CONFIG.APP_URL + "/" + this.$route.params.idForm
      );
      formio.saveSubmission(formSubmission);
    },
    getForms() {
      this.getResources({
        appName: this.$store.state.authStore.appName
      });
    },
    getLabelForPage(page) {
      // let key = page.key
      // let errorCount = this.errors.errorsByPage && this.errors.errorsByPage[key] ? this.errors.errorsByPage[key].length : ''
      // let label = errorCount !== '' ? page.title + '<span style="color: red;     font-weight: 500; font-size: larger; font-family: monospace;"> (' + errorCount + ')</span>' : page.title
      let label = page.title;
      return label;
    },
    goToSurvey(id) {
      this.$router.push({
        name: "formio_submission_update",
        params: {
          idForm: this.$route.params.idForm,
          idSubmission: id
        }
      });
    },
    validateRequired(pages, data) {
      let errorCount = 0;
      let errors = [];
      let errorsByPage = [];
      _forEach(pages, page => {
        FormioUtils.eachComponent(page.components, component => {
          if (
            component.input === true &&
            component.validate &&
            component.validate.required &&
            !component.hidden
          ) {
            // console.log("component", component);
            if (component.key === "AG-hh-nHhCultivationGirls015") {
              // console.log("component", component);
            }
            let value = data.formio.data[component.key];
            if (
              typeof value === "undefined" ||
              value === null ||
              value === ""
            ) {
              errorCount = errorCount + 1;
              errors.push(component);
              errorsByPage.push({
                page: page,
                component: component,
                pageKey: page.key
              });
              // console.log("errorCount", errorCount);
            }
          }
        });
      });
      let groupedErrors = _groupBy(errorsByPage, function(b) {
        return b.pageKey;
      });
      this.$eventHub.emit("VALIDATION_ERRORS", {
        count: errorCount,
        components: errors,
        errorsByPage: groupedErrors
      });
    }
  }
};
</script>

