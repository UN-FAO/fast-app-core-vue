import {
  APP_FANTACY_NAME,
  FAST_VERSION
} from './env'
import Raven from 'raven-js';
import Auth from 'modules/Auth/api/Auth'
import RavenVue from 'raven-js/plugins/vue';

let ravenClient = {};

const Rav = class {
  static set(Vue) {
    ravenClient = Raven
      .config('https://d323daae5b4d4ecb836e7a640115011a@sentry.io/270179', {
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
