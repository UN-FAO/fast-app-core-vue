<template>
<div>
  <q-layout ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
    class='background-app'
    :dir="ltr ? 'ltr' : 'rtl' "
    v-if="!isLogin"
    >
    <toolbar slot="header"></toolbar>
    <template >
      <leftdrawer slot="left"></leftdrawer>
      <rightdrawer slot="right"></rightdrawer>
  </template>
  <connection-alert></connection-alert>
    <router-view :key="$route.path" class="background-app"/>
  </q-layout>

  <q-layout ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
    :dir="ltr ? 'ltr' : 'rtl' "
    v-else
    >
    <toolbar slot="header"></toolbar>
    <router-view :key="$route.path"/>
  </q-layout>
</div>
</template>

<script>
/* eslint no-use-before-define: 0 */
// import 'bootstrap-rtl-ondemand/dist/css/bootstrap-rtl.min.css'
import toolbar from 'layout/toolbar';
import leftdrawer from 'layout/left_drawer';
import rightdrawer from 'layout/right_drawer';
import connectionAlert from 'modules/Connection/components/alert';
import { QLayout, Toast, Platform } from 'quasar';
import layoutStore from 'layout/layout-store';
import FastClick from 'fastclick';
import { FAST, Event, Connection } from 'fast-fastjs';

export default {
  name: 'app',
  async mounted() {
    await FAST.loadRemainingConfig({ interval: true });
    Event.listen({
      name: 'FAST:APPLICATION:LOADED',
      callback: this.handleLoadedApp
    });
    window.addEventListener(
      'load',
      function() {
        if (document) {
          FastClick(document.body);
        }
      },
      false
    );

    let emailValidationMessage = (email) => {
      this.$swal(
        'Email already taken',
        "The email '" + email + "' is already taken. Try a different one.",
        'error'
      );
    };

    if (Platform.is.cordova) {
      window.plugins.launchmyapp.getLastIntent(
        function(url) {
          if (url.indexOf('fastapp://' > -1)) {
            alert('received url: ' + url);
          }
        },
        function(error) {
          return console.log(error);
        }
      );
    }

    document.addEventListener('FAST:USER:REGISTRATION:ERROR', (error) => {
      emailValidationMessage(error.detail.data.submission.email);
    });

    this.$eventHub.on('FAST:USER:REGISTRATION:ERROR', (error) => {
      emailValidationMessage(error.email);
    });

    this.$eventHub.on('lenguageSelection', (lenguage) => {
      this.toggleRtl(lenguage);
    });

    this.$eventHub.on('connectionStatusChanged', (status) => {
      this.$store.dispatch('changeIsOnlineStatus', status);
    });

    this.$eventHub.$on('openLeftDrawer', () => {
      this.$refs.layout.toggleLeft();
    });

    this.$eventHub.$on('openRightDrawer', () => {
      this.$refs.layout.toggleRight();
    });
    Connection.initEventListeners();
  },
  methods: {
    toggleRtl: function(lenguage) {
      this.ltr = lenguage.direction === 'ltr';
    }
  },
  data() {
    return {
      ltr: true,
      layoutStore,
      appLoaded: window.$APP_LOADED
    };
  },
  computed: {
    isLogin() {
      return (
        this.$route.name === 'login' ||
        this.$route.name === 'register' ||
        this.$route.path === '/'
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
@import url('../node_modules/bootstrap/dist/css/bootstrap.min.css');
@import url('../node_modules/formiojs/dist/formio.full.min.css');
@import url('./assets/css/main.scss');
</style>
