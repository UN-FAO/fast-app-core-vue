<template>
    <q-pull-to-refresh :handler="refreshSubmissions">
        <q-card>
            <q-card-title class="bg-primary text-white">
                {{ $t("App.new_submission_for") }} {{formTitle}}
            </q-card-title>
            <q-card-separator />
            <q-card-main>

                <q-tabs inverted>
                    <!-- Tabs - notice slot="title" -->
                    <q-tab default slot="title" name="tab-1" icon="person" label="P1" />

                    <!-- Targets -->
                    <q-tab-pane name="tab-1">

                        <!-- Tabs -->
                        <formio 
                          :formioURL="formioURL" 
                          :localJsonForm="form" 
                          :submission="submission"
                          :formioToken="formioToken"
                        />
                    </q-tab-pane>

                </q-tabs>

                <q-fixed-position corner="top-right" :offset="[18, 18]">
                    <q-fab color="red" icon="add" direction="left" push>
                        <q-fab-action color="secondary" @click="refreshForm()" icon="autorenew"></q-fab-action>

                        <q-fab-action color="amber" @click="addSurvey()" icon="person_add"></q-fab-action>

                    </q-fab>
                </q-fixed-position>

            </q-card-main>
        </q-card>
    </q-pull-to-refresh>
</template>

<script>
import _ from 'lodash'
import Auth from 'modules/Auth/api/Auth'
import formio from 'modules/Formio/components/formio'
import LocalForm from 'database/collections/scopes/LocalForm'
import LocalSubmission from 'database/collections/scopes/LocalSubmission'
import {APP_URL} from 'config/env'
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
    this.submission = undefined
    this.form = null
    if (to.params.idSubmission) {
      this.getSubmission()
    }
    let form = await LocalForm.get(this.$route.params.idForm)
    this.form = form
    next()
  },
  computed: {
    formTitle () {
      console.log('this.currentForm.title => ', this.form)
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
      formioToken: Auth.user().x_jwt_token
    }
  },
  methods: {
    addSurvey () {
      let self = this
      this.$swal({
        title: 'Enter short name to add',
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
    // Refresh when pulled Down
    async refreshForm (done) {
      // this.getLocalForm()
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
