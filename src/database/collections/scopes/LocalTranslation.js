import * as Database from 'database/Database'
import _ from 'lodash'

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
    console.log('localTranslations => ', localTranslations)
    _.forEach(localTranslations, (lenguage, index) => {
        console.log(lenguage, index)
        if (index !== 'type') {
          formTranslations.i18n[index] = lenguage ? lenguage.translations : {}
        }
    })
     console.log('formTranslations => ', formTranslations)
    return formTranslations
  }
}
export default LocalTranslation
