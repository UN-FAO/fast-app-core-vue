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

    <actioncards :page="JSON.stringify(page)" v-bind:key="$route.path"></actioncards>

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
import Promise from 'bluebird';
import _cloneDeep from 'lodash/cloneDeep';
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
        result = _cloneDeep(result);
        let page = this.filterPage(result.pages, this.$route.params.pageId);
        page.shouldDisplay = await Auth.hasRoleIdIn(page.access);
        await Promise.map(page.cards, async (card) => {
          card.shouldDisplay = await Auth.hasRoleIdIn(card.access);

          await Promise.map(card.actions, async (action) => {
            action.shouldDisplay = await Auth.hasRoleIdIn(action.access);
            return action;
          });
          return card;
        });

        return page;
      },
      transform(result) {
        return result;
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
