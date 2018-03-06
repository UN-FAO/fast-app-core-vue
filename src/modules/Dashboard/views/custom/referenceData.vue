<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" style="padding-bottom:50px">
    <div class="section-title" style="font-size: 30px;padding-top:30px">
      Reference Data
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
          title: "Species",
          subtitle: "The Species codelist",
          avatar: "/statics/customSVG/species.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "species" }
          },
          actionText: "Manage"
        },
        {
          title: "Fishery Product",
          subtitle: "The Fishery Product codelist",
          avatar: "/statics/customSVG/fisheryProduct.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "fishery-product" }
          },
          actionText: "Manage"
        },
        {
          title: "Gear",
          subtitle: "The Gears codelist",
          avatar: "/statics/customSVG/gear.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "gear" }
          },
          actionText: "Manage"
        },
        {
          title: "Countries",
          subtitle: "The Countries codelist",
          avatar: "/statics/customSVG/world.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "country" }
          },
          actionText: "Manage"
        },
        {
          title: "License Type",
          subtitle: "The License Types codelist",
          avatar: "/statics/customSVG/license.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "license-type" }
          },
          actionText: "Manage"
        },
        {
          title: "Fishing Zone",
          subtitle: "The Fishing Zones codelist",
          avatar: "/statics/customSVG/zone.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "fishing-zone" }
          },
          actionText: "Manage"
        },
        {
          title: "Landing Site",
          subtitle: "The Landing Sites codelist",
          avatar: "/statics/customSVG/landingsite.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "landing-site" }
          },
          actionText: "Manage"
        },
         {
          title: "Currency",
          subtitle: "The Currency codelist",
          avatar: "/statics/customSVG/currency.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "currency" }
          },
          actionText: "Manage"
        },
        {
          title: "Color",
          subtitle: "The Color codelist",
          avatar: "/statics/customSVG/color.svg",
          action: {
            name: "formio_form_show",
            params: { idForm: "color" }
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
