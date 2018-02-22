<template>
<div>
  <q-toolbar style="-webkit-app-region: drag; -webkit-user-select: none;" v-bind:class="isInsideApp ? 'nav-default-fao' : 'nav-transparent' ">
    <q-ajax-bar color="white"></q-ajax-bar>
    <q-btn flat @click="openLeftDrawer()" v-if="isInsideApp"
      v-bind:class="isInsideApp ? '' : 'color-white' ">
      <q-icon name="menu" />
    </q-btn>
    <q-toolbar-title @click="$router.push({name: 'dashboard'})" style="cursor: pointer;"  v-bind:class="isInsideApp ? '' : 'color-white' ">
      {{ appName }}
    </q-toolbar-title>
	<div class="q-toolbar-fao-logo"><img src="statics/2000px-FAO_logo_reverse.png" style="max-height: 40px; max-width: 40px;" /> </div>

    <localization/>
    <wifiDisplay/>


  </q-toolbar>

</div>
</template>


<style>
.nav-white {background: white;}
.nav-default-fao {background:rgb(5, 116, 169); color:#ffffff;}

.nav-transparent {background: transparent;}

.color-white {color: white;}

.color-primary {color: rgb(5, 116, 169);}
    
.q-toolbar-title {font-size: 1.75em; font-weight: 400;}
    
</style>

<script>
import Localization from "modules/Localization/components/selector";
import wifiDisplay from "modules/Connection/components/display";
import { QToolbar, QToolbarTitle, QAjaxBar, QBtn, QIcon } from "quasar";
import Auth from "modules/Auth/api/Auth";
import { mapMutations } from "vuex";
import { APP_FANTACY_NAME } from "config/env";
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
  data() {
    return {
      appName: APP_FANTACY_NAME
    };
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
