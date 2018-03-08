import FORMIO from 'modules/Formio/api/Formio'
import Connection from 'modules/Wrappers/Connection'
import Pages from 'database/models/Pages'
import CONFIGURATION from 'database/repositories/Configuration/Configuration'

let PAGES = class {
  static async get() {
    const isOnline = Connection.isOnline()
    if (isOnline) {
      let config = await CONFIGURATION.getLocal();
      let newPages = await FORMIO.getPages(config.APP_URL + '/fast-app-pages/submission?limit=500')
      newPages = newPages[0] && newPages[0].data ? newPages[0].data : null
      console.log('newPages', newPages)
      let pages = await Pages.local().find()
      if (newPages && pages.length > 0) {
        await Pages.remove(pages[0])
      }
      let insertPages = newPages || pages[0]
      console.log('insertPages', insertPages)
      let localPages = await Pages.local().insert(insertPages)
      return localPages
    }
  }

  static async getLocal(submission) {
    let pages = await Pages.local().find()
    if (pages.length > 0) {
      return pages[0]
    }
    return {}
  }
}
export default PAGES
