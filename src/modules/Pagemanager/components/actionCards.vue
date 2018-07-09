<template>
<div>
<div class="col-lg-12 col-md-12 col-sm-12 ">
  <div class="col-lg-6 col-md-8 col-sm-8 col-xs-8 pull-right">
  <q-search  v-model="filter" :placeholder="$t('Filter results...')" />
</div>
</div>
<div v-for="(chunk, index) in _cards" v-bind:key="index" class="col-lg-12">
     <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" v-for="card in chunk" v-bind:key="card.title" style="margin:auto;" v-if="card.shouldDisplay">
      <q-card color="white" class="text-black cardRibbon">
      <q-card-title>
        <q-item>
          <q-item-side  :icon="!card.customIcon && card.icon ? card.icon : null" :avatar="card.customIcon && card.icon ? card.icon : null"/>
          <q-item-main>
            <q-item-tile label>{{$t(card.title)}}</q-item-tile>

          </q-item-main>
        </q-item>
              <q-card-separator style="background:lightgrey;"/>
        <span slot="subtitle" class="pull-left text-grey" style="padding-top:10px;">
          {{$t(card.subtitle)}}
          <br>
        <q-btn color="primary" style="margin-top:10px" @click="applyAction(action)" v-if="action.target && action.shouldDisplay"  v-for="action in card.actions" v-bind:key="action.text">
          {{$t(action.text)}}
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
import _chunk from 'lodash/chunk';
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
  QItemMain,
  QSearch,
  QItemTile
} from 'quasar';
export default {
  name: 'actioncards',
  props: ['page'],
  data() {
    return {
      filter: ''
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
    QItemSeparator,
    QItemMain,
    QItemTile
  },
  computed: {
    _cards() {
      let cards = this.page && this.page.cards ? this.page.cards : [];
      cards = cards.filter((c) => {
        return c.title.toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
      });
      return _chunk(cards, 3);
    }
  },
  methods: {
    applyAction(action) {
      let parent =
        action.parent && action.parent !== '' ? action.parent : 'null';

      if (action.formPath) {
        let path =
          action.view === 'list'
            ? '/forms/' + action.formPath + '?parent=' + JSON.stringify(parent)
            : '/forms/' + action.formPath + '/submission';
        let to = {
          path
        };
        this.$router.push(to);
      } else if (action.internal) {
        let to = { name: action.internalUrl }
        this.$router.push(to);
      } else if (action.page) {
        let to = {
          name: 'pageManager',
          params: { pageId: action.page.url },
          query: { parent: action.parent ? action.parent : 'null' }
        };
        this.$router.push(to);
      }
    }
  }
};
</script>
