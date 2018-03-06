<template>
  <div>
  <div class="row" >
      <q-card class="col-sm-5 mainCards">
        <q-card-main @click="$router.push({name: 'newSurvey'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <q-icon class="material-icons">playlist_add</q-icon>
          <h1>{{ $t("Start survey") }}</h1>
        </q-card-main>
      </q-card>
    <q-card class="col-sm-5 mainCards">
        <q-card-main @click="$router.push({name: 'CollectedData'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <q-icon class="material-icons">storage</q-icon>
          <h1> {{ $t("Collected Data") }} </h1>
        </q-card-main>
      </q-card>
    </div>

    <div class="row" v-if="HAS_ABOUT">

    <q-card class="col-sm-5 mainCards mainCardsSmall">
        <q-card-main @click="$router.push({name: 'About'})" style="cursor: pointer; text-align: center;" class="mainActions ">
          <q-icon class="material-icons">tablet_mac</q-icon>
          <h1> {{ $t("About") }} {{APP_ABOUT_NAME}} </h1>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>
<script>
import {
  QCard,
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
  Loading
} from "quasar";
import _sortBy from "lodash/sortBy";
import { HAS_ABOUT, APP_ABOUT_NAME } from "config/env";
import Auth from "modules/Auth/api/Auth";

export default {
  name: "card",
  components: {
    QCard,
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
    Loading
  },
  data: () => {
    return {
      forms: [],
      subscriptions: [],
      APP_ABOUT_NAME: APP_ABOUT_NAME,
      HAS_ABOUT: HAS_ABOUT
    };
  },
  computed: {
    // a computed getter
    orderedForms: function() {
      let ordered = [];
      if (this.forms.length === 0) {
        return [];
      } else {
        ordered = _sortBy(this.forms, "data.title");
        return ordered;
      }
    }
  },
  methods: {
    isAdmin() {
      return Auth.hasRole("Administrator");
    }
  }
};
</script>
