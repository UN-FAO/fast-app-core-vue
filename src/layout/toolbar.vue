<template>
<div>
  <q-toolbar
    style="-webkit-app-region: drag; -webkit-user-select: none;"
    v-bind:class="$isInsideApp($route) ? 'nav-default-fao' : 'nav-transparent' "
  >

    <q-ajax-bar color="white"></q-ajax-bar>

    <q-btn
      v-if="$isInsideApp($route)"
      @click="openLeftDrawer()"
      color="white"
      flat
      style="z-index:999"
    >
      <q-icon name="menu" color="white" />
    </q-btn>

    <q-toolbar-title/>

    <faologo/>

    <localization/>

    <wifiDisplay/>

  </q-toolbar>

</div>
</template>
<script>
import Localization from 'modules/Localization/components/selector';
import wifiDisplay from 'components/Connection/components/display';
import faologo from 'components/faologo';
import { QToolbar, QToolbarTitle, QAjaxBar, QBtn, QIcon } from 'quasar';
import { Auth } from 'fast-fastjs';
export default {
  components: {
    faologo,
    Localization,
    QToolbar,
    QToolbarTitle,
    QAjaxBar,
    QBtn,
    QIcon,
    wifiDisplay
  },
  methods: {
    openLeftDrawer() {
      this.$eventHub.$emit('openLeftDrawer');
    },
    openRightDrawer() {
      this.$eventHub.$emit('openRightDrawer');
    },
    handleLogout() {
      Auth.logOut();
    }
  }
};
</script>
