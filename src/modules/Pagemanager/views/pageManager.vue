<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" v-bind:key="$route.path" style="padding-bottom:50px" >
    <div class="section-title pageTitle">
      {{page && page.title ? $t(page.title) : ''}}
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
} from 'quasar';

import { PagesRepo, Auth } from 'fast-fastjs';
import actioncards from '../components/actionCards';
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
        let result = await PagesRepo.getLocal();
        let pages = await result.pages.map(async (page) => {
          page.cards.map(async (card) => {
            card.shouldDisplay = await Auth.hasRoleIdIn(card.access);
            card.actions.map(async (action) => {
              action.shouldDisplay = await Auth.hasRoleIdIn(action.access);
              return action
            });
            return card
          });
          page.shouldDisplay = await Auth.hasRoleIdIn(page.access);
          return page;
        });
        return Promise.all(pages);
      },
      transform(result) {
        return this.filterPage(result, this.$route.params.pageId);
      }
    }
  },
  methods: {
    filterPage(pages, pageId) {
      let page = pages.filter((page) => {
        return page.url === pageId;
      });
      return page[0];
    }
  }
};
</script>
