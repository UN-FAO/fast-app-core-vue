import * as Database from 'database/Database'

const LocalForm = class {
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection("roles")
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
    return model.insert(element);
  }

  static async update(document) {
    const model = await LocalForm.getModel()
    return model.update(document);
  }

  static async updateOrCreate(document) {
    const model = await LocalForm.getModel()
    let role = await model.findOne(document)
    if (!role) {
      model.insert(document)
    }
  }
}
export default LocalForm
