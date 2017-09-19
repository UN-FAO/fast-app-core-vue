<template>
  <q-tabs>
        <!-- Tabs - notice slot="title" -->
        <!-- This tab should render only when we have Wizards -->
        <q-tab v-if="_isWizard"  slot="title" name="tab-wizard" icon="signal_wifi_off" label="Components"/>
        <q-tab   slot="title" name="tab-1" icon="assessment" label="Score" />
        <q-tab default :count="Unsynced.length"  slot="title" name="tab-2" icon="signal_wifi_off" label="Unsync" />

        <!-- Targets -->
        <q-tab-pane v-if="_isWizard" name="tab-wizard">Wizard tab</q-tab-pane>
        <q-tab-pane name="tab-1">Tab One</q-tab-pane>
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
      isWizard: false
    }
  },
  computed: {
    _isWizard () {
      return this.isWizard
    }
  },
  beforeDestroy: function () {
    console.log('Destroying')
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
    this.$eventHub.on('formio.render', (data) => {
      console.log('The form is now redered', data)
      this.isWizard = !!(data.formio.wizard)
    })

    const db = await Database.get()
    if (_.isEmpty(Auth.user())) {
      return
    }
    
    this.allSubmissionSubs.push(
      db.submissions
        .find({
          'data.sync': false,
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
          console.log('filter => ', filter)
          this.Unsynced = filter
        })
    )
  },
  methods: {
    humanizeDate (givenDate) {
      let start = moment(givenDate)
      let end = moment()
      return end.to(start)
    }
  }
}
</script>
