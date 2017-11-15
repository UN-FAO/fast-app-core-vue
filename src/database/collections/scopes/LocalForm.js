import * as Database from 'database/Database'

const LocalForm = class {
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection("forms")
  }
  /**
   * [get description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  static async get(id) {
    const model = await LocalForm.getModel()
    id = id.replace(/\s/g, '')

    let formRequest = await model.findOne({
      'data.name': id
    })
    let formRequestID = await model.findOne({
      'data._id': id
    })
    let formRequestPath = await model.findOne({
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
    const model = await LocalForm.getModel()
    let allForms = await model.find()
    return allForms
  }
}
export default LocalForm
