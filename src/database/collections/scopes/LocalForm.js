import * as Database from 'database/Database'
import uuidv4 from 'uuid/v4'
import FormioUtils from "formiojs/utils";
import _forEach from 'lodash/forEach'

const LocalForm = class {
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection("forms")
  }

  static async find(filter) {
    const model = await LocalForm.getModel()
    return model.find(filter);
  }

  static async findOne(filter) {
    const model = await LocalForm.getModel()
    return model.findOne(filter);
  }

  static async remove(document) {
    const model = await LocalForm.getModel()
    return model.remove(document);
  }

  static async insert(element) {
    const model = await LocalForm.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }

  static async update(document) {
    const model = await LocalForm.getModel()
    return model.update(document);
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

  static async getAllLabels() {
    let forms = await LocalForm.find();
    let labels = []
    _forEach(forms, form => {
      FormioUtils.eachComponent(form.data.components, (component) => {
        if (component.label) {
          labels.push(component.label)
        }
        if (component.values) {
          _forEach(component.values, value => {
            if (value.label) {
              labels.push(value.label)
            }
          })
        }

        if (component.type === 'htmlelement') {
          labels.push(component.content)
        }

        if (component.type === 'select') {
          if (component.data && component.data.values) {
            _forEach(component.data.values, value => {
              if (value.label) {
                labels.push(value.label)
              }
            })
          }
        }
      });
    })
    let totalLabels = Array.from(new Set(labels)).sort();
    let labelsArray = []
    _forEach(totalLabels, uniqueLabel => {
      let translation = []
      translation.push(uniqueLabel)

      labelsArray.push(translation)
    })
    return labelsArray;
  }
}
export default LocalForm
