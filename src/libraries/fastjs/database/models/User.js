import * as Database from '../Database';
import uuidv4 from 'uuid/v4'
import RemoteUser from 'libraries/fastjs/repositories/User/User'

const User = class {
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  static getOwnName() {
    return 'User'
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  static remote() {
    User.getFrom = 'remote'
    return RemoteUser
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  static local() {
    User.getFrom = 'local'
    return User
  }
  /**
   * [getModel description]
   * @return {[type]} [description]
   */
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection(User.getOwnName())
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async find(filter) {
    const model = await User.getModel()
    return model.find(filter);
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async findOne(filter) {
    const model = await User.getModel()
    return model.findOne(filter);
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async remove(document) {
    const model = await User.getModel()
    return model.remove(document);
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  static async insert(element) {
    const model = await User.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async update(document) {
    const model = await User.getModel()
    return model.update(document);
  }

  static async updateOrCreate(document) {
    const model = await User.getModel()
    let role = await model.findOne(document)
    if (!role) {
      model.insert(document)
    }
  }

  static async findAndRemove(filter) {
    const model = await User.getModel()
    return model.findAndRemove(filter);
  }
}
export default User
