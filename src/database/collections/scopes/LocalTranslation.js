import * as Database from 'database/Database'
import _forEach from 'lodash/forEach'

const LocalTranslation = class {
  /**
   * [get description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  static async getFormTranslations () {
  	const DB = await Database.get()
    let formTranslations = {i18n: {}}
    let localTranslations = await DB.translations.findOne().exec()
    localTranslations = localTranslations.data

    _forEach(localTranslations, (lenguage, index) => {
        if (index !== 'type') {
          formTranslations.i18n[index] = lenguage ? lenguage.translations : {}
        }
    })

    return formTranslations
  }
}
export default LocalTranslation
