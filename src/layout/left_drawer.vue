<template>
  <q-scroll-area style="width: 100%; height: 100%">
    <q-list-header class="bg-primary text-white" style="padding-left: 0px; height: 50px; background:#00293c !important;">
      <center>
        <img src="statics/2000px-FAO_logo_reverse.png" style="max-height: 40px; max-width: 40px;" /> {{$FAST_CONFIG.APP_NAME_DRAWER}}
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


      <pageLinks :pages="PAGES" v-if="!$FAST_CONFIG.IS_SURVEY"></pageLinks>

      <collectionpagelinks v-if="$FAST_CONFIG.IS_SURVEY"></collectionpagelinks>


    <q-side-link v-if="isReviewer()" multiline highlight item :to="{path: '/settings/alldata'}" :key="settings">
      <q-item-side icon="fa-cog" />
      <q-item-main :label="$t('Review Data')"/>
    </q-side-link>


    <q-side-link v-if="isAdmin()" multiline highlight item :to="{path: '/settings/alldata'}" :key="settings">
      <q-item-side icon="fa-cog" />
      <q-item-main :label="$t('Application Settings')"/>
    </q-side-link>


    <q-side-link multiline highlight item :to="{name: 'About'}" :key="about" v-if="$FAST_CONFIG.HAS_ABOUT">
      <q-item-side icon="tablet_mac" />
      <q-item-main :label="$t('About') +' '+ $FAST_CONFIG.APP_FANTACY_NAME" />
    </q-side-link>

    <q-item-separator />

    <q-item @click="handleLogout" style="cursor: pointer">
      <q-item-side icon="ion-log-out" />
      <q-item-main :label="$t('Logout')" />
    </q-item>

      <div class="light text-italic" style="padding-left: 65px;">
      {{userEmail()}}
    </div>
    <p>

    <div class="fixed-bottom text-center light text-italic">
      v {{$FAST_CONFIG.FAST_VERSION}}
    </div>
  </q-scroll-area>
</template>

<style>
.layout-aside-left {
  opacity: 0.9;
  background: #03405f !important;
}
.layout-aside-left .q-list-header center {
  font-size: 1.6em;
  font-weight: 400;
  padding-top: 5px;
}

.q-item-icon {
  font-size: 26px;
}

.q-list-header {
  font-size: 2vh !important;
  font-weight: normal;
}
.q-list-header button {
  float: left;
  top: 10px;
}
.q-list-header button .q-icon {
  font-size: 27px;
  padding-right: 3px;
}
</style>
<script>
import Auth from "libraries/fastjs/repositories/Auth/Auth";
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
import pageLinks from "./components/pageLinks";
import collectionpagelinks from "./components/collectionPageLinks";
import Pages from "libraries/fastjs/repositories/Configuration/Pages";
import FAST from "libraries/fastjs/start";
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
    QItemSeparator,
    pageLinks,
    collectionpagelinks
  },
  asyncData: {
    PAGES: {
      async get() {
        let pages = await Pages.getLocal();
        return pages;
      },
      transform(result) {
        return result.pages;
      }
    }
  },
  methods: {
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
          await FAST.sync({ Vue: this, interval: false });
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
    async handleLogout() {
      this.$eventHub.$emit("openLeftDrawer");
      await Auth.logOut();
      this.$router.push({
        path: "/login"
      });
    },
    isAdmin() {
      return Auth.hasRole("Administrator");
    },
    isReviewer() {
      return Auth.hasRole("Reviewer");
    },
    userEmail() {
      return Auth.userEmail();
    }
  }
};
</script>
