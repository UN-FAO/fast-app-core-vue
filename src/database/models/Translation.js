import baseModel from './baseModel'
import _forEach from 'lodash/forEach';
import _orderBy from "lodash/orderBy";
import _find from 'lodash/find'

const Translation = class extends baseModel {
  /**
   *
   */
  static async getFormTranslations() {
    let formTranslations = {
      i18n: {}
    }

    let localTranslations = await this.findOne()

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
    let translations = await this.find();

    if (translations.length === 0) {
      return []
    }

    let isoLanguages = this.getIsoLanguages()
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
