<template>
  <q-tabs>
    <!-- Tabs - notice slot="title" -->
    <q-tab v-if="scorePanels.length > 0 && $route.name === 'formio_submission_update'" slot="title" name="tab-1" icon="assessment" label="Score" />
    <q-tab default :count="Unsynced.length" slot="title" name="tab-2" icon="signal_wifi_off" :label="$t('Unsynced')" />

    <q-tab-pane name="tab-1" v-if="scorePanels.length > 0 && $route.name === 'formio_submission_update'">
      <q-list separator>
        <!-- collapsible to hide sub-level menu entries -->
        <q-collapsible v-for="(panel, index) in scorePanels" separator :key="panel.key" icon="apps" :label="panel.title">

          <q-item multiline icon="favorite" v-for="(component, cIndex) in panel.components" :label="component.label" :key="component.key">
            <q-item-side icon="school" />
            <q-item-main :label="component.label" label-lines="3" />
            <q-item-side right :stamp="component.value === 0 ? '0' : component.value " />
          </q-item>

        </q-collapsible>
      </q-list>

    </q-tab-pane>

    <q-tab-pane name="tab-2">

      <q-list-header>{{ $t("Unsynced Actions") }}

        <q-btn flat color="primary" @click="syncSubmissions()">
          <q-icon name="cloud_upload" />
          <q-tooltip anchor="center right" self="center left" :offset="[10, 0]">
            {{ $t("Sync Actions") }}
          </q-tooltip>
        </q-btn>
      </q-list-header>


      <q-item v-for="(submission, index) in Unsynced" separator :key="submission._id">
        <q-item-side :icon="submission.data.syncError ? 'fa-exclamation' : 'assignment'" :color="submission.data.syncError ? 'red' : 'inherit'"
        />
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
import _forEach from "lodash/forEach";
// import _isEmpty from "lodash/isEmpty";
// import _orderBy from "lodash/orderBy";
// import _filter from "lodash/filter";
import Submission from "database/models/Submission";
import moment from "moment";
// import Auth from "modules/Auth/api/Auth";
import FormioUtils from "formiojs/utils";
import {
  QTabs,
  QTab,
  QTabPane,
  QScrollArea,
  QSideLink,
  QItemTile,
  QItemSide,
  QItemMain,
  QListHeader,
  QCollapsible,
  QBtn,
  QIcon,
  QTooltip,
  QList,
  QItem,
  QItemSeparator,
  QPopover
} from "quasar";
export default {
  components: {
    QTabs,
    QTab,
    QTabPane,
    QScrollArea,
    QSideLink,
    QItemTile,
    QItemSide,
    QItemMain,
    QListHeader,
    QCollapsible,
    QBtn,
    QIcon,
    QTooltip,
    QList,
    QItem,
    QItemSeparator,
    QPopover
  },
  data() {
    return {
      Unsynced: [],
      allSubmissionSubs: [],
      scorePanels: []
    };
  },
  beforeDestroy: function() {
    this.allSubmissionSubs.forEach(sub => sub.unsubscribe());
  },
  /**
   * [beforeRouteUpdate description]
   * @param  {[type]}   to   [description]
   * @param  {[type]}   from [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  mounted: async function() {
    this.$eventHub.on("FAST-DATA_SYNCED", data => {
      this.updateUnsyncedSubmissions();
    });

    this.$eventHub.on("formio.change", data => {
      let scorePanels = [];
      // This should only be called if this is a Wizard
      // Search all of the Score components in different pages
      if (data.formio && data.formio.pages) {
        _forEach(data.formio.pages, page => {
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
      } else if (data.formio && data.formio.components) {
        let panels = FormioUtils.findComponents(
          data.formio.component.components,
          {
            type: "panel"
          }
        );
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
      }
      this.scorePanels = scorePanels;
    });
    await this.updateUnsyncedSubmissions();
  },
  methods: {
    humanizeDate(givenDate) {
      let start = moment(givenDate);
      let end = moment();
      return end.to(start);
    },
    async updateUnsyncedSubmissions() {
      this.Unsynced = await Submission.getUnsync();
    }
  }
};
</script>
