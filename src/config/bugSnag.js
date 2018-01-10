import {
  APP_FANTACY_NAME,
  FAST_VERSION
} from './env'
const bugsnag = require('bugsnag-js')
const bugsnagClient = bugsnag({
  apiKey: 'fd087cdd50c49e4c091c4f32294967d1',
  appVersion: FAST_VERSION,
  autoCaptureSessions: true
})
import Auth from 'modules/Auth/api/Auth'
bugsnagClient.metaData = {
  FAST: {
    name: APP_FANTACY_NAME,
    version: FAST_VERSION
  }
}

bugsnagClient.user = {
  email: Auth.userEmail()
}

export default bugsnagClient
