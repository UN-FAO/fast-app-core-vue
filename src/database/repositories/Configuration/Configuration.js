import _clone from 'lodash/clone'
import FORMIO from 'modules/Formio/api/Formio'
import Connection from 'modules/Wrappers/Connection'
import CONFIGURATION from 'database/models/Configuration'
import { CONFIG_URL, APP_CONFIG_ID } from 'config/env'

let Configuration = class {
  static async get(Vm) {
    const isOnline = Connection.isOnline()
    if (isOnline) {
      let configuration = await CONFIGURATION.local().find()
      let previousConfig = configuration.length > 0 ? _clone(configuration[0]) : {}
      if (configuration.length > 0) {
        await CONFIGURATION.remove(configuration[0])
      }
      let removeConfiguration = await FORMIO.getConfiguration(CONFIG_URL, APP_CONFIG_ID)
      removeConfiguration = removeConfiguration.data ? removeConfiguration.data : previousConfig
      let localConfig = await CONFIGURATION.local().insert(removeConfiguration)
      if (Vm.prototype) {
        Vm.prototype.$FAST_CONFIG = localConfig
      } else {
        Vm.$FAST_CONFIG = localConfig
      }
      return localConfig
    }
  }

  static async getLocal(submission) {
    let configuration = await CONFIGURATION.local().find()
    if (configuration.length > 0) {
      return configuration[0]
    }
    return {}
  }
}
export default Configuration
