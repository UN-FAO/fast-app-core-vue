<template>
<div class="container-fluid">
  <div class="row FormioContainer">

    <q-card style="background-color: white; max-height: fit-content;" class="col-lg-3  col-md-3 col-sm-3" v-if="_isWizard && showPages">
      <q-card-main>
        <q-list separator style="border: none !important">

          <q-item class="formioPagination" multiline style="text-align: left; text-transform: uppercase; min-height: 60px; border-radius: 5px;" link v-for="(page, index) in _pages" :key="page.title" @click="goToPage(index)" :ref="'page-'+ index" v-bind:class="currentPage === index ? 'activePage' : ''">
            <q-item-main style=" margin-top: auto;  margin-bottom: auto;" :label="$t(getLabelForPage(page))" label-lines="3" />
          </q-item>
        </q-list>
      </q-card-main>
    </q-card>

    <q-card color="white" v-bind:class="getFormClass" style="position:inherit !important;">
      <q-card-main>

        <q-btn flat @click="togglePages" icon="menu" style="color:black;" v-if="_isWizard"></q-btn>
        <!--<q-icon name="thumb_up" />-->
        <q-tabs inverted id="contentForm">
          <!-- Tabs - notice slot="title" -->

          <q-tab v-bind:class="!PARRALEL_SURVEYS ? 'hidden' : ''" default slot="title" name="tab-1" icon="person" :label="participantName" :color="saved ? 'primary' : 'red'" />
          <!-- Targets -->
          <q-tab slot="title" v-if="participant.submissionId !== $route.params.idSubmission" v-for="participant in participants" :key="participant.submissionId" icon="person" :label="participant.participantName" :color="saved ? 'primary' : 'red'" @click="goToSurvey(participant.submissionId)"
          />

          <q-tab-pane name="tab-1" ref="tab1">

            <formio :formURL="formURL" :submission="submission" :formioToken="formioToken" :localDraft="LOCAL_DRAFT_ENABLED" :readOnly="readOnly" :autoCreate="autoCreate" />
          </q-tab-pane>

        </q-tabs>

      </q-card-main>
    </q-card>

    <q-fixed-position corner="top-right" :offset="[18, 18]">
      <q-fab color="red" icon="add" direction="left">
        <q-fab-action color="secondary" @click="exportPDF" icon="print"></q-fab-action>

        <q-fab-action v-bind:class="!PARRALEL_SURVEYS ? 'hidden' : ''" color="purple-6" @click="groupConfig()" icon="fa-users"></q-fab-action>
        <q-fab-action v-bind:class="!PARRALEL_SURVEYS ? 'hidden' : ''" color="amber" @click="addSurvey()" icon="person_add"></q-fab-action>

        <q-fab-action color="primary" @click="saveAsDraft()" icon="fa-floppy-o"></q-fab-action>

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
</template>

<script>
import {
  APP_URL,
  LOCAL_DRAFT_ENABLED,
  PARALLEL_SURVEYS,
  NAVIGATION_OPENED,
  NAVIGATION_AUTOCLOSE_ON_SELECTION
} from "config/env";
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
import uuidv4 from "uuid/v4";
import _get from "lodash/get";
import Formio from "formiojs";
import _forEach from "lodash/forEach";
import _groupBy from "lodash/groupBy";
import _debounce from "lodash/debounce";
import FormioUtils from "formiojs/utils";
import Auth from "modules/Auth/api/Auth";
import formio from "modules/Formio/components/formio/formio";
import Submission from "database/models/Submission";
import OFFLINE_PLUGIN from "modules/Formio/components/formio/src/offlinePlugin";
export default {
  components: {
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
      this.currentQuestion = -1;
      window.scrollTo(0, 0);
    });

    this.$eventHub.on("formio.prevPage", data => {
      this.currentPage = data.prevPage.page;
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
      if (error.error.message === "Cannot read property 'notice' of null") {
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
      if (this.showPages && this._isWizard) {
        className = "col-lg-8  col-md-8 col-sm-8";
      } else {
        className =
          "col-xl-10 col-lg-10  col-md-12 col-sm-12 col-lg-offset-1 col-md-offset-1 col-xl-offset-1";
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
      formURL: APP_URL + "/" + this.$route.params.idForm,
      people: [
        {
          name: "P1"
        }
      ],
      formioToken: Auth.user().x_jwt_token,
      LOCAL_DRAFT_ENABLED: LOCAL_DRAFT_ENABLED,
      saved: true,
      errors: {},
      isWizard: false,
      pages: [],
      currentPage: 0,
      showPages: NAVIGATION_OPENED,
      currentQuestion: -1,
      displayUp: false,
      displayDown: true,
      PARRALEL_SURVEYS: PARALLEL_SURVEYS,
      parallelSub: [],
      autoCreate: !this.$route.params.idSubmission,
      readOnly: false
    };
  },
  methods: {
    ...mapActions(["getResources"]),
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
      try {
        let pageNumber = index + 1;
        let page = document.querySelectorAll(
          "ul.pagination li:nth-of-type(" + pageNumber + ")"
        )[0];
        page.click();
        this.currentPage = index;
        this.currentQuestion = -1;
        window.scrollTo(0, 0);
        if (NAVIGATION_AUTOCLOSE_ON_SELECTION) {
          this.togglePages();
        }
      } catch (e) {
        this.$swal("Complete the required fields");
      }
    },
    togglePages() {
      this.showPages = !this.showPages;
    },
    exportPDF() {
      let element = document.querySelector("#contentForm");
      /*
            let body = document.body
            let html = document.documentElement
            let height = Math.max(body.scrollHeight, body.offsetHeight,
                             html.clientHeight, html.scrollHeight, html.offsetHeight)

            let heightCM = height / 35.35

            function myCallback(pdf) {
              console.log('The pdf was generated!!', pdf)
            }
            */
      html2pdf(element, {
        margin: 1,
        filename: "export.pdf",
        // pdfCallback: myCallback,
        html2canvas: {
          dpi: 192,
          letterRendering: true
        },
        jsPDF: {
          orientation: "portrait",
          unit: "cm",
          format: "letter"
        }
      });
    },
    reloadPage() {
      this.$swal({
        title: "Are you sure?",
        text: "You will lost all unsaved Data",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reaload it!"
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
    draftStatusChanged(e) {
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
            title: "Participant Name",
            text: "Give the next participant a name"
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
          this.formURL,
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
      let formio = new Formio(this.formURL);
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
    },
    customSubmission() {
      let submission = require("./sub.json");
      let customSubmission = this.submission;

      customSubmission.data.data = submission[0];
      console.log(customSubmission, "customSubmission");
      return customSubmission;
    }
  }
};
</script>
<style SCOPED>
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (orientation:portrait) {
  .formio-component-datagrid {
    overflow-x: unset;
    margin-left: -56px;
    width: 80vw !important;
  }
  .formio-component-datagrid div.row {
    display: block;
  }

  div.formio-component-datagrid {
    overflow-x: unset;
  }

  .formio-component-datagrid fieldset div.row {
    display: block;
    margin-left: 0px;
  }
  .formio-component-datagrid fieldset {
    margin-left: 0px;
  }

  legend,
  .card-header.panel-heading {
    margin-left: 15px;
  }

  .table-responsive {
    overflow-x: unset;
    margin-left: -90px;
    width: 100vw !important;
    transform: scale(0.92);
  }
  .table-responsive .choices__item.choices__item--selectable {
    display: table;
    font-size: x-small;
    margin-left:-12px;
  }

  .table-responsive
    .choices__list.choices__list--dropdown.is-active
    .choices__item.choices__item--selectable {
    display: table;
    font-size: large;
    margin-left:0px;
  }

  .table-responsive input.form-control {
    min-width: 16vw !important;
    max-width: 16vw !important;
    font-size: smaller;
  }
  .table-responsive p {
    font-size: 9px;
  }

  .table-responsive td,
  th {
    width: 16vw !important;
  }

  .table-responsive .input-group {
    min-width: 16vw !important;
    max-width: 16vw !important;
    font-size: smaller;
  }

  .table-responsive label.control-label {
    font-size: smaller !important;
  }

  .table-responsive .form-control {
    min-width: 16vw !important;
    max-width: 16vw !important;
    font-size: smaller;
  }

  .table-responsive .input-group-addon {
    padding: 0px;
    font-size: 9px;
  }

  .formio-component-fieldset{
    margin-top: 0px
  }

  fieldset div.row {
    display: block;
    margin-left: -60px;
  }
  fieldset {
    margin-left: -50px;
  }

}
</style>
