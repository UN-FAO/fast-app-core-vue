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
            {{currentForm && currentForm.data && currentForm.data.title ? $t(currentForm.data.title) : ''}}
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

                <div v-if="customRenderType === 'script'" style='font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace !important;'>
                  Write your custom R script
                  <editor v-model="content" @init="editorInit" lang="r" theme="chrome" width="100%" height="50vh"></editor>

                  <q-btn loader @click="executeScript">
                    Execute script
                    <!--
                      Notice slot="loading". This is optional.
                      If missing, the default theme spinner will be used.
                    -->
                    <span slot="loading">Loading...</span>
                  </q-btn>
                  <q-btn @click="stdout = ''; valout=''; consoleout=''">
                    Clear output
                  </q-btn>
                  <q-input :min-rows="5" v-model="stdout" disable type="textarea" float-label="Std Output" />
                  <q-input :min-rows="5" v-model="valout" disable type="textarea" float-label="Value Output" />
                  <q-input :min-rows="5" v-model="consoleout" disable type="textarea" float-label="Console Output" />
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
import axios from 'axios';
import _get from 'lodash/get';
import FormioUtils from 'formiojs/utils';
import { Form, Auth, Submission, Event, ParallelSurvey } from 'fast-fastjs';
import formio from 'modules/Formio/components/formio/formio';
import datatable from 'components/dataTable/dataTable';
import { Promise } from 'bluebird';
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
    QSpinnerAudio,
    QPopover,
    QItemSide,
    QInput,
    editor: require('vue2-ace-editor')
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
    Event.remove({
      name: 'FAST:SUBMISSION:CANCEL',
      callback: this.cancel
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
      content: '',
      response: null,
      stdout: null,
      valout: null,
      consoleout: null,
      variables: null
    };
  },
  methods: {
    onSubmissionChange(event) {
      let data = event.detail.data;
      this.pages = data.formio.pages ? data.formio.pages : [];
      if (data.formio.data && data.formio.data.variables) {
        let variables = data.formio.data.variables;
        this.variables = data.formio.data.variables;
        let rScript =
          '################################################################# \n';
        rScript = rScript + '# \n';
        rScript =
          rScript +
          '# The "token" variable will contain your Formio x-token \n';
        rScript = rScript + '# \n';
        rScript =
          rScript + '# You can use these URLs to request data from the DB \n';
        rScript = rScript + '# \n';
        variables.forEach((variable) => {
          if (variable.name && variable.path && variable.name !== '') {
            let fullUrl =
              "'" +
              this.$FAST_CONFIG.APP_URL +
              '/' +
              variable.path +
              "/submission'";
            rScript = rScript + variable.name + '_url <- ' + fullUrl + ' ; \n';
          }
        });
        rScript =
          rScript +
          '# Direct call Example: Replace <myVariable> with your variable Name \n';
        rScript = rScript + '# \n';
        rScript =
          rScript +
          "# httpCall <- httr::GET(<myVariable>_url, httr::add_headers('x-jwt-token' = token), httr::accept_json()) \n";
        rScript =
          rScript +
          '# text_result <- httr::content(httpCall, as = "text", encoding = "UTF-8") \n';
        rScript =
          rScript +
          '# json_result <- jsonlite::fromJSON(text_result, flatten = TRUE) \n';
        rScript = rScript + '# \n';
        rScript =
          rScript +
          '# Fast Library Example: Replace <myVariable> with your variable Name \n';
        rScript = rScript + '# \n';
        rScript =
          rScript +
          "# filter <- list(list('_id','!=','5a65acec16987c0001f3d246'), list('owner','!=','2342342344')) \n";
        rScript = rScript + "# select <- list('data.a', 'owner', '_id') \n";
        rScript = rScript + '# limit <- 150 \n';
        rScript = rScript + '# chunk_size <- 15 \n';
        rScript = rScript + "# populate <- list('owner') \n";
        rScript =
          rScript +
          '# <myVariable>$select(select)$filter(filter)$limit(limit)$populate(populate)$chunks(chunk_size) \n';
        rScript = rScript + '# data <- <myVariable>$get() \n';
        rScript =
          rScript +
          '################################################################!!#\n';
        this.content =
          rScript +
          this.content.substring(
            this.content.indexOf('!!#') + 4,
            this.content.length
          );
      }
    },
    cancel() {
      window.history.back();
    },
    async softDelete() {
      await Submission.remote().softDelete({
        id: this.$route.params.idSubmission,
        formPath: this.$route.params.idForm
      });
      this.cancel();
    },
    // notice parameter "done" (Function)
    executeScript(event, done) {
      var bodyFormData = new FormData();
      let fullScript = "token <- '" + Auth.user().x_jwt_token + "' ; \n";
      fullScript =
        fullScript +
        `#' Extract all results of a given resource or form
#'
#' This function allows you to express your love of cats.
#' @param base_url Base formio URL
#' @param resource_path Name of the path of the form ie: 'user'.
#' @param token The formio token to allow access
#' @export
#' @examples
#' Formior()
Formior <-  R6::R6Class("Formior",
    public = list(
    # Class properties
    base_url = NULL,
    resource_path = NULL,
    token = NULL,
    filter_string = NULL,
    select_string = NULL,
    limit_string = NULL,
    populate_string = NULL,
    chunk_size_string = NULL,
    first_chunk = NULL,

    # Class constructor
    initialize = function(base_url = NA, resource_path = NA, token = NA) {
      self$base_url <- base_url
      self$resource_path <- resource_path
      self$token <- token
    },

    #Methods

    #' Sets the proper Filter URL for the GET CALL
    #'
    #' Parses the list of filters to a single string
    #' @param filter The list of filters
    #' @keywords filter
    #' @examples
    #' filterToString()
    filterToString = function(filters) {
      filterString <- ''
      for(filter in filters){
        element <- filter[[1]]
        query <- filter[[2]]
        value <- filter[[3]]

        if(query == "="){
          filterString <- paste(filterString, element, '=', value, '&', sep ='')
        }
        else if(query == "!="){
          filterString <- paste(filterString, element, '__ne=', value, '&', sep ='')
        }
        else if(query == ">"){
          filterString <- paste(filterString, element, '__gt=', value, '&', sep ='')
        }
        else if(query == ">="){
          filterString <- paste(filterString, element, '__gte=', value, '&', sep ='')
        }
        else if(query == "<"){
          filterString <- paste(filterString, element, '__lt=', value, '&', sep ='')
        }
        else if(query == "<="){
          filterString <- paste(filterString, element, '__lte=', value, '&', sep ='')
        }
        else if(query == "in"){
          filterString <- paste(filterString, element, '__in=', value, '&', sep ='')
        }
        else if(query == "nin"){
          filterString <- paste(filterString, element, '__nin=', value, '&', sep ='')
        }
        else if(query == "exists"){
          filterString <- paste(filterString, element, '__exists=', TRUE, '&', sep ='')
        }
        else if(query == "!exists"){
          filterString <- paste(filterString, element, '__exists=', FALSE, '&', sep ='')
        }
        else if(query == "regex"){
          filterString <- paste(filterString, element, '__regex=', value, '&', sep ='')
        }
      }
      filterString <- substr(filterString, 1, nchar(filterString)-1)
      return(filterString)
    },

    #' Sets the proper Select URL for the GET CALL
    #'
    #' Parses the list of select elements to a single string
    #' @param filter The list of items to include in the select
    #' @keywords filter
    #' @examples
    #' selectToString()
    selectToString = function(select){
      selectString <- '_id'
      for(attribute in select){
        selectString = paste(selectString,attribute,',',sep='')
      }
      selectString <- substr(selectString, 1, nchar(selectString)-1)
      return(selectString)
    },
    #' Sets the proper Populate URL for the GET CALL
    #'
    #' Parses the list of select elements to a single string
    #' @param filter The list of items to include in the select
    #' @keywords filter
    #' @examples
    #' selectToString()
    populateToString = function(resources){
      populateString <- ''
      for(resource in resources){
        populateString = paste(populateString,resource,',',sep='')
      }
      populateString <- substr(populateString, 1, nchar(populateString)-1)
      return(populateString)
    },

    #' Gets the first Query String
    #'
    #' Returns the first query string given all the filters, select and limit
    #' @examples
    #' getChunkSize()
    getQueryString = function(){

      url <- paste(self$base_url, self$resource_path, "/submission?", sep='')
      first_chunk <- NULL

      # Sets the final queryString
      # Adds the filterString
      if(is.character(self$filter_string)) {
        url <- paste(url, self$filter_string, '&', sep="")
      }
      # Adds the selectString
      if(is.character(self$select_string)) {
        url <- paste(url,'select=', self$select_string, '&', sep="")
      }
      # Adds the populateString
      if(is.character(self$populate_string)) {
        url <- paste(url,'populate=', self$populate_string, '&', sep="")
      }
      return(url)

    },

    #' Gets the first chunk size
    #'
    #' Returns the first chunk size depending on the limit and chunks defined
    #' @examples
    #' getChunkSize()
    getChunkSize = function(){
      first_chunk <- NULL
      url <- ''
      if(is.character(self$limit_string) && is.character(self$chunk_size_string))
      {
        if(as.numeric(self$chunk_size_string) >= as.numeric(self$limit_string)) {
          first_chunk <- self$limit_string
        } else {
          first_chunk <- self$chunk_size_string
        }
      }
      if(is.character(self$limit_string) && !is.character(self$chunk_size_string)) {
        first_chunk <- self$limit_string
      }
      if(!is.character(self$limit_string) && is.character(self$chunk_size_string)) {
        first_chunk <- self$chunk_size_string
      }
      if(is.character(first_chunk)) {
        url <- paste(url,'limit=', first_chunk, '&', sep="")
      }
      self$first_chunk <- first_chunk
      return(url)
    },
    getTokenType = function(){
      if(nchar(self$token) > 32) {
        return('x-jwt-token')
      }
      return('x-token')
    },

    #' Extract all results of a given resource or form
    #'
    #' This function pulls the records
    #' @keywords formio
    #' @export
    #' @examples
    #' get()
    get = function() {
      url <- paste(self$getQueryString(), self$getChunkSize(), sep="")
      url <- substr(url, 1, nchar(url)-1)
      last_iteration_limit <- NULL
      tokenType = self$getTokenType()

      # GET and Parse the content
      if(tokenType == 'x-token') {
        firstResult <- httr::GET(url, httr::add_headers('x-token' = self$token), httr::accept_json())
      } else {
        firstResult <- httr::GET(url, httr::add_headers('x-jwt-token' = self$token), httr::accept_json())
      }


      error <- httr::http_error(firstResult)
      if(error){
        print('The query has an error or no results')
        el <- list()
        return(el)
      }
      text_content <- httr::content(firstResult, as = "text", encoding = "UTF-8")
      json_content <- jsonlite::fromJSON(text_content, flatten = TRUE)

      # Calculate iterations
      total <- strsplit(firstResult$headers$'content-range', "/")[[1]][[2]]
      iterations_needed <- 0
      iterations_left <- 0
      if(!is.character(self$limit_string) && is.character(self$chunk_size_string)){
        iterations_needed <- ceiling(as.numeric(total) / as.numeric(self$chunk_size_string))
        iterations_left <- as.numeric(iterations_needed) -1
      }
      # Most complicated case
      else if(is.character(self$limit_string) && is.character(self$chunk_size_string)){
        if(as.numeric(total) >= as.numeric(self$limit_string)){
          possible_results = 0
          if(as.numeric(total) >= as.numeric(self$limit_string)) {
            possible_results <- as.numeric(self$limit_string)
          } else {
            possible_results <- as.numeric(total)
          }
          if(possible_results == 0) {
            iterations_needed <- 0
            iterations_left <- 0
          }
          else{
            iterations_needed <- ceiling( possible_results / as.numeric(self$first_chunk))
            last_iteration_limit <- possible_results / as.numeric(self$first_chunk)
            last_iteration_limit <- (as.numeric(last_iteration_limit) - floor(last_iteration_limit)) * as.numeric(self$first_chunk)
            if(as.numeric(last_iteration_limit) == 0) {
              last_iteration_limit <- as.numeric(self$first_chunk)
            }
            iterations_left <- as.numeric(iterations_needed) -1
          }

        }
      }


      chunks <- list()
      chunks[[1]] = json_content
      i <- 1
      while( as.numeric(iterations_left) > 0){
        # Calculate the next URL
        skip_amount <- as.character(as.numeric(self$chunk_size_string) * (as.numeric(iterations_needed) - as.numeric(iterations_left) ))
        limit <- self$chunk_size_string
        if(as.numeric(iterations_left) == 1){
          if(is.numeric(last_iteration_limit)) {
            limit <- last_iteration_limit
          }
        }
        it_url <- paste(self$getQueryString(), "&limit=", limit, "&skip=", skip_amount, sep="");
        # GET and Parse the content
        if(tokenType == 'x-token') {
          more_result <- httr::GET(it_url, httr::add_headers("x-token" = self$token), httr::accept_json())
        } else {
          more_result <- httr::GET(it_url, httr::add_headers("x-jwt-token" = self$token), httr::accept_json())
        }

        more_content <- httr::content(more_result, as = "text", encoding = "UTF-8")
        more_json <- jsonlite::fromJSON(more_content, flatten = TRUE)

        # Merge with previous results
        #total_results = rbind_pages(total_results, more_json)
        chunks[[i+1]] <- more_json

        # Next iteration
        iterations_left <- (as.numeric(iterations_left) - 1 )
        i <- i + 1
      }

      final_result <- jsonlite::rbind_pages(chunks)
      return(final_result)
    },

    #' Applies the filters
    #'
    #' @param filters the list of filters
    #' @export
    #' @examples
    #' filter()
    filter = function(filters){
      self$filter_string = self$filterToString(filters)
      return(self)
    },

    #' Applies the select
    #'
    #' @param select the list of select
    #' @export
    #' @examples
    #' select()
    select = function(select){
      self$select_string = self$selectToString(select)
      return(self)
    },

    #' Applies the limit to the Query
    #'
    #' @param limit the limit for the query
    #' @export
    #' @examples
    #' limit()
    limit = function(limit){
      self$limit_string = as.character(limit)
      return(self)
    },

    #' Applies the populate to the Query
    #'
    #' @param resources the populate resources for the query
    #' @export
    #' @examples
    #' limit()
    populate = function(resources){
      self$populate_string = self$populateToString(resources)
      return(self)
    },

    #' Defines how many elements to call each time
    #'
    #' @param size Number of elements on each call
    #' @export
    #' @examples
    #' limit()
    chunks = function(size){
      self$chunk_size_string = as.character(size)
      return(self)
    }
   )
  )` +
        '; \n';
      let classInit = '';
      this.variables.forEach((variable) => {
        if (variable.name && variable.path && variable.name !== '') {
          classInit =
            classInit +
            variable.name +
            ' <- Formior$new("' +
            this.$FAST_CONFIG.APP_URL +
            '/", "' +
            variable.path +
            '", token); \n';
        }
      });

      fullScript = fullScript + classInit + this.content;
      bodyFormData.set('x', fullScript);
      let url = '';
      axios({
        method: 'post',
        url: 'https://public.opencpu.org/ocpu/library/base/R/identity',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })
        .then((response) => {
          url = response.data.split('/ocpu/').map((r) => {
            r = r.replace(/\n/g, '');
            return r;
          });
          let sdtoutUrl = url.find((o) => {
            return o.indexOf('/stdout') > -1;
          });
          let valUrl = url.find((o) => {
            return o.indexOf('/.val') > -1;
          });

          let consoleUrl = url.find((o) => {
            return o.indexOf('/.val') > -1;
          });

          if (sdtoutUrl) {
            axios
              .get('https://public.opencpu.org/ocpu/' + sdtoutUrl + '/text')
              .then((response) => {
                console.log(response);
                this.stdout = response.data;
                done();
              })
              .catch((error) => {
                this.stdout = error.response.data;
                done();
              });
          }

          if (valUrl) {
            axios
              .get('https://public.opencpu.org/ocpu/' + valUrl)
              .then((response) => {
                console.log(response);
                this.valout = response.data;
                done();
              })
              .catch((error) => {
                this.valout = error.response.data;
                done();
              });
          }

          if (consoleUrl) {
            axios
              .get('https://public.opencpu.org/ocpu/' + consoleUrl)
              .then((response) => {
                console.log(response);
                this.consoleout = response.data;
                done();
              })
              .catch((error) => {
                this.consoleout = error.response.data;
                done();
              });
          }
        })
        .catch((error) => {
          this.response = error.response.data;
          done();
        });
    },
    editorInit: function() {
      require('brace/ext/language_tools'); // language extension prerequsite...
      require('brace/mode/r');
      require('brace/snippets/r');
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
      let submission = this.$route.params.fullSubmision;

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

