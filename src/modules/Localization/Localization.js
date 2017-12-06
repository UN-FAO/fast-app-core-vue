import Formio from 'modules/Formio/api/Formio'
import store from 'config/store'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
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
        _forEach(messages, (lenguage, lenguageCode) => {
          delete lenguage.App
          lenguage.translations = {}
          _forEach(translations, (translation, index) => {
            if (translation.data[lenguageCode]) {
              lenguage.translations[translation.data.en] = translation.data[lenguageCode]
            }
          })
        })

        _map(messages, (lenguage, lenguageCode) => {
          messages[lenguageCode] = lenguage.translations
          delete lenguage.App
        })

        // If we already had translations, then update them
        if (localTranslations.length > 0) {
          localTranslations[0].data = messages
          localTranslation.update(localTranslations[0])
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

  /**
   * [getTranslation description]
   * @return {[type]} [description]
   */
  static async createTranslation(label) {
    console.log(label)
    return Formio.createTranslation(store.getters.getMachineUrl, label)
  }
}
export default Localization
