import * as Database from '../Database';
import uuidv4 from 'uuid/v4'


const Role = class {
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  static getOwnName() {
    return 'Role'
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  static remote() {
    Role.getFrom = 'remote'
    return Role
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  static local() {
    Role.getFrom = 'local'
    return Role
  }
  /**
   * [getModel description]
   * @return {[type]} [description]
   */
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection(Role.getOwnName())
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async find(filter) {
    const model = await Role.getModel()
    return model.find(filter);
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async findOne(filter) {
    const model = await Role.getModel()
    return model.findOne(filter);
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async remove(document) {
    const model = await Role.getModel()
    return model.remove(document);
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  static async insert(element) {
    const model = await Role.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async update(document) {
    const model = await Role.getModel()
    return model.update(document);
  }

  static async updateOrCreate(document) {
    const model = await Role.getModel()
    let role = await model.findOne(document)
    if (!role) {
      model.insert(document)
    }
  }

  static async findAndRemove(filter) {
    const model = await Role.getModel()
    return model.findAndRemove(filter);
  }
}
export default Role
