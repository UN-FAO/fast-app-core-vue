<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" v-bind:key="$route.path" style="padding-bottom:50px" >
    <div class="section-title pageTitle">
      {{$t(page.title)}}
    </div>
    <hr style="border-top: 1px solid lightgray;">

    <actioncards :page="page" v-bind:key="$route.path"></actioncards>

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

import Pages from "libraries/fastjs/repositories/Configuration/Pages";
import actioncards from "../components/actionCards";
export default {
  components: {
    actioncards,
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
  asyncData: {
    page: {
      async get() {
        let result = await Pages.getLocal();
        let element = this.filterPage(result.pages, this.$route.params.pageId);
        return element;
      },
      transform(result) {
        return result;
      }
    }
  },
  methods: {
    filterPage(pages, nextRoute) {
      let page = pages.filter(page => {
        return page.url === nextRoute;
      });
      return page[0];
    }
  }
};
</script>
