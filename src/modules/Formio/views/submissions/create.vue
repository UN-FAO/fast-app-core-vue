<template>
    <q-pull-to-refresh :handler="refreshSubmissions">
      <div class="row">     

        <q-card  flat color="transparent"  class="col-lg-3  col-md-3 col-sm-3" v-if="_isWizard && showPages"> 
          <q-card-main>
              <q-list separator style="border: none !important">
            <!-- collapsible to hide sub-level menu entries -->    
              <q-item multiline style="text-align: left; text-transform: uppercase; min-height: 60px; border-radius: 5px;"  link  v-for="(page, index) in pages" :label="page.title" :key="page.title" @click="goToPage(index)" :ref="'page-'+ index">
              <q-item-main style=" margin-top: auto;  margin-bottom: auto;"
                :label="page.title"
                label-lines="3"
              />      
            </q-item>
          </q-list>
          </q-card-main>
        </q-card> 

        <q-card color="white" v-bind:class="getFormClass" >
            <q-card-main>
              <q-btn flat @click="togglePages" icon="menu" style="color:black;"></q-btn>
                <q-tabs inverted id="contentForm">
                    <!-- Tabs - notice slot="title" -->
                    <q-tab default slot="title" name="tab-1" icon="person" label="P1"
                     :color="saved ? 'primary' : 'red'" />
                    <!-- Targets -->

                    <q-tab-pane name="tab-1" ref="tab1">
                      <q-list v-if="errors.count > 0">
                        <q-collapsible icon="fa-exclamation-circle" :label="'Peding Fields ( ' + errors.count + ' )'">
                          <div>
                            Validation
                          </div>
                        </q-collapsible>
                      </q-list>

                        <!-- Tabs -->
                        <formio
                          :formioURL="formioURL" 
                          :submission="submission"
                          :formioToken="formioToken"
                          :localDraft="LOCAL_DRAFT_ENABLED"
                          :readOnly="false"
                        />

                    </q-tab-pane>

                </q-tabs>

                <q-fixed-position corner="top-right" :offset="[18, 18]">
                    <q-fab color="red" icon="add" direction="left" push>
                        <q-fab-action color="secondary" @click="exportPDF" icon="print"></q-fab-action>

                        <q-fab-action color="primary" @click="getForms()" icon="cloud_download"></q-fab-action>

                        <q-fab-action color="amber" @click="addSurvey()" icon="person_add"></q-fab-action>

                    </q-fab>
                </q-fixed-position>

            </q-card-main>
        </q-card>
      </div>
    </q-pull-to-refresh>
</template>
<style>
.q-item-label {
    color: black;
    font-weight: 300;
}

.saving {
  box-shadow: 1px 1px 1px 1px rgba(222, 15, 15, 0.88) !important;
}

.q-collapsible.q-item-division.relative-position {
    color: black;
}

.form-control {
    min-height: 45px !important;
    height: auto;
    font-size: 20px !important;
}

label.control-label {
    color: #666;
    font-size: medium !important;
}

input[type=radio] {
    display:none; 
    margin:10px;
}

input[type=radio] + span, input[type=checkbox] + span {
    margin: -2px;
    padding: 4px 12px;
    background-color: rgba(231, 231, 231, 0.38);
    border-radius: 5px;
    min-width: 250px;
    min-height: 50px;
    text-align: center;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    margin-bottom: 10px;
    margin-top: 10px;
}

input[type=radio]:checked + span, input[type=checkbox]:checked + span { 
   background-image: none;
    background-color: #0e6da5;
    color: white;
    cursor: pointer;
    padding: 2px 12px 3px 12px;
    text-decoration: none;
    display: inline-block;
    border-radius: 5px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    margin-bottom: 10px;
    margin-top: 10px;
}

</style>

<script>
import _ from 'lodash'
import FormioUtils from 'formiojs/utils'
import {mapActions} from 'vuex'
import Auth from 'modules/Auth/api/Auth'
import formio from 'modules/Formio/components/formio/formio'
import LocalForm from 'database/collections/scopes/LocalForm'
import LocalSubmission from 'database/collections/scopes/LocalSubmission'
import {APP_URL, LOCAL_DRAFT_ENABLED} from 'config/env'
import {QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator, Loading, QItemMain} from 'quasar'

export default {
  components: {
    formio, QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator, Loading, QItemMain
  },
  async beforeRouteEnter (to, from, next) {
    // Load the form and submission before entering the route
    let form = await LocalForm.get(to.params.idForm)
    if (to.params.idSubmission) {
      var submission = to.params.idSubmission ? await LocalSubmission.get(to.params.idSubmission) : undefined
    }
    next(vm => {
      // Load the form and submission before entering the route
      vm.form = form
      if (to.params.idSubmission) {
        vm.submission = (!_.isEmpty(submission)) ? submission : undefined
      }
    })
  },
  async beforeRouteUpdate (to, from, next) {
    let form = await LocalForm.get(to.params.idForm)
    if (to.params.idSubmission) {
      this.getSubmission()
    }
    this.form = form
    next()
  },
  mounted () {
    Loading.hide()
    this.$eventHub.on('formio.mounted', (formio) => {
      this.pages = formio.pages ? formio.pages : []
    })
    this.$eventHub.on('formio.nextPage', (data) => {
      this.currentPage = data.nextPage.page
      this.changeSelectedPage()
    })
    this.$eventHub.on('formio.prevPage', (data) => {
      this.currentPage = data.prevPage.page
      this.changeSelectedPage()
    })
    
    this.$eventHub.on('formio.render', (data) => {
      this.isWizard = !!(data.formio.wizard)
    })

    this.$eventHub.on('formio.change', (data) => {
      let scorePanels = []
      this.validateRequired(data.formio.pages, data)
      // This should only be called if this is a Wizard
      // Search all of the Score components in different pages
      _.forEach(data.formio.pages, (page) => {
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
      this.errors = data
      let submitButton = document.querySelector('.btn-wizard-nav-submit')
      if (submitButton && this.errors.count > 0) {
        submitButton.disabled = true
      } else {
        if (submitButton) {
          submitButton.disabled = false
        }
      }
    })
  },
  beforeDestroy() {
    document.removeEventListener('draftStatus', this.draftStatusChanged)
    this.$eventHub.$off('formio.error')
    this.$eventHub.$off('VALIDATION_ERRORS')
  },
  computed: {
    formTitle () {
      let title = ''
      if (this.form) {
        title = this.form ? this.form.title : ''
      }
      return title
    },
    _isWizard () {
      return this.isWizard
    },
    getFormClass () {
      let className = ''
      if (this.showPages) {
        className = 'col-lg-8  col-md-8 col-sm-8'
      } else {
        className = 'col-lg-10  col-md-10 col-sm-10 col-lg-offset-1 col-md-offset-1'
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
      submission: undefined,
      people: [{name: 'P1'}],
      formioToken: Auth.user().x_jwt_token,
      LOCAL_DRAFT_ENABLED: LOCAL_DRAFT_ENABLED,
      saved: false,
      errors: {},
      isWizard: false,
      pages: [],
      currentPage: 0,
      showPages: true
    }
  },
  methods: {
    ...mapActions(['getResources']),
    goToPage (index) {
      let pageNumber = index + 1
      let page = document.querySelectorAll('ul li:nth-of-type(' + pageNumber + ')')[0]
      page.click()
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
    // Refresh when pulled Down
    async refreshForm (done) {
      let form = await LocalForm.get(this.$route.params.idForm)
      this.form = form
      this.getSubmission()
      setTimeout(function () {
        if (done) {
          done()
        }
      }, 1200)
    },
    // Get Submission if we are Updating
    async getSubmission () {
      let submission = this.$route.params.idSubmission ? await LocalSubmission.get(this.$route.params.idSubmission) : undefined
      this.submission = (!_.isEmpty(submission)) ? submission : undefined
    },
    validateRequired (pages, data) {
      let errorCount = 0
      let errors = []
      _.forEach(pages, (page) => {
        FormioUtils.eachComponent(page.components, (component) => {
        if (component.input === true && component.validate && component.validate.required) {
          let value = data.formio.data[component.key]
          if (typeof value === 'undefined' || value === '') {
             errorCount = errorCount + 1
             errors.push(component)
            }
          }
        })
      })
      this.$eventHub.emit('VALIDATION_ERRORS', {count: errorCount, components: errors})
    }
  }
}
</script>
