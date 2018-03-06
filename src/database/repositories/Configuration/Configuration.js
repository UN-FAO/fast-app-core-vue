import _clone from 'lodash/clone'
import FORMIO from 'modules/Formio/api/Formio'
import Connection from 'modules/Wrappers/Connection'
import CONFIGURATION from 'database/models/Configuration'
let Configuration = class {
  static async get(APP_CONFIG_ID) {
    const isOnline = Connection.isOnline()
    if (isOnline) {
      let configuration = await CONFIGURATION.local().find()
      let previousConfig = configuration.length > 0 ? _clone(configuration[0]) : {}
      if (configuration.length > 0) {
        await CONFIGURATION.remove(configuration[0])
      }
      let removeConfiguration = await FORMIO.getConfiguration(APP_CONFIG_ID)
      removeConfiguration = removeConfiguration.data ? removeConfiguration.data : previousConfig
      let localConfig = await CONFIGURATION.local().insert(removeConfiguration)
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
