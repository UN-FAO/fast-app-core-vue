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
import router from 'config/router'
import store from 'config/store'
import axios from 'config/axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import DataTables from 'vue-data-tables'
import VueSweetAlert from 'vue-sweetalert'
import VueI18n from 'vue-i18n'
import EventHub from 'vue-event-hub'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
// import Auth from 'modules/Auth/api/Auth'
import Localization from 'modules/Localization/Localization'
import VueAsyncProperties from 'vue-async-properties'
Vue.use(VueAsyncProperties)
Vue.use(VueSweetAlert)
Vue.use(ElementUI)
Vue.use(DataTables)
Vue.use(VueI18n)
Vue.use(EventHub)

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework
Vue.prototype.$http = axios


if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'
Quasar.start(async () => {
  /* eslint-disable no-new */
  let appTranslations = []
  appTranslations = await Localization.setLocales()
  let defaultLenguage = localStorage.getItem('defaultLenguage') ? localStorage.getItem('defaultLenguage') : 'en'

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
