<template>

    <q-toolbar class="bg-primary">
    <q-ajax-bar color="#80cbc4"></q-ajax-bar>
      <q-btn flat @click="openLeftDrawer()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
       <img src="statics/2000px-FAO_logo_reverse.png" style="max-height: 40px; max-width: 40px;"></img>  {{ $t("App.title") }}
      <span slot="subtitle">Proof of Concept for FAST</span>
      </q-toolbar-title>
      <localization/>
      <wifiDisplay/>
      <q-btn flat @click="openRightDrawer()">
        <q-icon name="menu" />
      </q-btn>
    </q-toolbar>
</template>
<script>
import Localization from 'modules/Localization/components/selector'
import wifiDisplay from 'modules/Connection/components/display'
import {QToolbar, QToolbarTitle, QAjaxBar, QBtn, QIcon} from 'quasar'
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
  methods: {
    openLeftDrawer () {
      this.$eventHub.$emit('openLeftDrawer')
    },
    openRightDrawer () {
      this.$eventHub.$emit('openRightDrawer')
    }
  }
}
</script>
