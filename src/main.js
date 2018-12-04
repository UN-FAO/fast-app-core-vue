import 'babel-polyfill';
import { FAST_CONFIG_URL, FLUENT_FORMIO_BASEURL } from 'config/env';
import TRANSLATIONS from 'config/Localization/appTranslations';

let appConf = {
  type: 'remote',
  appConfigUrl: FAST_CONFIG_URL,
  i18n: TRANSLATIONS,
  fluentFormioBaseUrl: FLUENT_FORMIO_BASEURL,
  offlineFiles: {
    Configuration: require('src/config/offline/Configuration.json'),
    Roles: require('src/config/offline/Roles.json'),
    lastUpdated: require('src/config/offline/lastUpdate.json'),
    Translations: require('src/config/offline/Translations.json'),
    Pages: require('src/config/offline/Pages.json'),
    Forms: require('src/config/offline/Forms.json')
  }
};

// require('offline-plugin/runtime').install();
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

import router from 'config/router';
import store from 'config/store';

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

import VueAsyncProperties from 'vue-async-properties';
Vue.use(VueAsyncProperties);

import { Moment, FAST } from 'fast-fastjs';
import 'moment/min/locales';
Moment.setLocales();

Vue.config.productionTip = false;
Vue.prototype.$appConf = appConf;
Vue.prototype.$appVersion = pjson.version;

Vue.prototype.$isInsideApp = (route) => {
  return (
    route.name !== 'login' &&
    route.name !== 'register' &&
    route.name !== 'login_redirect' &&
    route.name !== 'adminLogin' &&
    route.name !== 'sendreset'
  );
};

Vue.prototype.$getDirection = () => {
  let direction = document.getElementsByClassName('layout background-app')[0]
    .dir;
  if (direction === 'ltr') {
    return 'pull-left';
  }
  return 'pull-right';
};

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font');
}

/**
 *  On App start
 */
Quasar.start(async () => {
  let config = await FAST.start({ appConf });
  Vue.prototype.$FAST_CONFIG = config.config;
  // Set the translations into the Plugin
  const i18n = new VueI18n({
    locale: localStorage.getItem('defaultLenguage') || 'en', // set locale
    messages: config.translations, // set locale messages,
    silentTranslationWarn: true
  });
  /* eslint-disable no-new */
  new Vue({
    i18n,
    el: '#q-app',
    router,
    store,
    render: (h) => h(require('./App'))
  });
});
