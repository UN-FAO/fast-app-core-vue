import {
  APP_FANTACY_NAME,
  FAST_VERSION,
  APP_ENV
} from './env'
import Raven from 'raven-js';
import Auth from 'libraries/fastjs/repositories/Auth/Auth'
import RavenVue from 'raven-js/plugins/vue';

let ravenClient = {};

const Rav = class {
  static set(Vue) {
    let DNS = APP_ENV === 'dev' ? '' : 'https://d323daae5b4d4ecb836e7a640115011a@sentry.io/270179'
    ravenClient = Raven
      .config(DNS, {
        release: FAST_VERSION,
        logger: APP_FANTACY_NAME
      })
      .addPlugin(RavenVue, Vue)
      .install();

    Raven.setUserContext({
      email: Auth.userEmail()
    })
  }

  static send(e, extra) {
    return ravenClient.captureException(e, {
      extra: extra
    });
  }
}

export default Rav
