import FORMIO from 'modules/Formio/api/Formio'
// import Connection from 'modules/Wrappers/Connection'
import Configuration from "database/repositories/Configuration/Configuration";

let User = class {
  static async find() {
    let config = await Configuration.getLocal()
    let users = await FORMIO.users(config.APP_NAME)
    return users
  }
}
export default User
