import Connection from 'modules/Wrappers/Connection'
import CONFIGURATION from 'libraries/fastjs/database/models/Configuration'
import { APP_CONFIG_ID } from 'config/env'
import _get from "lodash/get"

let Configuration = (() => {
  async function set(VUE) {
    let localConfig, remoteConfig

    localConfig = await CONFIGURATION.local().find()
    localConfig = _get(localConfig, '[0]', undefined)

    if (Connection.isOnline()) {
      try {
        remoteConfig = await CONFIGURATION.remote().find({
          filter: [
            { element: '_id', query: "=", value: APP_CONFIG_ID }
          ],
          limit: 1
        })
      } catch (error) {
        console.log('error', error)
      }
    }
    remoteConfig = _get(remoteConfig, '[0].data', undefined)

    if (!localConfig && !remoteConfig) {
      console.log('Cannot start app. You need to be connected to internet')
      throw new Error('Application is not connected to internet, or the configuration file cannot be pulled')
    }

    if (remoteConfig) {
      if (localConfig) {
        await CONFIGURATION.local().remove(localConfig)
      }
      let insertedConfig = await CONFIGURATION.local().insert(remoteConfig)
      // Create Global Vue variable
      if (VUE && VUE.prototype) {
        VUE.prototype.$FAST_CONFIG = insertedConfig
      } else {
        VUE.$FAST_CONFIG = insertedConfig
      }
      return insertedConfig
    } else {
      return localConfig
    }
  }

  async function getLocal() {
    let configuration = await CONFIGURATION.local().find()
    return _get(configuration, '[0]', {})
  }

  return Object.freeze({
    set,
    getLocal
  });
})()
export default Configuration
