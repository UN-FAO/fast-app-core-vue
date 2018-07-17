<template>
  <div
    class="container-fluid col-lg-offset-1 col-lg-10"
    v-bind:key="$route.path"
    style="padding-bottom:50px"
  >
    <div class="pageTitle">
      {{page && page.title ? $t(page.title) : ''}}
    </div>
    <breadcrum
      :parent="$route.query.parent"
      :currentPageTitle="pageTitle"
    />

    <hr style="border-top: 1px solid lightgray">

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
import breadcrum from 'components/breadcrum';
export default {
  components: {
    breadcrum,
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
        result = this.filterPage(result.pages, this.$route.params.pageId);
        result = [result]
        // TODO We still have to figure out why All data is not resolving
        let pages = await result.map(async (page) => {
          page.cards.map(async (card) => {
            card.shouldDisplay = await Auth.hasRoleIdIn(card.access);
            card.actions.map(async (action) => {
              action.shouldDisplay = await Auth.hasRoleIdIn(action.access);
              return action;
            });

            return card;
          });
          page.shouldDisplay = await Auth.hasRoleIdIn(page.access);
          return page;
        });

        return Promise.all(pages);
      },
      transform(result) {
        return result[0]
      }
    }
  },
  data() {
    return {
      breadCrumTitle:
        this.$route.query &&
        this.$route.query.parent &&
        this.$route.query.parent !== 'null'
          ? '/ ' + JSON.parse(atob(this.$route.query.parent)).title
          : ''
    };
  },
  methods: {
    breadCrumClick() {
      this.$router.push({
        name: 'pageManager',
        params: { pageId: JSON.parse(atob(this.$route.query.parent)).url }
      });
    },
    filterPage(pages, pageId) {
      let page = pages.filter((page) => {
        return page.url === pageId;
      });
      return page[0];
    }
  },
  computed: {
    pageTitle() {
      return this.page && this.page.title ? this.$t(this.page.title) : '';
    }
  }
};
</script>
