<template>
  <div>
    <div class="row" >
      <q-card class="col-sm-offset-2 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-3 col-xl-3 mainCards" style="margin-top: 30px;">
        <q-card-main @click="$router.push({name: 'newSurvey'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <q-icon class="material-icons">playlist_add</q-icon>
          <h1>{{$t("Start survey") }}</h1>
        </q-card-main>
      </q-card>

      <q-card class="col-md-4 col-lg-4 col-xl-3 mainCards" style="margin-top: 30px;">
        <q-card-main @click="$router.push({name: 'CollectedData'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <q-icon class="material-icons">storage</q-icon>
          <h1> {{ $t("Collected Data") }} </h1>
        </q-card-main>
      </q-card>

    </div>

    <div class="row" >
      <q-card class="col-sm-offset-2 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-3 col-xl-3 mainCards" style="margin-top: 30px;">
        <q-card-main @click="$router.push({name: 'About'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <!--<q-icon name="fa-tablet fa-5x" />-->
          <q-icon class="material-icons">tablet_mac</q-icon>
          <h1> {{ $t("About") }}
           <br>{{APP_ABOUT_NAME}} </h1>
        </q-card-main>

      </q-card>

      <q-card v-if="isAdmin()" class="col-md-4 col-lg-4 col-xl-3 mainCards" style="margin-top: 30px;">
          <q-card-main @click="$router.push({name: 'settings'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <!--<q-icon name="fa-cog fa-5x" />-->
          <q-icon class="material-icons">settings</q-icon>
          <h1>{{ $t("Application Settings") }}</h1>
          <q-btn @click="toggleFlip(3)" round color="grey" flat>
          </q-btn>
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
import { APP_ABOUT_NAME } from "config/env";
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
      APP_ABOUT_NAME: APP_ABOUT_NAME
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
