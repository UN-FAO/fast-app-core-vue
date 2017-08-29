<template>
  <q-tabs>
        <!-- Tabs - notice slot="title" -->
        <q-tab default  slot="title" name="tab-1" icon="assessment" label="Score" />
        <q-tab :count="Unsynced.length"  slot="title" name="tab-2" icon="signal_wifi_off" label="Unsync" />

        <!-- Targets -->
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
    <q-item-side icon="input">
      {{index + 1}}
    </q-item-side>
    <q-item-main>
      <q-item-tile label>
        {{submission.data.formName}}
      </q-item-tile>
      <q-item-tile sublabel>
        {{humanizeDate(submission.data.created)}}
      </q-item-tile>

    </q-item-main>
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
import {QTabs, QTab, QTabPane, QScrollArea, QSideLink, QItemTile, QItemSide, QItemMain, QListHeader, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator} from 'quasar'
export default {
  components: {
    QTabs, QTab, QTabPane, QScrollArea, QSideLink, QItemTile, QItemSide, QItemMain, QListHeader, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator
  },
  data () {
    return {
      Unsynced: [],
      allSubmissionSubs: [],
      layoutStore
    }
  },
  /**
     * [beforeRouteUpdate description]
     * @param  {[type]}   to   [description]
     * @param  {[type]}   from [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
  mounted: async function () {
    const db = await Database.get()
    _.isEmpty(Auth.user())
    return
    
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
          this.Unsynced = filter
        })
    )
  },
  computed: {
    /**
       * [isOnline description]
       * @return {Boolean} [description]
       */
    isOnline () {
      return this.$root.VueOnline
    }
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
