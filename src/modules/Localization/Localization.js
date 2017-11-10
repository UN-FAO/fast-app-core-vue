import Formio from 'modules/Formio/api/Formio'
import store from 'config/store'
import _ from 'lodash'
import messages from 'i18n/translations'
import * as Database from 'database/Database'
const Localization = class {
  /**
   * [authenticate description]
   * @param  {[type]} username [description]
   * @param  {[type]} password [description]
   * @return {[type]}          [description]
   */
  static async setLocales () {
     let appTranslations = []

      const DB = await Database.get()

      let localTranslations = await DB.translations.find().exec()

      if (localTranslations.length > 0 && localTranslations[0].data) {
        appTranslations = localTranslations[0].data
      } else {
        appTranslations = Localization.getTranslations()
      }
      return appTranslations
  }

  /**
   * [setTranslations description]
   * @param {[type]} appTranslations [description]
   */
  static async getTranslations () {
      const DB = await Database.get()
      let localTranslations = await DB.translations.find().exec()
      let appTranslations = []

      if (navigator.onLine) {
        try {
             // Fetch the Translation that are online
          let translations = await Localization.getTranslation()
          // Foreach of the local lenguages, set the 
          _.forEach(messages, (lenguage, lenguageCode) => {
            lenguage.translations = {}
            _.forEach(translations, (translation, index) => {
              if (translation.data[lenguageCode]) {
                lenguage.translations[translation.data.en] = translation.data[lenguageCode]
              }
            })
          })
          if (localTranslations[0] && localTranslations[0].data) {
            await localTranslations[0].update({
              $set: {
                data: messages
              }
            })
            appTranslations = localTranslations[0].data
          } else if (localTranslations.length === 0) {
            appTranslations = await DB.translations.insert({
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
  static async getTranslation () {
    return Formio.getTranslations(store.getters.getMachineUrl)
  }
}
export default Localization
