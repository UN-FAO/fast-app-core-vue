import * as Database from 'database/Database'
import _forEach from 'lodash/forEach'
import uuidv4 from 'uuid/v4'

const LocalTranslation = class {
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection("translations")
  }

  static async find(filter) {
    const model = await LocalTranslation.getModel()
    return model.find(filter);
  }

  static async insert(element) {
    const model = await LocalTranslation.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }

  static async update(document) {
    const model = await LocalTranslation.getModel()
    return model.update(document);
  }

  static async remove(document) {
    const model = await LocalTranslation.getModel()
    return model.remove(document);
  }

  static async getFormTranslations() {
    const model = await LocalTranslation.getModel()
    let formTranslations = {
      i18n: {}
    }
    let localTranslations = await model.findOne()
    localTranslations = localTranslations.data

    _forEach(localTranslations, (lenguage, index) => {
      if (index !== 'type') {
        formTranslations.i18n[index] = lenguage
      }
    })

    return formTranslations
  }
}
export default LocalTranslation
