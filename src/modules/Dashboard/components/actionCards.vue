<template>
<div>
<div class="col-lg-12 col-md-12 col-sm-12 ">
  <div class="col-lg-6 col-md-8 col-sm-8 col-xs-8 pull-right">
  <q-search  v-model="filter" placeholder="Filter results..." />
</div>
</div>
<div v-for="(chunk, index) in _elements" v-bind:key="index" >
     <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" v-for="element in chunk" v-bind:key="element.innerCardsTitle" style="margin:auto;">
      <q-card color="white" class="text-black">
      <q-card-title>
        <q-item>
          <q-item-side :avatar="element.innerCardsAvatar" />
          <q-item-main>
            <q-item-tile label>{{element.innerCardsTitle}}</q-item-tile>

          </q-item-main>
        </q-item>
              <q-card-separator style="background:lightgrey;"/>
        <span slot="subtitle" class="pull-left text-grey">
          {{element.innerCardsSubtitle}}
          <br>
        <q-btn color="primary" @click="applyAction(action)" v-if="action.innerCardsActionsTarget" v-for="action in element.innerCardsActions" v-bind:key="action.innerCardsActionsText">
          {{action.innerCardsActionsText}}
        </q-btn>
        </span>
      </q-card-title>
    </q-card>
     </div>

   </div>
</div>
</template>
<style scoped>
.q-if.row.no-wrap.items-center.relative-position.q-input.q-search.text-primary {
    border-bottom: 1px solid grey;
}
</style>
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
  QItemSeparator,
  QSearch
} from "quasar";
export default {
  name: "actioncards",
  props: ["page"],
  data() {
    return {
      filter: ""
    };
  },
  watch: {
    page: function(val) {
      this.$forceUpdate();
    }
  },
  components: {
    QSearch,
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
      let cards = this.page.innerCards;
      cards = cards.filter(c => {
        return c.innerCardsTitle.toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
      });
      return _chunk(cards, 3);
    }
  },
  methods: {
    applyAction(action) {
      if (action.innerCardsActionsForm) {
        let name =
          action.innerCardsActionsAction === "list"
            ? "formio_form_show"
            : "formio_form_submission";
        let to = {
          name: name,
          params: { idForm: action.innerCardsActionsForm.path }
        };
        this.$router.push(to);
      } else if (action.innerCardsActionsPageName) {
        let to = {
          name: "pageManager",
          params: { pageId: action.innerCardsActionsPageName.pagesPageUrl }
        };
        this.$router.push(to);
      }
    }
  }
};
</script>
