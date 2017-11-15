import * as Database from 'database/Database'
import uuidv4 from 'uuid/v4'

const LocalUser = class {
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection("users")
  }

  static async find(filter) {
    const model = await LocalUser.getModel()
    return model.find(filter);
  }

  static async findOne(filter) {
    const model = await LocalUser.getModel()
    return model.findOne(filter);
  }

  static async update(document) {
    const model = await LocalUser.getModel()
    return model.update(document);
  }

  static async insert(element) {
    const model = await LocalUser.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }
}
export default LocalUser
