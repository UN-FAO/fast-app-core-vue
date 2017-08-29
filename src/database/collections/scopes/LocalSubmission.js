import * as Database from 'database/Database'

const LocalSubmission = class {
  /**
   * [get description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  static async get (id) {
  	let db = await Database.get()
  	id = id.replace(/\s/g, '')
 	return db.submissions.findOne()
      .where('data._id').eq(id).exec()
  }
}
export default LocalSubmission
