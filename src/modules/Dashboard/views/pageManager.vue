<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" >
    <div class="section-title" style="font-size: 30px;padding-top:30px">
      Manage System Page Manager
    </div>
    <hr style="border-top: 1px solid #7f7f7f;">
   <div class="row" v-for="(chunk, index) in chunckedElements" v-bind:key="index" style="padding-top:30px">
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
import Pages from "database/repositories/Configuration/Pages";
export default {
  async beforeRouteEnter(to, from, next) {
    let result = await Pages.getLocal();
    next(vm => {
      let element = vm.filterPage(result.pages, to.params.pageId);
      vm.elements = element.innerCards;
      console.log("vm.elements", vm.elements);
    });
  },
  async beforeRouteUpdate(to, from, next) {
    console.log("the route has changed 2");
    next();
  },
  data: function() {
    return {
      elements: [],
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
  },
  methods: {
    filterPage(pages, nextRoute) {
      let page = pages.filter(page => {
        return page.pagesPageUrl === nextRoute;
      });
      return page[0];
    }
  }
};
</script>
