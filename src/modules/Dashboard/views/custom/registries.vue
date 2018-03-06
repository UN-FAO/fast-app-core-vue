<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" >
    <div class="section-title" style="font-size: 30px;padding-top:30px">
      Registries
    </div>
    <hr style="border-top: 1px solid #7f7f7f;">
   <div class="row" v-for="(chunk, index) in chunckedElements" v-bind:key="index" style="padding-top:30px">
     <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12" v-for="element in chunk" v-bind:key="element.title" style="padding-top:30px">
      <q-card>
      <q-card-title>
        <q-item>
          <q-item-side :avatar="element.avatar" />
          <q-item-main>
            <q-item-tile label>{{element.title}}</q-item-tile>

          </q-item-main>
        </q-item>
              <q-card-separator />
        <span slot="subtitle" class="pull-left">
          {{element.subtitle}}
          <br>
          <q-btn color="primary" @click="$router.push(element.action)">
        {{element.actionText}}
        </q-btn>
        </span>
      </q-card-title>
    </q-card>
     </div>

   </div>
  </div>

</template>
<style>

</style>

<script>
import {
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QCardMedia,
  QItemSide,
  QFab,
  QFabAction,
  QFixedPosition,
  QPullToRefresh,
  QTabs,
  QTab,
  QTabPane,
  QCollapsible,
  QBtn,
  QIcon,
  QTooltip,
  QList,
  QItem,
  QItemSeparator
} from "quasar";
import _chunk from "lodash/chunk";
export default {
  data: function() {
    return {
      elements: [
        {
          title: "Fisheries directory",
          subtitle: "Manage the list of Applicants",
          avatar: "/statics/customSVG/fisheries.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "vessel-register" }
          },
          actionText: "Manage"
        },
        {
          title: "Companies",
          subtitle: "Manage the list of Companies",
          avatar: "/statics/customSVG/industries.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "vessel-register" }
          },
          actionText: "Manage"
        },
        {
          title: "Vessels",
          subtitle: "Manage the list of Vessels",
          avatar: "/statics/customSVG/vessels.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "vessel-register" }
          },
          actionText: "Manage"
        }
      ],
      chunkNumber: 3
    };
  },
  components: {
    QCard,
    QCardMedia,
    QItemSide,
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
    QCollapsible,
    QBtn,
    QIcon,
    QTooltip,
    QList,
    QItem,
    QItemSeparator
  },
  computed: {
    chunckedElements() {
      return _chunk(this.elements, this.chunkNumber);
    }
  }
};
</script>
