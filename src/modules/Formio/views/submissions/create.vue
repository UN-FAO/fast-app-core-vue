<template>
    <q-pull-to-refresh :handler="reloadPage">
      <div class="row FormioContainer">     
  
        <q-card style="background-color: white"  class="col-lg-3  col-md-3 col-sm-3" v-if="_isWizard && showPages"> 
          <q-card-main>
              <q-list separator style="border: none !important">
      
              <q-item class="formioPagination" multiline style="text-align: left; text-transform: uppercase; min-height: 60px; border-radius: 5px;"  link  v-for="(page, index) in _pages"  :key="page.title" @click="goToPage(index)" :ref="'page-'+ index" v-bind:class="currentPage === index ? 'activePage' : ''">
              <q-item-main style=" margin-top: auto;  margin-bottom: auto;"
                :label="getLabelForPage(page)"
                label-lines="3"
              />    
            </q-item>
          </q-list>
          </q-card-main>
        </q-card> 
  
        <q-card color="white" v-bind:class="getFormClass" >
            <q-card-main>
          
              <q-btn flat @click="togglePages" icon="menu" style="color:black;" v-if="_isWizard"></q-btn>
                <q-tabs inverted id="contentForm">
                    <!-- Tabs - notice slot="title" -->
                    <q-tab default slot="title" name="tab-1" icon="person" label="P1"
                     :color="saved ? 'primary' : 'red'" />
                    <!-- Targets -->

                    <q-tab-pane name="tab-1" ref="tab1">
                      
                        <formio
                          :formioURL="formioURL" 
                          :submission="submission"
                          :formioToken="formioToken"
                          :localDraft="LOCAL_DRAFT_ENABLED"
                          :readOnly="false"
                        />
                    </q-tab-pane>

                </q-tabs>

            </q-card-main>
            <!--
            <q-inner-loading :visible="typeof submission === 'undefined'">
              <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
            </q-inner-loading>
          -->
        </q-card>

         <q-fixed-position corner="top-right" :offset="[18, 18]">
                    <q-fab color="red" icon="add" direction="left">
                        <q-fab-action color="secondary" @click="exportPDF" icon="print"></q-fab-action>

                        <q-fab-action color="primary" @click="getForms()" icon="cloud_download"></q-fab-action>

                        <q-fab-action color="amber" @click="addSurvey()" icon="person_add"></q-fab-action>

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
    </q-pull-to-refresh>
</template>
<script>
import _ from 'lodash'
import FormioUtils from 'formiojs/utils'
import {mapActions} from 'vuex'
import Auth from 'modules/Auth/api/Auth'
import formio from 'modules/Formio/components/formio/formio'
import LocalSubmission from 'database/collections/scopes/LocalSubmission'
import {APP_URL, LOCAL_DRAFT_ENABLED} from 'config/env'
import {QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator, Loading, QItemMain, QTransition,
  QInnerLoading, QSpinnerAudio} from 'quasar'
export default {
  components: {
    formio, QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator, Loading, QItemMain, QTransition, QInnerLoading, QSpinnerAudio
  },
  async mounted () {
    this.$eventHub.on('formio.mounted', (formio) => {
      this.pages = formio.pages ? formio.pages : []
    })
    this.$eventHub.on('formio.nextPage', (data) => {
      this.currentPage = data.nextPage.page
      this.currentQuestion = -1
      window.scrollTo(0, 0)
    })
    this.$eventHub.on('formio.prevPage', (data) => {
      this.currentPage = data.prevPage.page
      this.currentQuestion = -1
      window.scrollTo(0, 0)
    })
    
    this.$eventHub.on('formio.render', (data) => {
      this.isWizard = !!(data.formio.wizard)
    })
    this.validateRequired = _.debounce(this.validateRequired, 400)
    this.createScorePanels = _.debounce(this.createScorePanels, 400)
    this.$eventHub.on('formio.change', (data) => {
      this.pages = data.formio.pages ? data.formio.pages : []
      this.validateRequired(this.pages, data)
      this.createScorePanels(this.pages, data)
    })
    document.addEventListener('draftStatus', this.draftStatusChanged)
    this.$eventHub.$on('formio.error', (error) => {
      console.log(error)
      if (error.error.message === "Cannot read property 'notice' of null") {
      } else {
        this.$swal({
          type: 'error',
          title: 'Error',
          html: 'You have errors in the submission'
        }).then(() => {
          window.scrollTo(0, 0)
        })
      }
    })
    this.$eventHub.on('VALIDATION_ERRORS', (data) => {
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
    })
  },
  beforeDestroy() {
    document.removeEventListener('draftStatus', this.draftStatusChanged)
    this.$eventHub.$off('formio.error')
    this.$eventHub.$off('VALIDATION_ERRORS')
  },
  asyncData: {
    submission: {
      get() {
          if (this.$route.params.idSubmission) {
         return LocalSubmission.get(this.$route.params.idSubmission)
          } else {
            return LocalSubmission.get('ABCD')
          }
      },
      transform(result) {
         return result
      }
    }
  },
  computed: {
    _pages () {
      return this.pages
    },
    _isWizard () {
      return this.isWizard
    },
    getFormClass () {
      let className = ''
      if (this.showPages && this._isWizard) {
        className = 'col-lg-8  col-md-8 col-sm-8'
      } else {
        className = 'col-xl-10 col-lg-10  col-md-12 col-sm-12 col-lg-offset-1 col-md-offset-1 col-xl-offset-1'
      }
      if (!this.saved) {
        className = className + ' saving'
      }
      return className
    }
  },
  data: function () {
    return {
      form: null,
      formioURL: APP_URL + '/' + this.$route.params.idForm,
      people: [{name: 'P1'}],
      formioToken: Auth.user().x_jwt_token,
      LOCAL_DRAFT_ENABLED: LOCAL_DRAFT_ENABLED,
      saved: false,
      errors: {},
      isWizard: false,
      pages: [],
      currentPage: 0,
      showPages: false,
      currentQuestion: -1,
      displayUp: false,
      displayDown: true
    }
  },
  methods: {
    ...mapActions(['getResources']),
    createScorePanels(pages, data) {
       // Search all of the Score components in different pages
      let scorePanels = []
      _.forEach(pages, (page) => {
          let panels = FormioUtils.findComponents(page.components, {
          'type': 'panel'
        })
          if (panels.length > 0) {
            _.forEach(panels, (panel, index) => {
              // Make sure that the panel contains Score
              if (panel.key.indexOf('score') !== -1) {
                _.forEach(panel.components, (component, cindex) => {
                  // Search the current value of the Score and add it
                  component.value = data.formio.data[component.key]
                })
                scorePanels.push(panel)
              }
            })
          }
      })
      this.scorePanels = scorePanels
    },
    goToPage (index) {
      let pageNumber = index + 1
      let page = document.querySelectorAll('ul li:nth-of-type(' + pageNumber + ')')[0]
      page.click()
      this.currentPage = index
      this.currentQuestion = -1
      window.scrollTo(0, 0)
      this.togglePages()
    },
    togglePages () {
      this.showPages = !this.showPages
    },
    exportPDF () {
      let element = document.querySelector('#contentForm')
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
        filename: 'export.pdf',
        // pdfCallback: myCallback,
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: {
            orientation: 'portrait',
            unit: 'cm',
            format: 'letter'
          }
      })
    },
    reloadPage () {
      this.$swal({
                title: 'Are you sure?',
                text: 'You will lost all unsaved Data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, reaload it!'
              }).then(async () => {
                  window.location.reload(true)
              })
    },
    nextQuestion () {
      let elements = document.getElementsByClassName('form-group')
      this.currentQuestion = this.currentQuestion + 1 >= elements.length ? elements.length : this.currentQuestion + 1
      this.displayDown = !(this.currentQuestion + 1 >= elements.length)
      elements[this.currentQuestion].scrollIntoView(true)
      this.displayUp = true
    },
    prevQuestion () {
      let elements = document.getElementsByClassName('form-group')
      this.currentQuestion = this.currentQuestion - 1 <= 0 ? 0 : this.currentQuestion - 1
      elements[this.currentQuestion].scrollIntoView(true)
      this.displayUp = !(this.currentQuestion <= 0)
      this.displayDown = true
    },
    draftStatusChanged (e) {
      if (e.detail.data === false) {
        this.saved = false
      } else {
        this.saved = true
      }
    },
    addSurvey () {
      let self = this
      this.$swal({
        title: 'Give her a name',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Add',
        showLoaderOnConfirm: true,
        allowOutsideClick: false
      }).then(function (name) {
        self.$swal({
          type: 'success',
          title: 'Added to Survey!',
          html: name + ' has been added'
        })
      })
    },
    getForms () {
      this.getResources({
        appName: this.$store.state.authStore.appName
      })
    },
    getLabelForPage (page) {
      // let key = page.key
      // let errorCount = this.errors.errorsByPage && this.errors.errorsByPage[key] ? this.errors.errorsByPage[key].length : ''
      // let label = errorCount !== '' ? page.title + '<span style="color: red;     font-weight: 500; font-size: larger; font-family: monospace;"> (' + errorCount + ')</span>' : page.title
      let label = page.title
      return label
    },
    validateRequired (pages, data) {
      let errorCount = 0
      let errors = []
      let errorsByPage = []
      _.forEach(pages, (page) => {
        FormioUtils.eachComponent(page.components, (component) => {
        if (component.input === true && component.validate && component.validate.required && !component.hidden) {
          let value = data.formio.data[component.key]
          if (typeof value === 'undefined' || value === null || value === '') {
             errorCount = errorCount + 1
             errors.push(component)
             errorsByPage.push({page: page, component: component, pageKey: page.key})
            }
          }
        })
      })
      let groupedErrors = _.groupBy(errorsByPage, function(b) { return b.pageKey })
      this.$eventHub.emit('VALIDATION_ERRORS', {count: errorCount, components: errors, errorsByPage: groupedErrors})
    }
  }
}
</script>
