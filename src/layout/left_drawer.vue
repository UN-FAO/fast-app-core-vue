<template>
  <q-scroll-area style="width: 100%; height: 100%">
    <q-list-header class="bg-primary text-white" style="padding-left: 0px; height: 50px; background:#00293c !important;">
      <center>
        <img src="statics/2000px-FAO_logo_reverse.png" style="max-height: 40px; max-width: 40px;" /> {{appName}}
      </center>
    </q-list-header>
    <q-list>

      <q-item-separator inset />

    </q-list>

    <q-side-link item :to="{name: 'dashboard', exact: true}">
      <q-item-side icon="pin_drop" />
      <q-item-main :label="$t('Home')" />
    </q-side-link>
    <q-item-separator />
    <q-item  style="color:#17ff00" @click="syncApp()">
        <q-tooltip anchor="center right" self="center left" :offset="[10, 0]">
          <strong>{{ $t("Sync app") }}</strong>
        </q-tooltip>
      <q-item-side icon="cloud_download" left style="color:#17ff00"/>
      <q-item-main :label="$t('Sync Application')" />
    </q-item>
     <q-item-separator  />

    <q-side-link multiline highlight item :to="{name: 'newSurvey'}" :key="newSurvey">
      <q-item-side icon="playlist_add" />
      <q-item-main :label="$t('Start new Collection')" />
    </q-side-link>


    <q-side-link multiline highlight item :to="{name: 'CollectedData'}" :key="Data">
      <q-item-side icon="storage" />
      <q-item-main :label="$t('Collected Data')" />
    </q-side-link>

    <q-side-link v-if="isAdmin()" multiline highlight item :to="{name: 'settings'}" :key="settings">
      <q-item-side icon="fa-cog" />
      <q-item-main :label="$t('Application Settings')"/>
    </q-side-link>


    <q-side-link multiline highlight item :to="{name: 'About'}" :key="about" v-if="HAS_ABOUT">
      <q-item-side icon="tablet_mac" />
      <q-item-main :label="$t('About') +' '+ appName" />
    </q-side-link>

    <!--
         <q-side-link multiline highlight  item
          :to="{name: 'd', params: { idForm: 'idform'}}"
          :key="lenguage">
          <q-item-side icon="language" />
          <q-item-main label="Language Settings"  />
        </q-side-link>
          -->
    <q-item-separator />
    <!--
         <q-side-link multiline highlight separator item
          :to="{name: 'e', params: { idForm: 'idform'}}"
          :key="mysurvey">
          <q-item-side icon="fa-list" />
          <q-item-main label="My Survey"  />
        </q-side-link>

        <q-side-link multiline highlight separator item
          :to="{name: 'f', params: { idForm: 'idform'}}"
          :key="mysummary">
          <q-item-side icon="fa-line-chart" />
          <q-item-main label="My Summary"  />
        </q-side-link>

        <q-side-link multiline highlight separator item
          :to="{name: 'g', params: { idForm: 'idform'}}"
          :key="editprofile">
          <q-item-side icon="fa-pencil" />
          <q-item-main label="Edit your profile"  />
        </q-side-link>
          -->
    <q-item @click="handleLogout" style="cursor: pointer">
      <q-item-side icon="ion-log-out" />
      <q-item-main :label="$t('Logout')" />
    </q-item>

      <div class="light text-italic" style="padding-left: 65px;">
      {{userEmail()}}
    </div>
    <p>

    <div class="fixed-bottom text-center light text-italic">
      v {{fastVersion}}
    </div>
  </q-scroll-area>
</template>

<style>
    .layout-aside-left {opacity: 0.9; background:#03405f !important;}
    .layout-aside-left .q-list-header center {font-size: 1.6em; font-weight: 400; padding-top: 5px;}

    .q-item-icon {font-size: 26px;}

    .q-list-header {font-size: 2vh !important; font-weight: normal;}
    .q-list-header button {float: left; top: 10px;}
    .q-list-header button .q-icon {font-size: 27px; padding-right: 3px;}

</style>






<script>
import Localization from "modules/Localization/Localization";
import { mapState, mapActions } from "vuex";
import Auth from "modules/Auth/api/Auth";
import Form from "database/models/Form";
import {
  QScrollArea,
  QSideLink,
  QItemTile,
  QItemSide,
  QItemMain,
  QListHeader,
  QCollapsible,
  QBtn,
  QIcon,
  QTooltip,
  QList,
  QItem,
  QItemSeparator
} from "quasar";
import layoutStore from "./layout-store";
import { FAST_VERSION, APP_FANTACY_NAME, HAS_ABOUT } from "config/env";
export default {
  components: {
    QScrollArea,
    QSideLink,
    QItemTile,
    QItemSide,
    QItemMain,
    QListHeader,
    QCollapsible,
    QBtn,
    QIcon,
    QTooltip,
    QList,
    QItem,
    QItemSeparator
  },
  mounted: async function() {
    Form.local().sAll(this, "forms");
  },
  data() {
    return {
      forms: [],
      subscriptions: [],
      layoutStore,
      fastVersion: FAST_VERSION,
      appName: APP_FANTACY_NAME,
      HAS_ABOUT: HAS_ABOUT
    };
  },
  computed: {
    ...mapState({
      User: state => state.authStore.authUser
    }),
    isOnline() {
      return this.$root.VueOnline;
    }
  },
  methods: {
    ...mapActions(["getResources"]),
    closeDrawer() {
      this.$refs.leftDrawer.close();
    },
    async syncApp() {
      this.$eventHub.$emit("openLeftDrawer");

      this.$swal({
        title: "Updating...",
        text: this.$t(
          "Wait until the App is Updated. This can take a couple minutes..."
        ),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();

          await Localization.getTranslations();

          await this.getResources({
            appName: this.$store.state.authStore.appName
          });
          this.$swal.close();
          this.$swal({
            title: this.$t("App Updated"),
            text: this.$t(
              "You need to reload the page to see the changes. Want to do it now?"
            ),
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonClass: "modalCancel",
            confirmButtonText: this.$t("Yes, reaload it!"),
            cancelButtonText: this.$t("No, Later")
          }).then(async () => {
            window.location.reload(true);
          });
        }
      });
    },
    handleLogout() {
      this.$eventHub.$emit("openLeftDrawer");
      this.$store.dispatch("clearAuthUser");
      Auth.logOut();
    },
    isAdmin() {
      return Auth.hasRole("Administrator");
    },
    userEmail() {
      return Auth.userEmail();
    }
  }
};
</script>
