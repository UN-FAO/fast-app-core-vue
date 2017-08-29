import * as Database from 'database/Database'

const LocalForm = class {
  /**
   * [get description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  static async get (id) {
  	id = id.replace(/\s/g, '')
  	let db = await Database.get()
 	let formRequest = await db.forms.findOne().where('data._id').eq(id).exec()
 	return formRequest.data
  }
}
export default LocalForm
