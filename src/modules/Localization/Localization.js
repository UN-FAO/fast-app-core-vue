import Formio from 'modules/Formio/api/Formio'
import store from 'config/store'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
// import messages from 'i18n/translations'
import Translation from 'database/models/Translation'

const Localization = class {
  /**
   * [authenticate description]
   * @param  {[type]} username [description]
   * @param  {[type]} password [description]
   * @return {[type]}          [description]
   */
  static async setLocales() {
    let appTranslations = []

    let localTranslations = await Translation.local().find()

    if (localTranslations.length > 0 && localTranslations[0].data) {
      appTranslations = localTranslations[0].data
    } else {
      appTranslations = await Localization.getTranslations()
    }

    return appTranslations
  }

  /**
   * [setTranslations description]
   * @param {[type]} appTranslations [description]
   */
  static async getTranslations() {
    let appTranslations = []

    if (navigator.onLine) {
      try {
        // Fetch the Translation that are online
        let onlineTranslations = await Localization.getOnlineTranslation()
        let lenguages = Translation.local().getIsoLanguages()
        let localTranslations = {}
        localTranslations.label = {}
        // Foreach of the locale lenguages, set the translations
        _forEach(lenguages, (language) => {
          _forEach(onlineTranslations, (translation, index) => {
            if (translation.data && translation.data[language.code]) {
              if (!localTranslations[language.code]) {
                localTranslations[language.code] = {}
              }
              localTranslations[language.code][translation.data.label] = translation.data[language.code]
            }

            if (translation.data && translation.data.label) {
              localTranslations['label'][translation.data.label] = translation.data.label
            }
          })
        })

        _map(localTranslations, (language, index) => {
          if (!_isEmpty(language.translations)) {
            localTranslations[language.code] = language.translations
          } else {
            delete localTranslations[language.code]
          }
        })

        // Remove all previous translations
        Translation.local().findAndRemove()

        // Insert the new ones
        appTranslations = await Translation.local().insert({
          data: localTranslations
        })

        appTranslations = appTranslations.data

        return appTranslations
      } catch (error) {
        return []
        console.log('Error while getting translations')
      }
    } else {
      return []
    }
  }

  /**
   * [getTranslation description]
   * @return {[type]} [description]
   */
  static async getOnlineTranslation() {
    return Formio.getTranslations(store.getters.getMachineUrl)
  }

  /**
   * [getTranslation description]
   * @return {[type]} [description]
   */
  static async createTranslation(label) {
    return Formio.createTranslation(store.getters.getMachineUrl, label)
  }

  static async setTranslations(label, translations) {
    return Formio.setTranslations(store.getters.getMachineUrl, label, translations)
  }
}
export default Localization
