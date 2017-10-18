<template>
  <q-tabs>
        <!-- Tabs - notice slot="title" -->
        <!-- This tab should render only when we have Wizards -->
        <q-tab default  slot="title" name="tab-wizard" icon="signal_wifi_off" label="Modules"/>
        <q-tab v-if="scorePanels.length > 0"  slot="title" name="tab-1" icon="assessment" label="Score" />
        <q-tab  :count="Unsynced.length"  slot="title" name="tab-2" icon="signal_wifi_off" label="Unsync" />

        <!-- Targets -->
        <!-- This should be extracted to its own component -->
        <q-tab-pane v-if="_isWizard" name="tab-wizard">
           <q-list separator>
          <!-- collapsible to hide sub-level menu entries -->    
            <q-item multiline  link color="green" icon="favorite" v-for="(page, index) in pages" :label="page.title" :key="page.title" @click="goToPage(index)" :ref="'page-'+ index">
            <q-item-main
              :label="page.title"
              label-lines="3"
            />      
          </q-item>
        </q-list>
        </q-tab-pane>
        <!-- //////////////////////////// -->

        <q-tab-pane name="tab-1">
            <q-list separator>
          <!-- collapsible to hide sub-level menu entries -->
          <q-collapsible v-for="(panel, index) in scorePanels"  separator :key="panel.key" icon="apps" :label="panel.title" >
           
            <q-item multiline icon="favorite" v-for="(component, cIndex) in panel.components" :label="component.label" :key="component.key">
            <q-item-side icon="school" />
            <q-item-main
              :label="component.label"
              label-lines="3"
            />
            <q-item-side right :stamp="component.value" />
          </q-item>


          </q-collapsible>
        </q-list>

        </q-tab-pane>


        <q-tab-pane name="tab-2">
  
       <q-list-header>{{ $t("App.unsynced_actions") }}
        
          <q-btn flat  color="primary" @click="getForms()">
          <q-icon name="cloud_upload" />
          <q-tooltip anchor="center right" self="center left" :offset="[10, 0]">
            {{ $t("App.sync_submissions") }}
          </q-tooltip>
          </q-btn>
       </q-list-header>


  <q-item v-for="(submission, index) in Unsynced"  separator :key="submission._id">
    <q-item-side icon="assignmente" />
    <q-item-main>
      <q-item-tile label>
        {{submission.data.formio.formId}}
      </q-item-tile>

    </q-item-main>

    <q-item-side right icon="more_vert">
    <q-item-tile stamp>{{humanizeDate(submission.data.created)}}</q-item-tile>
            <q-popover ref="popover">
              <q-list link>
                <q-item @click="$refs.popover.close()">
                  <q-item-main label="Reply" />
                </q-item>
                <q-item @click="$refs.popover.close()">
                  <q-item-main label="Forward" />
                </q-item>
                <q-item @click="$refs.popover.close()">
                  <q-item-main label="Delete" />
                </q-item>
              </q-list>
            </q-popover>
          </q-item-side>
  </q-item>


   </q-tab-pane>
 
</q-tabs>
</template>
<script>
import _ from 'lodash'
import layoutStore from './layout-store'
import * as Database from 'database/Database'
import moment from 'moment'
import Auth from 'modules/Auth/api/Auth'
import FormioUtils from 'formiojs/utils'
import {QTabs, QTab, QTabPane, QScrollArea, QSideLink, QItemTile, QItemSide, QItemMain, QListHeader, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator, QPopover} from 'quasar'
export default {
  components: {
    QTabs, QTab, QTabPane, QScrollArea, QSideLink, QItemTile, QItemSide, QItemMain, QListHeader, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator, QPopover
  },
  data () {
    return {
      Unsynced: [],
      allSubmissionSubs: [],
      layoutStore,
      isWizard: false,
      scorePanels: [],
      pages: [],
      currentPage: 0
    }
  },
  computed: {
    _isWizard () {
      return this.isWizard
    }
  },
  beforeDestroy: function () {
    this.allSubmissionSubs.forEach(sub => sub.unsubscribe())
  },
  /**
     * [beforeRouteUpdate description]
     * @param  {[type]}   to   [description]
     * @param  {[type]}   from [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
  mounted: async function () {
    this.$eventHub.on('formio.mounted', (formio) => {
      console.log('component mounted', formio)
      this.pages = formio.pages ? formio.pages : []
    })
    this.$eventHub.on('formio.nextPage', (data) => {
      console.log('formio.nextPage', data)
      this.currentPage = data.nextPage.page
      this.changeSelectedPage()
    })
    this.$eventHub.on('formio.prevPage', (data) => {
      console.log('formio.prevPage', data)
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

    const db = await Database.get()
    if (_.isEmpty(Auth.user())) {
      return
    }
    
    this.allSubmissionSubs.push(
      db.submissions
        .find({
          'data.sync': false,
          'data.draft': false,
          'data.user_email': {
            $exists: true,
            $eq: Auth.user().data.email || Auth.user().email
          }
        })
        .$
        .filter(x => x != null)
        .subscribe(results => {
          let filter = _.filter(results, function (o) {
            return true
          })

          filter = _.orderBy(filter, ['data.created'], ['desc'])
          this.Unsynced = filter
        })
    )
  },
  methods: {
    goToPage (index) {
      let pageNumber = index + 1
      let page = document.querySelectorAll('ul li:nth-of-type(' + pageNumber + ')')[0]
      page.click()
    },
    changeSelectedPage () {
      console.log('page should be', this.currentPage)
      let ref = 'page-' + this.currentPage
      let listPage = this.$refs[ref]
      console.log(listPage)
    },
    humanizeDate (givenDate) {
      let start = moment(givenDate)
      let end = moment()
      return end.to(start)
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
