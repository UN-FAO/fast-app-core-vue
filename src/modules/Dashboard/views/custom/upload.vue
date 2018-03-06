<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" >
    <div class="section-title" style="font-size: 30px;padding-top:30px">
      Data upload
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
          title: "Purchase Orders",
          subtitle: "Manage data of Purchase Orders",
          avatar: "/statics/customSVG/purchase.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "vessel-register" }
          },
          actionText: "Manage"
        },
        {
          title: "Sample Based Survey",
          subtitle: "Manage data of Sample Based Survey",
          avatar: "/statics/customSVG/fisheries.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "vessel-register" }
          },
          actionText: "Manage"
        },
          {
          title: "Large Vessel Logbook Activity",
          subtitle: "Manage data of Large Vessel Logbook Activity",
          avatar: "/statics/customSVG/largevessel.svg",
          action: {name: 'registries'},
          actionText: "Manage"
        },
         {
          title: "Log books",
          subtitle: "Manage data of Log books",
          avatar: "/statics/customSVG/logbook.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "vessel-register" }
          },
          actionText: "Manage"
        },
        {
          title: "IUU forms",
          subtitle: "Manage data of IUU forms",
          avatar: "/statics/customSVG/ilegal.svg",
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
