<template>
  <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
  >
  <toolbar slot="header"></toolbar>
  <template v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
    <leftdrawer slot="left"></leftdrawer>
    <rightdrawer slot="right"></rightdrawer>
  </template>
  <connection-alert></connection-alert>
    <router-view :key="$route.path" />
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
import { sync } from "database/Database";
import Connection from "modules/Wrappers/Connection";
import { SYNC_INTERVAL } from "config/env";
import { QLayout, Toast } from "quasar";
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
      Toast.create.positive({ html: data.count + " SUBMISSION(s) SYNCED" });
    });

    Connection.initEventListeners(this);
    this.setSyncInterval();
  },
  methods: {
    ...mapActions(["sendOfflineData"]),
    toggleRtl: function(lenguageDirecction) {
      this.ltr = lenguageDirecction === "ltr";
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
        return sync(this);
      }, SYNC_INTERVAL);
    }
  },
  data() {
    return {
      backgroundColor: "whitesmoke",
      timeout: {},
      ltr: true,
      layoutStore
    };
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
<style>
@import url("../node_modules/bootstrap/dist/css/bootstrap.min.css");
@import url("../node_modules/formiojs/dist/formio.full.min.css");
@import url("./assets/css/main.css");
</style>
