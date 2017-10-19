<template>
  <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
  >
  <template v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
    <toolbar slot="header"></toolbar>
    <leftdrawer slot="left"></leftdrawer>
    <rigthdrawer slot="right"></rigthdrawer>
  </template> 
    <router-view :key="$route.path" />
  </q-layout>
</template>
<script>
/* eslint no-use-before-define: 0 */
import 'bootstrap/dist/css/bootstrap.css'
import 'formiojs/dist/formio.full.min.css'
import 'bootstrap-rtl-ondemand/dist/css/bootstrap-rtl.min.css'
import toolbar from 'layout/toolbar'
import leftdrawer from 'layout/left_drawer'
import rigthdrawer from 'layout/right_drawer'
/*
import contentHeader from 'layout/content-header.vue'
*/
import {mapActions} from 'vuex'
import {sync} from 'database/Database'
import Connection from 'modules/Wrappers/Connection'
import { SYNC_INTERVAL } from 'config/env'
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QSearch,
  QTabs,
  QRouteTab,
  QBtn,
  QIcon,
  QItemSide,
  QItemMain,
  QSideLink,
  QListHeader,
  QScrollArea
} from 'quasar'
import layoutStore from 'layout/layout-store'

export default {
  name: 'app',
  mounted () {
    this.getResources({
      appName: this.$store.state.authStore.appName
    })
    this.$eventHub.on('lenguageSelection', (lenguage) => {
      this.toggleRtl(lenguage)
    })
    this.$eventHub.on('connectionStatusChanged', (status) => {
      this.$store.dispatch('changeIsOnlineStatus', status)
    })

    this.$eventHub.$on('openLeftDrawer', () => {
      this.$refs.layout.toggleLeft()
    })

    this.$eventHub.$on('openRightDrawer', () => {
      this.$refs.layout.toggleRight()
    })

    Connection.initEventListeners(this)
    this.setSyncInterval()
  },
  methods: {
    ...mapActions(['sendOfflineData', 'getResources']),
    toggleRtl: function (lenguageDirecction) {
      this.ltr = lenguageDirecction === 'ltr'
    },
    /**
       * [setSyncInterval description]
       */
    setSyncInterval: function () {
      let rInterval = function (callback, delay) {
        let dateNow = Date.now,
          requestAnimation = window.requestAnimationFrame,
          start = dateNow(),
          stop,
          intervalFunc = function () {
            // eslint-disable-next-line no-use-before-define
            dateNow() - start < delay || (start += delay, callback())
            // eslint-disable-next-line no-use-before-define
            stop || requestAnimation(intervalFunc)
          }
        requestAnimation(intervalFunc)
        return {
          clear: function () {
            stop = 1
          }
        }
      }

      rInterval(() => sync(this), SYNC_INTERVAL)
    }
  },
  data () {
    return {
      backgroundColor: 'whitesmoke',
      timeout: {},
      ltr: true,
      layoutStore
    }
  },
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QSearch,
    QTabs,
    QRouteTab,
    QBtn,
    QIcon,
    QItemSide,
    QItemMain,
    QSideLink,
    QListHeader,
    QScrollArea,
    toolbar,
    leftdrawer,
    rigthdrawer
  }
}
</script>

<style>

</style>
