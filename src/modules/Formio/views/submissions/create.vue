<template>
    <q-pull-to-refresh :handler="refreshSubmissions">
      <div class="row">       
        <q-card color="white" class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1" >
            
            <q-card-main>
                <q-tabs inverted>
                    <!-- Tabs - notice slot="title" -->
                    <q-tab default slot="title" name="tab-1" icon="person" label="P1"
                     :color="saved ? 'primary' : 'red'" />
                    <!-- Targets -->
                    <q-tab-pane name="tab-1">
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
                        />
                    </q-tab-pane>

                </q-tabs>

                <q-fixed-position corner="top-right" :offset="[18, 18]">
                    <q-fab color="red" icon="add" direction="left" push>
                        <q-fab-action color="secondary" @click="refreshForm()" icon="autorenew"></q-fab-action>

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
}
</style>

<script>
import _ from 'lodash'
import {mapActions} from 'vuex'
import Auth from 'modules/Auth/api/Auth'
import formio from 'modules/Formio/components/formio/formio'
import LocalForm from 'database/collections/scopes/LocalForm'
import LocalSubmission from 'database/collections/scopes/LocalSubmission'
import {APP_URL, LOCAL_DRAFT_ENABLED} from 'config/env'
import {QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator} from 'quasar'


export default {
  components: {
    formio, QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator
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
    document.addEventListener('draftStatus', this.draftStatusChanged)
    this.$eventHub.$on('formio.error', (error) => {
      console.log(error)
      this.$swal({
          type: 'error',
          title: 'Error',
          html: 'You have errors in the submission'
        }).then(() => {
          window.scrollTo(0, 0)
        })
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
      console.log(this.errors.count)
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
      errors: {}
    }
  },
  methods: {
    ...mapActions(['getResources']),
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
    }
  }
}
</script>
