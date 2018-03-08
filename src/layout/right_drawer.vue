<template>
  <q-tabs>
    <!-- Tabs - notice slot="title" -->
    <q-tab v-if="scorePanels.length > 0 && $route.name === 'formio_submission_update'" slot="title" name="tab-1" icon="assessment" label="Score" />
    <q-tab default :count="Unsynced.length" slot="title" name="tab-2" icon="signal_wifi_off" :label="$t('Unsynced')" />

    <q-tab-pane name="tab-1" v-if="scorePanels.length > 0 && $route.name === 'formio_submission_update'">
      <q-list separator>
        <!-- collapsible to hide sub-level menu entries -->
        <q-collapsible v-for="panel in scorePanels" separator :key="panel.key" icon="apps" :label="panel.title">

          <q-item multiline icon="favorite" v-for="component in panel.components" :label="component.label" :key="component.key">
            <q-item-side icon="school" />
            <q-item-main :label="component.label" label-lines="3" />
            <q-item-side right :stamp="component.value === 0 ? '0' : component.value " />
          </q-item>

        </q-collapsible>
      </q-list>

    </q-tab-pane>
  </q-tabs>
</template>
<script>
import _forEach from "lodash/forEach";
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
      scorePanels: []
    };
  },
  mounted: async function() {
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
  }
};
</script>
