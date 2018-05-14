// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`);
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================
var pjson = require('../package.json');
console.log('v.' + pjson.version);
// Uncomment the following lines if you need IE11/Edge support
require(`quasar/dist/quasar.ie`);
require(`quasar/dist/quasar.ie.${__THEME}.css`);

import Vue from 'vue';
import Quasar from 'quasar';
Vue.use(Quasar); // Install Quasar Framework

// import Raven from 'config/raven'
// Raven.set(Vue)

import router from 'config/router';
import store from 'config/store';
import axios from 'config/axios';

import VueSweetAlert from 'vue-sweetalert';
Vue.use(VueSweetAlert);

import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
import EventHub from 'vue-event-hub';
Vue.use(EventHub);
/* eslint-disable */
import 'quasar-extras/material-icons';
import 'quasar-extras/ionicons';
import 'quasar-extras/fontawesome';
// import 'quasar-extras/animate'

import AsyncComputed from 'vue-async-computed';
Vue.use(AsyncComputed);

import VueAsyncProperties from 'vue-async-properties';
Vue.use(VueAsyncProperties);

import Moment from 'libraries/fastjs/repositories/Date/moment';
Moment.setLocales();

import FASTConfig from 'libraries/fastjs/config';
import FAST from 'libraries/fastjs/start';

import { CONFIG_URL, APP_CONFIG_ID } from 'config/env';
FASTConfig.set({ baseURL: CONFIG_URL, submissionId: APP_CONFIG_ID });

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font');
}

/**
 *  On App start
 */
Quasar.start(async () => {
  try {
    let config = await FAST.start({ Vue: Vue, interval: true });
    // Set the translations into the Plugin
    const i18n = new VueI18n({
      locale: config.defaultLenguage, // set locale
      messages: config.translations // set locale messages
    });
    /* eslint-disable no-new */
    new Vue({
      i18n,
      el: '#q-app',
      router,
      store,
      render: (h) => h(require('./App'))
    });
  } catch (error) {
    console.log(error);
    alert(
      'The application cannot Start. You must be connected to internet to start the App for the first time'
    );
  }
});
