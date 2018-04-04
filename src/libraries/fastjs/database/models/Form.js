import moment from 'moment'
import _orderBy from "lodash/orderBy"
import baseModel from './baseModelFactory'
import remoteModel from './baseModel/remote'
import Connection from 'libraries/fastjs/Wrappers/Connection'
let Form = (args) => {
  var baseModel = args.baseModel;
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  /* eslint-disable no-unused-vars */
  function getOwnName() {
    return 'Form'
  }

  function getFormPath() {
    return 'custom'
  }

  async function customFind() {
    let formio = await remoteModel.getFormioInstance({ formPath: 'custom' })
    let remoteForms = Connection.isOnline() ? await formio.loadForms({
      params: {
        limit: '200'
      }
    }) : []
    return remoteForms
  }

  async function get(id) {
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

  async function sAll() {
    let allForms = await Form.find()
    return allForms
  }

  async function cardFormattedForms(action) {
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

  return Object.freeze(Object.assign({}, baseModel, {
    getOwnName,
    getFormPath,
    sAll,
    get,
    cardFormattedForms,
    customFind
  }));
}
Form = Form({
  baseModel: baseModel()
});
export default Form
