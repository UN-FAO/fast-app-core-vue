import * as Database from 'database/Database';
import uuidv4 from 'uuid/v4'
import _orderBy from "lodash/orderBy"
import moment from 'moment'

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

  static async cardFormattedForms(action) {
    let result = await Form.local().sAll();
    result = result.filter(o => {
      return o.data.tags.indexOf("visible") > -1;
    });
    result = _orderBy(result, "data.title", "asc");
    result = result.map(f => {
      return {
        innerCardsTitle: f.data.title,
        innerCardsTags: f.data.tags,
        innerCardsAvatar: action === "create" ? "statics/customSVG/startSurvey.svg" : "statics/customSVG/collectedData.svg",
        innerCardsSubtitle: "Last updated: " + moment(f.data.modified).fromNow(),
        innerCardsActions: [{
          innerCardsActionsText: action === "create" ? 'Start' : 'View data',
          innerCardsActionsTarget: "form",
          innerCardsActionsAction: action,
          innerCardsActionsForm: {
            path: f.data.path
          }
        }
        ]
      }
    });

    result = { innerCards: result }
    return result
  }
}
export default Form
