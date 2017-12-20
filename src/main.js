// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
require(`quasar/dist/quasar.ie`)
require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
Vue.use(Quasar) // Install Quasar Framework

import router from 'config/router'
import store from 'config/store'
import axios from 'config/axios'

import {
  Table,
  TableColumn,
  Pagination,
  Tag,
  Button
} from 'element-ui';

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Tag)
Vue.use(Button)

import DataTables from 'vue-data-tables'
Vue.use(DataTables)

import VueSweetAlert from 'vue-sweetalert'
Vue.use(VueSweetAlert)

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
import EventHub from 'vue-event-hub'
Vue.use(EventHub)

import 'quasar-extras/material-icons'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

import Localization from 'modules/Localization/Localization'

import VueAsyncProperties from 'vue-async-properties'
Vue.use(VueAsyncProperties)

Vue.config.productionTip = false

Vue.prototype.$http = axios

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}

Quasar.start(async() => {
  /* eslint-disable no-new */
  let appTranslations = []
  appTranslations = await Localization.setLocales()
  let defaultLenguage = localStorage.getItem('defaultLenguage') ? localStorage.getItem('defaultLenguage') : 'en'

  // console.log(appTranslations)
  const i18n = new VueI18n({
    locale: defaultLenguage, // set locale
    messages: appTranslations // set locale messages
  })
  /* eslint-disable no-new */
  new Vue({
    i18n,
    el: '#q-app',
    router,
    store,
    render: h => h(require('./App'))
  })
})
