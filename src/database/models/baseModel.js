import * as Database from 'database/Database';
import uuidv4 from 'uuid/v4'

const baseModel = class {
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  static getOwnName() {
    return this.name
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  static remote() {
    this.getFrom = 'remote'
    return this
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  static local() {
    this.getFrom = 'local'
    return this
  }
  /**
   * [getModel description]
   * @return {[type]} [description]
   */
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection(this.getOwnName())
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async find(filter) {
    const model = await this.getModel()
    return model.find(filter);
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async findOne(filter) {
    const model = await this.getModel()
    return model.findOne(filter);
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async remove(document) {
    const model = await this.getModel()
    return model.remove(document);
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  static async insert(element) {
    const model = await this.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async update(document) {
    const model = await this.getModel()
    return model.update(document);
  }

  static async updateOrCreate(document) {
    const model = await this.getModel()
    let role = await model.findOne(document)
    if (!role) {
      model.insert(document)
    }
  }
}
export default baseModel
