import Configuration from 'libraries/fastjs/repositories/Configuration/Configuration';
import Event from 'libraries/fastjs/Wrappers/Event';
import Form from 'libraries/fastjs/repositories/Form/RemoteForms';
import Localization from 'libraries/fastjs/repositories/Localization/Localization';
import Pages from 'libraries/fastjs/repositories/Configuration/Pages';
import SyncInterval from 'libraries/fastjs/repositories/Database/SyncInterval';
import Vue from 'vue';
import fastConfig from 'libraries/fastjs/config';
import to from 'await-to-js';
/* eslint-disable no-unused-vars */
let App = (() => {
  async function loadRemainingConfig({ interval = true }) {
    if (Vue && Vue.prototype) {
      Vue.prototype.$APP_LOADED = false;
    }
    let pages, err;
    [err, pages] = await to(Pages.set());
    if (err) {
      let e = 'The pages could not be retrieve from source';
      console.log(e, err);
    }

    await Form.update();
    if (interval) {
      SyncInterval.set(2000);
    }
    let info = {
      pages: pages,
      defaultLenguage: localStorage.getItem('defaultLenguage') || 'en'
    };
    if (Vue && Vue.prototype) {
      Vue.prototype.$APP_LOADED = true;
    }
    Event.emit({
      name: 'FAST:APPLICATION:LOADED',
      data: info,
      text: 'The application is fully loaded'
    });
    return info;
  }

  async function sync({ interval = true }) {
    let pages, err;

    let config = await Configuration.set(Vue);
    fastConfig.setBaseUrl(config.APP_URL);

    [err, pages] = await to(Pages.set());
    if (err) {
      let e = 'The pages could not be retrieve from source';
      console.log(e, err);
    }
    let appTranslations = await Localization.setLocales();

    await Form.update();

    if (interval) {
      SyncInterval.set(2000);
    }
    return {
      translations: appTranslations,
      pages: pages,
      defaultLenguage: localStorage.getItem('defaultLenguage') || 'en',
      config: config
    };
  }

  async function start({ Vue, interval = true }) {
    let pages, err;

    let config = await Configuration.set(Vue);
    fastConfig.setBaseUrl(config.APP_URL);

    await Form.update({
      filter: [{ element: 'path', query: '=', value: 'userregister' }]
    });
    let appTranslations = await Localization.setLocales();
    return {
      config: config,
      translations: appTranslations,
      defaultLenguage: localStorage.getItem('defaultLenguage') || 'en'
    };
  }

  return Object.freeze({
    start,
    sync,
    loadRemainingConfig
  });
})();
export default App;
