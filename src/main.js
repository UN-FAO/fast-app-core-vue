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
import VueEvents from 'vue-events'
import Vuetify from 'vuetify'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import DataTables from 'vue-data-tables'
import VueSweetAlert from 'vue-sweetalert'
import VueI18n from 'vue-i18n'
import Formio from 'modules/Formio/api/Formio'
import _ from 'lodash'
import EventHub from 'vue-event-hub'
import AsyncComputed from 'vue-async-computed'
import * as Database from 'database/Database'
import messages from './i18n/translations'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
// import Auth from 'modules/Auth/api/Auth'

Vue.use(VueSweetAlert)
Vue.use(ElementUI)
Vue.use(DataTables)
Vue.use(Vuetify)
Vue.use(VueEvents)
Vue.use(VueI18n)
Vue.use(EventHub)
Vue.use(AsyncComputed)

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework
Vue.prototype.$http = axios

let getTranslation = async function () {
  return Formio.getTranslations(store.getters.getMachineUrl)
}

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

  const DB = await Database.get()

  let localTranslations = await DB.translations.find().exec()

  if (localTranslations.length > 0 && localTranslations[0].data) {
    appTranslations = localTranslations[0].data
  }

  if (navigator.onLine) {
    try {
         // Fetch the Translation that are online
      let translations = await getTranslation()
      // Foreach of the local lenguages, set the 
      _.forEach(messages, (lenguage, lenguageCode) => {
        lenguage.translations = {}
        _.forEach(translations, (translation, index) => {
          if (translation.data[lenguageCode]) {
            lenguage.translations[translation.data.en] = translation.data[lenguageCode]
          }
        })
      })
      if (localTranslations[0] && localTranslations[0].data) {
        await localTranslations[0].update({
          $set: {
            data: messages
          }
        })
        appTranslations = localTranslations[0].data
      } else if (localTranslations.length === 0) {
        appTranslations = await DB.translations.insert({
          data: messages
        })
        appTranslations = appTranslations.data
      }
    } catch (error) {
      console.log('Error while getting translations')
    }
  }
  console.log(appTranslations)
  const i18n = new VueI18n({
    locale: 'en', // set locale
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
