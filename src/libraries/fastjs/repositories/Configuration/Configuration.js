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
        throw new Error(error)
      }
    }
    remoteConfig = _get(remoteConfig, '[0].data', undefined)

    if (!localConfig && !remoteConfig) {
      throw new Error('Application is not connected to internet, or the configuration file cannot be pulled')
    }

    if (!remoteConfig) {
      assingGlobalVariable(VUE, localConfig)
      return localConfig
    }

    if (localConfig) {
      await CONFIGURATION.local().remove(localConfig)
    }
    let insertedConfig = await CONFIGURATION.local().insert(remoteConfig)
    // Create Global Vue variable
    assingGlobalVariable(VUE, insertedConfig)
    return insertedConfig
  }
  /* eslint-disable no-unused-vars */
  function assingGlobalVariable(VUE, configuration) {
    if (VUE && VUE.prototype) {
      VUE.prototype.$FAST_CONFIG = configuration
    } else if (VUE) {
      VUE.$FAST_CONFIG = configuration
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
