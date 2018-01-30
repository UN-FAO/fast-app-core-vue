import baseModel from './baseModel'

const Form = class extends baseModel {
  /**
 * [get description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
  static async get(id) {
    id = id.replace(/\s/g, '')

    let formRequest = await this.findOne({
      'data.name': id
    })
    let formRequestID = await this.findOne({
      'data._id': id
    })
    let formRequestPath = await this.findOne({
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
    let allForms = await this.find()
    return allForms
  }
}
export default Form
