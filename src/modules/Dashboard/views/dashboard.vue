<template>
  <div>

    <div class="row">
      <q-card class="col-sm-offset-2 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-3 col-xl-3" style="margin-top: 30px;">


        <q-card-main @click="$router.push({name: 'newSurvey'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <!--<q-icon name="fa-plus-square-o fa-5x" />-->
          <q-icon class="material-icons">playlist_add</q-icon>
          <h1>{{$t("Start survey") }}</h1>

          <q-list style="border: none; padding: 0;">
            <!--
      <q-collapsible>
        <div>

         <table style="display: block; height:200px; overflow-y: scroll;">
        <tr v-for="(form, index) in orderedForms" :key="form.data._id" v-if="form.data.tags.indexOf('visible') > -1" >
          <td class="col-lg-1"><q-icon name="fa-file-o" /></td>
          <td class="col-lg-10">
          <router-link :to="{name: 'formio_form_submission', params: { idForm: form.data.path}}"><h3>{{form.data.title.toUpperCase()}}</h3></router-link>
        </td>
        </tr>
      </table>

        </div>
      </q-collapsible>
       -->
          </q-list>

        </q-card-main>
      </q-card>

      <q-card class="col-md-4 col-lg-4 col-xl-3" style="margin-top: 30px; margin-left: 30px;">

        <q-card-main @click="$router.push({name: 'CollectedData'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <!--<q-icon name="fa-database fa-5x" />-->
          <q-icon class="material-icons">storage</q-icon>
          <h1> {{ $t("Collected Data") }}
            </h1>

          <q-list style="border: none; padding: 0;">
            <!--
      <q-collapsible>
        <div>
           <table style="display: block; height:200px; overflow-y: scroll;">

        <tr>
          <td class="col-lg-1"><q-icon name="fa-database" /></td>
          <td>
          <router-link :to="{name: 'formio_form_show', params: { idForm: '*'}}"><h3>ALL DATA</h3></router-link>
          </td>

        </tr>
        <tr v-for="(form, index) in orderedForms" :key="form.data._id" v-if="form.data.tags.indexOf('visible') > -1">
          <td class="col-lg-1"><q-icon name="fa-database" /></td>
          <td class="col-lg-10">
          <router-link :to="{name: 'formio_form_show', params: { idForm: form.data.path}}"><h3>{{form.data.title.toUpperCase()}}</h3></router-link>
        </td>
        </tr>
      </table>
        </div>
      </q-collapsible>
      -->
          </q-list>
        </q-card-main>
      </q-card>

    </div>



    <div class="row">
      <q-card class="col-sm-offset-2 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-3 col-xl-3" style="margin-top: 30px;">
        <q-card-main @click="$router.push({name: 'About'})" style="cursor: pointer; text-align: center;" class="mainActions">
          <!--<q-icon name="fa-tablet fa-5x" />-->
          <q-icon class="material-icons">tablet_mac</q-icon>
          <h1> {{ $t("About") }}
           <br>{{APP_ABOUT_NAME}} </h1>
        </q-card-main>

      </q-card>

      <q-card v-if="isAdmin()" class="col-md-4 col-lg-4 col-xl-3" style="margin-top: 30px; margin-left: 30px;">
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

<!--
<style scoped>

	.q-card {background-color: white;}
	.q-card-container {padding: 50px; padding-top: 65px;}
	.q-card-main {text-align: center;}
	.q-card-main .q-icon {color: #28536d; font-size: 6em;}

</style>
-->

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
