<template>
  <q-layout ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
    v-bind:class="!isLogin ? 'background-app' : 'background-login'"
    :dir="ltr ? 'ltr' : 'rtl' "
    >
    <toolbar slot="header"></toolbar>
    <template v-if="!isLogin">
      <leftdrawer slot="left"></leftdrawer>
      <rightdrawer slot="right"></rightdrawer>
  </template>
  <connection-alert></connection-alert>
    <router-view :key="$route.path" v-bind:class="!isLogin ? 'background-app' : 'background-login' "/>
  </q-layout>
</template>

<script>
/* eslint no-use-before-define: 0 */
// import 'bootstrap-rtl-ondemand/dist/css/bootstrap-rtl.min.css'
import toolbar from "layout/toolbar";
import leftdrawer from "layout/left_drawer";
import rightdrawer from "layout/right_drawer";
import connectionAlert from "modules/Connection/components/alert";
import Connection from "libraries/fastjs/Wrappers/Connection";
import { QLayout, Toast, Platform } from "quasar";
import layoutStore from "layout/layout-store";
import FastClick from "fastclick";
import FAST from "libraries/fastjs/start";
import Event from "libraries/fastjs/Wrappers/Event";

export default {
  name: "app",
  mounted() {
    FAST.loadRemainingConfig({ Vue: this, interval: true });
    Event.listen({
      name: "FAST:APPLICATION:LOADED",
      callback: this.handleLoadedApp
    });
    window.addEventListener(
      "load",
      function() {
        if (document) {
          FastClick(document.body);
        }
      },
      false
    );

    let emailValidationMessage = email => {
      this.$swal(
        "Email already taken",
        "The email '" + email + "' is already taken. Try a different one.",
        "error"
      );
    };

    if (Platform.is.cordova) {
      window.plugins.launchmyapp.getLastIntent(
        function(url) {
          if (url.indexOf("fastapp://" > -1)) {
            alert("received url: " + url);
          }
        },
        function(error) {
          return console.log(error);
        }
      );
    }

    document.addEventListener("FAST:USER:REGISTRATION:ERROR", error => {
      emailValidationMessage(error.detail.data.submission.email);
    });

    this.$eventHub.on("FAST:USER:REGISTRATION:ERROR", error => {
      emailValidationMessage(error.email);
    });

    this.$eventHub.on("lenguageSelection", lenguage => {
      this.toggleRtl(lenguage);
    });

    this.$eventHub.on("connectionStatusChanged", status => {
      this.$store.dispatch("changeIsOnlineStatus", status);
    });

    this.$eventHub.$on("openLeftDrawer", () => {
      this.$refs.layout.toggleLeft();
    });

    this.$eventHub.$on("openRightDrawer", () => {
      this.$refs.layout.toggleRight();
    });
    Connection.initEventListeners();
  },
  methods: {
    toggleRtl: function(lenguage) {
      this.ltr = lenguage.direction === "ltr";
    },
    handleLoadedApp() {
      this.appLoaded = this.$APP_LOADED
    }
  },
  data() {
    return {
      ltr: true,
      layoutStore,
      appLoaded: this.$APP_LOADED
    };
  },
  computed: {
    isLogin() {
      return (
        this.$route.name === "login" ||
        this.$route.name === "register" ||
        this.$route.name === "login_redirect"
      );
    }
  },
  components: {
    leftdrawer,
    rightdrawer,
    connectionAlert,
    toolbar,
    QLayout,
    Toast
  }
};
</script>

<style lang="scss">
@import url("../node_modules/bootstrap/dist/css/bootstrap.min.css");
@import url("../node_modules/formiojs/dist/formio.full.min.css");
@import url("./assets/css/main.scss");
</style>
