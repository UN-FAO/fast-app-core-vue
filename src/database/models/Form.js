import * as Database from 'database/Database';
import uuidv4 from 'uuid/v4'

const Form = class {
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  static getOwnName() {
    return 'Form'
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  static remote() {
    Form.getFrom = 'remote'
    return Form
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  static local() {
    Form.getFrom = 'local'
    return Form
  }
  /**
   * [getModel description]
   * @return {[type]} [description]
   */
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection(Form.getOwnName())
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async find(filter) {
    const model = await Form.getModel()
    return model.find(filter);
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async findOne(filter) {
    const model = await Form.getModel()
    return model.findOne(filter);
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async remove(document) {
    const model = await Form.getModel()
    return model.remove(document);
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  static async insert(element) {
    const model = await Form.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async update(document) {
    const model = await Form.getModel()
    return model.update(document);
  }

  static async updateOrCreate(document) {
    const model = await Form.getModel()
    let role = await model.findOne(document)
    if (!role) {
      model.insert(document)
    }
  }

  static async findAndRemove(filter) {
    const model = await Form.getModel()
    return model.findAndRemove(filter);
  }
  /**
 * [get description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
  static async get(id) {
    id = id.replace(/\s/g, '')

    let formRequest = await Form.findOne({
      'data.name': id
    })
    let formRequestID = await Form.findOne({
      'data._id': id
    })
    let formRequestPath = await Form.findOne({
      'data.path': id
    })

    if (formRequest) {
      return formRequest.data
    }
    if (formRequestID) {
      return formRequestID.data
    }
    if (formRequestPath) {
      return formRequestPath.data
    }
  }

  static async sAll() {
    let allForms = await Form.find()
    return allForms
  }
}
export default Form
