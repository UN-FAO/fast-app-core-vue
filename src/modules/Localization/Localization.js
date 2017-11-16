import Formio from 'modules/Formio/api/Formio'
import store from 'config/store'
import _ from 'lodash'
import messages from 'i18n/translations'
import localTranslation from 'database/collections/scopes/LocalTranslation'

const Localization = class {
  /**
   * [authenticate description]
   * @param  {[type]} username [description]
   * @param  {[type]} password [description]
   * @return {[type]}          [description]
   */
  static async setLocales() {
    let appTranslations = []

    let localTranslations = await localTranslation.find()

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
    let localTranslations = await localTranslation.find()
    let appTranslations = []

    if (navigator.onLine) {
      try {
        // Fetch the Translation that are online
        let translations = await Localization.getOnlineTranslation()

        // Foreach of the locale lenguages, set the translations
        _.forEach(messages, (lenguage, lenguageCode) => {
          lenguage.translations = {}
          _.forEach(translations, (translation, index) => {
            if (translation.data[lenguageCode]) {
              lenguage.translations[translation.data.en] = translation.data[lenguageCode]
            }
          })
        })

        // If we already had translations, then update them
        if (localTranslations.length > 0) {
          localTranslations[0].update({
            data: messages
          })
          appTranslations = localTranslations[0].data
        } else if (localTranslations.length === 0) {
          appTranslations = await localTranslation.insert({
            data: messages
          })
          appTranslations = appTranslations.data
        }
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
}
export default Localization
