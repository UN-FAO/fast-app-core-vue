import Connection from 'modules/Wrappers/Connection'
import Pages from 'libraries/fastjs/database/models/Pages'
import _isEmpty from "lodash/isEmpty"
import _get from "lodash/get"

let PAGES = (() => {
  async function set() {
    if (Connection.isOnline()) {
      let newPages = await Pages.remote().find({limit: 500})
      newPages = _get(newPages, '[0].data', undefined)

      let pages = await Pages.local().find()
      if (newPages && pages.length > 0) {
        await Pages.remove(pages[0])
      }
      let insertPages = newPages || pages[0]

      if (insertPages && typeof insertPages !== 'undefined' && !_isEmpty(insertPages)) {
        await Pages.local().insert(insertPages)
      }
      return insertPages
    }
  }

  async function getLocal(submission) {
    let pages = await Pages.local().find()
    return _get(pages, '[0]', {})
  }

  return Object.freeze({
    set,
    getLocal
  });
})()
export default PAGES
