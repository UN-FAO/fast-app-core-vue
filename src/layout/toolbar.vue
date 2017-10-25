<template>

    <q-toolbar class="bg-primary">
    <q-ajax-bar color="#80cbc4"></q-ajax-bar>
      <q-btn flat @click="openLeftDrawer()" v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
       <img src="statics/2000px-FAO_logo_reverse.png" style="max-height: 40px; max-width: 40px;"></img>  {{ $t("App.title") }}
      <span slot="subtitle">Self-evaluation and Holistic Assessment of climate resilence of Farmers and Pastoralists</span>
      </q-toolbar-title>
      {{User ? User.data.email : '' }}
      <localization/>
      <wifiDisplay/>
      
      <q-btn flat @click="openRightDrawer()" v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
        <q-icon name="menu" />
      </q-btn>
    
    <q-btn flat @click="handleLogout()" v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'login_redirect'  ">
        <q-icon name="ion-log-out" />
    </q-btn>

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
