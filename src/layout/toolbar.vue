<template>

    <q-toolbar style="-webkit-app-region: drag; -webkit-user-select: none; background-color: white">
    <q-ajax-bar color="#80cbc4"></q-ajax-bar>
      <q-btn flat @click="openLeftDrawer()" v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
       {{ $t("App.title") }}
      </q-toolbar-title>
      <div v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
      {{userEmail}}
     </div>
      <localization/>
      <wifiDisplay/>
      
      <q-btn flat @click="openRightDrawer()" v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
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
      User: Auth.user()
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
