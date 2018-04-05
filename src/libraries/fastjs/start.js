import to from 'await-to-js';
import fastConfig from "libraries/fastjs/config";
import Form from 'libraries/fastjs/repositories/Form/RemoteForms'
import Pages from "libraries/fastjs/repositories/Configuration/Pages";
import SyncInterval from "libraries/fastjs/repositories/Database/SyncInterval";
import Localization from 'libraries/fastjs/repositories/Localization/Localization'
import Configuration from "libraries/fastjs/repositories/Configuration/Configuration";
/* eslint-disable no-unused-vars */
let App = (() => {
  async function start({Vue, interval = true}) {
    let pages, err;

    let config = await Configuration.set(Vue);
    fastConfig.setBaseUrl(config.APP_URL);

    [err, pages] = await to(Pages.set());
    if (err) { let e = 'The pages could not be retrieve from source'; console.log(e, err) }
    let appTranslations = await Localization.setLocales()

    await Form.update();

    if (interval) {
      SyncInterval.set(2000)
    }
    return {
      translations: appTranslations,
      pages: pages,
      defaultLenguage: localStorage.getItem('defaultLenguage') || 'en',
      config: config
    }
  }

  return Object.freeze({
    start
  });
})()
export default App
