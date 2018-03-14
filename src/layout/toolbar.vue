<template>
<div>
  <q-toolbar style="-webkit-app-region: drag; -webkit-user-select: none;" v-bind:class="isInsideApp ? 'nav-default-fao' : 'nav-transparent' ">
    <q-ajax-bar color="white"></q-ajax-bar>
    <q-btn flat @click="openLeftDrawer()" v-if="isInsideApp"
      v-bind:class="isInsideApp ? '' : 'color-white' " class="absolute-left" style="z-index:999">
      <q-icon name="menu" />
    </q-btn>
    <q-toolbar-title @click="$router.push({name: 'dashboard'})" style="cursor: pointer;"  v-bind:class="isInsideApp ? '' : 'color-white' ">

    </q-toolbar-title>
  <div class="q-toolbar-fao-logo">
    <img src="statics/fao-logo-white.svg" style="max-height: 40px;" class="absolute-center" />
  </div>

  <localization/>
  <wifiDisplay/>


  </q-toolbar>

</div>
</template>
<script>
import Localization from "modules/Localization/components/selector";
import wifiDisplay from "modules/Connection/components/display";
import { QToolbar, QToolbarTitle, QAjaxBar, QBtn, QIcon } from "quasar";
import Auth from "modules/Auth/api/Auth";
import { mapMutations } from "vuex";
export default {
  components: {
    Localization,
    QToolbar,
    QToolbarTitle,
    QAjaxBar,
    QBtn,
    QIcon,
    wifiDisplay
  },
  computed: {
    isInsideApp() {
      return (
        this.$route.name !== "login" &&
        this.$route.name !== "register" &&
        this.$route.name !== "login_redirect" &&
        this.$route.name !== "adminLogin"
      );
    }
  },
  methods: {
    ...mapMutations(["setLayoutNeeded", "setIsLoginPage"]),
    userEmail() {
        return Auth.userEmail()
    },
    openLeftDrawer() {
      this.$eventHub.$emit("openLeftDrawer");
    },
    openRightDrawer() {
      this.$eventHub.$emit("openRightDrawer");
    },
    handleLogout() {
      this.$store.dispatch("clearAuthUser");
      Auth.logOut();
    }
  }
};
</script>
