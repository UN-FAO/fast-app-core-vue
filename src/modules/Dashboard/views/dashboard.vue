<template>
  <div>
      
      
<!--    Vertical Version with box vertically aligned 
      
    <div class="row" >
      <!-- <q-card class="col-sm-offset-1 col-md-5 col-md-offset-2 col-lg-4 col-lg-offset-3 col-xl-3 mainCards" style="margin-top: 100px;">
      <q-card class="col-sm-6 mainCards" style="margin-top: 4vh;">
        <q-card-main @click="$router.push({name: 'newSurvey'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <q-icon class="material-icons">playlist_add</q-icon>
          <h1>{{$t("Start survey") }}</h1>
        </q-card-main>
      </q-card>
   </div>
   <div class="row" >
      <!-- <q-card class="col-md-5 col-lg-4 col-xl-3 mainCards" style="margin-top: 100px;">
    <q-card class="col-sm-6 mainCards" style="margin-top: 4vh;">
        <q-card-main @click="$router.push({name: 'CollectedData'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <q-icon class="material-icons">storage</q-icon>
          <h1> {{ $t("Collected Data") }} </h1>
        </q-card-main>
      </q-card>
    </div>

    <div class="row" >
      <!--<q-card class="col-sm-offset-1 col-md-offset-2 col-md-10  col-lg-8 col-lg-offset-5 col-xl-3 mainCards mainCardsSmall" style="margin-top: 10px;">
    
    <q-card class="col-sm-5 mainCards mainCardsSmall">
        <q-card-main @click="$router.push({name: 'About'})" style="cursor: pointer; text-align: center;" class="mainActions ">
          <!--<q-icon name="fa-tablet fa-5x" />
          <q-icon class="material-icons">tablet_mac</q-icon>
          <h1> {{ $t("About") }} {{APP_ABOUT_NAME}} </h1>
        </q-card-main>

      </q-card>
    </div>


      
-->  
      
      
<!--    Horizontal version with boxes horizontally aligned  --> 
      
  <div class="row" >
      <!--<q-card class="col-sm-offset-1 col-md-5 col-md-offset-2 col-lg-4 col-lg-offset-3 col-xl-3 mainCards" style="margin-top: 100px;">-->
      <q-card class="col-sm-5 mainCards">
        <q-card-main @click="$router.push({name: 'newSurvey'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <q-icon class="material-icons">playlist_add</q-icon>
          <h1>{{$t("Start new survey") }}</h1>
        </q-card-main>
      </q-card>
      <!--<q-card class="col-md-5 col-lg-4 col-xl-3 mainCards" style="margin-top: 100px;">-->
    <q-card class="col-sm-5 mainCards">
        <q-card-main @click="$router.push({name: 'CollectedData'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <q-icon class="material-icons">storage</q-icon>
          <h1> {{ $t("Collected Data") }} </h1>
        </q-card-main>
      </q-card>
    </div>

    <div class="row" >
      <!--<q-card class="col-sm-offset-1 col-md-offset-2 col-md-10  col-lg-8 col-lg-offset-5 col-xl-3 mainCards mainCardsSmall" style="margin-top: 10px;">-->
    <!--<q-card class="col-sm-11 mainCards mainCardsSmall Transparent">-->
    <q-card class="col-sm-5 mainCards mainCardsSmall">
        <q-card-main @click="$router.push({name: 'About'})" style="cursor: pointer; text-align: center;" class="mainActions ">
          <!--<q-icon name="fa-tablet fa-5x" />-->
          <q-icon class="material-icons">tablet_mac</q-icon>
          <h1> {{ $t("About") }} {{APP_ABOUT_NAME}} </h1>
        </q-card-main>

      </q-card>
    </div>

    <div class="row" >
      <!--  <q-card v-if="isAdmin()" class="col-sm-offset-1 col-md-offset-2 col-md-10  col-lg-8 col-lg-offset-5 col-xl-3 mainCards mainCardsSmall" style="margin-top: 10px;">-->
        <q-card v-if="isAdmin()" class="col-sm-11 mainCards mainCardsSmall Admin">
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

<style>
    
    .q-card {margin: 0px auto;}
    
    .q-card-main.mainActions h1 {
        /* font-size: 3.5vh; */
        line-height: 4.5vh;
    } 
    
    .q-card.mainCardsSmall {height: 20vh; background: none !important; box-shadow: none;}
    .q-card.mainCardsSmall .mainActions {padding: 20px;}
    .q-card.mainCardsSmall h1 {font-size: 2.5vh;}
    
    .q-card.Admin {margin-top: 0px !important;}

    .q-card.mainCards {margin-top: 3vh;}
    .q-card.mainCardsSmall {margin-top: 3vh;}
    
    @media (min-width: 576px)  {

      .q-card.mainCards {margin-top: 20vh;}
      .q-card.mainCardsSmall {margin-top: 20vh !important;}

    }

    
    
</style>





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
