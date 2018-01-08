<template>
<div>
  <q-toolbar style="-webkit-app-region: drag; -webkit-user-select: none;" v-bind:class="isInsideApp ? 'nav-white' : 'nav-transparent' ">
    <q-ajax-bar color="white"></q-ajax-bar>
    <q-btn flat @click="openLeftDrawer()" v-if="isInsideApp"
      v-bind:class="isInsideApp ? 'color-primary' : 'color-white' ">
      <q-icon name="menu" />
    </q-btn>
    <q-toolbar-title v-bind:class="isInsideApp ? 'color-primary' : 'color-white' ">
      {{ appName }}
    </q-toolbar-title>
    <div v-if="isInsideApp" class="color-primary">
      {{userEmail()}}
    </div>
    <localization/>
    <wifiDisplay/>

    <q-btn flat @click="openRightDrawer()" v-if="isInsideApp" v-bind:class="isInsideApp ? 'color-primary' : 'color-white' ">
      <q-icon name="fa-ellipsis-v" style="margin-left: 30px;" />
    </q-btn>

  </q-toolbar>

</div>
</template>


<style>
.nav-white {
  background: white;
}

.nav-transparent {
  background: transparent;
}

.color-white {
  color: white;
}

.color-primary {
  color: rgb(14, 109, 165);
}
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
