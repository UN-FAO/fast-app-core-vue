<template>
<div>
  <q-toolbar style="-webkit-app-region: drag; -webkit-user-select: none;" v-bind:class="isInsideApp ? 'nav-default-fao' : 'nav-transparent' ">

    <q-ajax-bar color="white"></q-ajax-bar>

    <q-btn flat @click="openLeftDrawer()" v-if="isInsideApp"
      color="white"  style="z-index:999">
      <q-icon name="menu" color="white" />
    </q-btn>

    <q-toolbar-title/>

    <faologo/>

    <localization/>

    <wifiDisplay/>

  </q-toolbar>

</div>
</template>
<script>
import Localization from "modules/Localization/components/selector";
import wifiDisplay from "modules/Connection/components/display";
import faologo from "components/faologo"
import { QToolbar, QToolbarTitle, QAjaxBar, QBtn, QIcon } from "quasar";
import {Auth} from 'fast-fastjs'
import { mapMutations } from "vuex";
export default {
  components: {
    faologo,
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
    email() {
        return Auth.email()
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
