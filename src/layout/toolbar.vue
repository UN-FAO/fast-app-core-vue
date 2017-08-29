<template>

    <q-toolbar class="bg-primary">
    <q-ajax-bar color="#80cbc4"></q-ajax-bar>
      <q-btn flat @click="openLeftDrawer()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
       <img src="statics/2000px-FAO_logo_reverse.png" style="max-height: 40px; max-width: 40px;"></img>  {{ $t("App.title") }}
      <span slot="subtitle">Optional subtitle</span>
      </q-toolbar-title>
      <q-btn class="within-iframe-hide" flat @click="$router.replace('/showcase')" style="margin-right: 15px">
        <q-icon name="keyboard_arrow_left" />
        Go back
      </q-btn>
      <localization></localization>
      <q-btn flat @click="openRightDrawer()">
        <q-icon name="menu" />
      </q-btn>
    </q-toolbar>
</template>
<script>
import Localization from 'modules/Localization/components/selector'
import {QToolbar, QToolbarTitle, QAjaxBar, QBtn, QIcon} from 'quasar'
export default {
  components: {
    Localization,
    QToolbar,
    QToolbarTitle,
    QAjaxBar,
    QBtn,
    QIcon
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
