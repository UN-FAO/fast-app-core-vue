import * as Database from 'database/Database';
import uuidv4 from 'uuid/v4'

const baseModel = class {
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  static getOwnName() {
    return 'baseModel'
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  static remote() {
    baseModel.getFrom = 'remote'
    return baseModel
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  static local() {
    baseModel.getFrom = 'local'
    return baseModel
  }
  /**
   * [getModel description]
   * @return {[type]} [description]
   */
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection(baseModel.getOwnName())
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async find(filter) {
    const model = await baseModel.getModel()
    return model.find(filter);
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async findOne(filter) {
    const model = await baseModel.getModel()
    return model.findOne(filter);
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async remove(document) {
    const model = await baseModel.getModel()
    return model.remove(document);
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  static async insert(element) {
    const model = await baseModel.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async update(document) {
    const model = await baseModel.getModel()
    return model.update(document);
  }

  static async updateOrCreate(document) {
    const model = await baseModel.getModel()
    let role = await model.findOne(document)
    if (!role) {
      model.insert(document)
    }
  }

  static async findAndRemove(filter) {
    const model = await baseModel.getModel()
    return model.findAndRemove(filter);
  }
}
export default baseModel
