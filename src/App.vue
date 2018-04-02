<template>
  <q-layout ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
    v-bind:class="isInsideApp ? 'background-app' : 'background-login'"
    :dir="ltr ? 'ltr' : 'rtl' "
    >
    <toolbar slot="header"></toolbar>
    <template v-if="isInsideApp">
      <leftdrawer slot="left"></leftdrawer>
      <rightdrawer slot="right"></rightdrawer>
</template>
  <connection-alert></connection-alert>
    <router-view :key="$route.path" v-bind:class="isInsideApp ? 'background-app' : 'background-login' "/>
  </q-layout>
</template>

<script>
/* eslint no-use-before-define: 0 */
// import 'bootstrap-rtl-ondemand/dist/css/bootstrap-rtl.min.css'
import toolbar from "layout/toolbar";
import leftdrawer from "layout/left_drawer";
import rightdrawer from "layout/right_drawer";
import connectionAlert from "modules/Connection/components/alert";
import { mapActions } from "vuex";
import Sync from "libraries/fastjs/repositories/Database/Sync";
import Connection from "modules/Wrappers/Connection";
import { QLayout, Toast, Platform } from "quasar";
import layoutStore from "layout/layout-store";
import FastClick from "fastclick";

export default {
  name: "app",
  mounted() {
    window.addEventListener(
      "load",
      function() {
        FastClick(document.body);
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
          return console.log(error)
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

    this.$eventHub.on("FAST-DATA_SYNCED", data => {
      if (data.count === 0) {
        Toast.create.negative({
          html: "SYNC SUBMISSION ERROR"
        });
      } else {
        Toast.create.positive({
          html: data.count + " SUBMISSION(s) SYNCED"
        });
      }
    });

    Connection.initEventListeners(this);
    this.setSyncInterval();
  },
  methods: {
    ...mapActions(["sendOfflineData"]),
    toggleRtl: function(lenguage) {
      this.ltr = lenguage.direction === "ltr";
    },
    /**
     * [setSyncInterval description]
     */
    setSyncInterval: function() {
      let rInterval = function(callback, delay) {
        let dateNow = Date.now,
          requestAnimation = window.requestAnimationFrame,
          start = dateNow(),
          stop,
          intervalFunc = function() {
            // eslint-disable-next-line no-use-before-define
            dateNow() - start < delay || ((start += delay), callback());
            // eslint-disable-next-line no-use-before-define
            stop || requestAnimation(intervalFunc);
          };
        requestAnimation(intervalFunc);
        return {
          clear: function() {
            stop = 1;
          }
        };
      };
      rInterval(() => {
        return Sync.now(this);
      }, 2000);
    }
  },
  data() {
    return {
      backgroundColor: "whitesmoke",
      timeout: {},
      ltr: true,
      layoutStore,
      backgroundStyle: "height: inherit;"
    };
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
