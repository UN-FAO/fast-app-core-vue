import * as Database from 'database/Database';
import uuidv4 from 'uuid/v4'

const Configuration = class {
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  static getOwnName() {
    return 'Configuration'
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  static remote() {
    Configuration.getFrom = 'remote'
    return Configuration
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  static local() {
    Configuration.getFrom = 'local'
    return Configuration
  }
  /**
   * [getModel description]
   * @return {[type]} [description]
   */
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection(Configuration.getOwnName())
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async find(filter) {
    const model = await Configuration.getModel()
    return model.find(filter);
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async findOne(filter) {
    const model = await Configuration.getModel()
    return model.findOne(filter);
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async remove(document) {
    const model = await Configuration.getModel()
    return model.remove(document);
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  static async insert(element) {
    const model = await Configuration.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async update(document) {
    const model = await Configuration.getModel()
    return model.update(document);
  }

  static async updateOrCreate(document) {
    const model = await Configuration.getModel()
    let role = await model.findOne(document)
    if (!role) {
      model.insert(document)
    }
  }

  static async findAndRemove(filter) {
    const model = await Configuration.getModel()
    return model.findAndRemove(filter);
  }
}
export default Configuration
