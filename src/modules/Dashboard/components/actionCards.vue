<template>
<div>
<div class="row" v-for="(chunk, index) in _elements" v-bind:key="index" style="padding-top:30px">
     <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12" v-for="element in chunk" v-bind:key="element.innerCardsTitle" style="padding-top:30px">
      <q-card>
      <q-card-title>
        <q-item>
          <q-item-side :avatar="element.innerCardsAvatar" />
          <q-item-main>
            <q-item-tile label>{{element.innerCardsTitle}}</q-item-tile>

          </q-item-main>
        </q-item>
              <q-card-separator />
        <span slot="subtitle" class="pull-left">
          {{element.innerCardsSubtitle}}
          <br>
        <q-btn color="primary" @click="$router.push(element.action)" v-if="action.innerCardsActionsTarget" v-for="action in element.innerCardsActions" v-bind:key="action.innerCardsActionsText">
          {{action.innerCardsActionsText}}
        </q-btn>
        </span>
      </q-card-title>
    </q-card>
     </div>

   </div>
</div>
</template>
<script>
import _chunk from "lodash/chunk";
import {
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
} from "quasar";
export default {
  name: "actioncards",
  props: ["page"],
  watch: {
    page: function(val) {
      console.log("val val val ", val);
    }
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
    _elements() {
      console.log('this.page', this.page)
      return _chunk(this.page.innerCards, 3);
    }
  }
};
</script>
