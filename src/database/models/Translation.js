import _forEach from 'lodash/forEach';
import _orderBy from "lodash/orderBy";
import _find from 'lodash/find'
import * as Database from 'database/Database';
import uuidv4 from 'uuid/v4'


const Translation = class {
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  static getOwnName() {
    return 'Translation'
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  static remote() {
    Translation.getFrom = 'remote'
    return Translation
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  static local() {
    Translation.getFrom = 'local'
    return Translation
  }
  /**
   * [getModel description]
   * @return {[type]} [description]
   */
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection(Translation.getOwnName())
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async find(filter) {
    const model = await Translation.getModel()
    return model.find(filter);
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async findOne(filter) {
    const model = await Translation.getModel()
    return model.findOne(filter);
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async remove(document) {
    const model = await Translation.getModel()
    return model.remove(document);
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  static async insert(element) {
    const model = await Translation.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async update(document) {
    const model = await Translation.getModel()
    return model.update(document);
  }

  static async updateOrCreate(document) {
    const model = await Translation.getModel()
    let role = await model.findOne(document)
    if (!role) {
      model.insert(document)
    }
  }

  static async findAndRemove(filter) {
    const model = await Translation.getModel()
    return model.findAndRemove(filter);
  }
  /**
   *
   */
  static async getFormTranslations() {
    let formTranslations = {
      i18n: {}
    }

    let localTranslations = await Translation.findOne()

    localTranslations = localTranslations && localTranslations.data ? localTranslations.data : {}

    _forEach(localTranslations, (lenguage, index) => {
      if (index !== 'type') {
        formTranslations.i18n[index] = lenguage
      }
    })

    return formTranslations
  }
  /**
   *
   */
  static async supportedLanguages() {
    let translations = await Translation.find();

    if (translations.length === 0) {
      return []
    }

    let isoLanguages = Translation.getIsoLanguages()
    let languages = []
    _forEach(translations[0].data, (language, code) => {
      let iso = _find(isoLanguages, {
        'code': code
      });

      if (iso) {
        languages.push(iso)
      }
    })
    languages = _orderBy(languages, ['label'], ['asc']);
    return languages
  }
  /**
   *
   */
  static getIsoLanguages() {
    let languages = require("database/resources/isoLanguages.json");
    return languages
  }
}
export default Translation
