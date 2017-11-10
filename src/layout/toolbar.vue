<template>

    <q-toolbar style="-webkit-app-region: drag; -webkit-user-select: none; background-color: white; border-bottom: 1px solid #80808042;">
    <q-ajax-bar color="#80cbc4"></q-ajax-bar>
      <q-btn flat @click="openLeftDrawer()" v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  " style="color: #0e6da5">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title style="color: #0e6da5">
       {{ appName }}
      </q-toolbar-title>
      <div v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
      {{userEmail}}
     </div>
      <localization/>
      <wifiDisplay/>
      
      <q-btn flat @click="openRightDrawer()" v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  " style="color: #0e6da5">
        <q-icon name="menu" />
      </q-btn>
    <!--
    <q-btn flat @click="handleLogout()" v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
        <q-icon name="ion-log-out" />
    </q-btn>
  -->

    </q-toolbar>
</template>
<script>
import Localization from 'modules/Localization/components/selector'
import wifiDisplay from 'modules/Connection/components/display'
import {QToolbar, QToolbarTitle, QAjaxBar, QBtn, QIcon} from 'quasar'
import Auth from 'modules/Auth/api/Auth'
import {mapMutations} from 'vuex'
import {APP_FANTACY_NAME} from 'config/env'
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
    userEmail () {
      return this.User ? this.User.data.email : ''
    }
  },
  data () {
    return {
      User: Auth.user(),
      appName: APP_FANTACY_NAME
    }
  },
  methods: {
    ...mapMutations(['setLayoutNeeded', 'setIsLoginPage']),
    openLeftDrawer () {
      this.$eventHub.$emit('openLeftDrawer')
    },
    openRightDrawer () {
      this.$eventHub.$emit('openRightDrawer')
    },
    handleLogout () {
      this.$store.dispatch('clearAuthUser')
      Auth.logOut()
    }
  }
}
</script>
