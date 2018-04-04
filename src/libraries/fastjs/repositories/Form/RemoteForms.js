import Form from 'libraries/fastjs/database/models/Form'
import _isEmpty from 'lodash/isEmpty'
import Event from 'libraries/fastjs/Wrappers/Event'

let RemoteForms = (() => {
  /**
   *
   */
  async function update() {
    let remoteForms = await Form.remote().find()
    // For every new or updated entry
    remoteForms.forEach(async function (form) {
      let localRes = await Form.local().findOne({
        'data._id': form._id
      })
      // remove local duplicated or updated entries
      if (!_isEmpty(localRes)) {
        localRes.data = form
        await Form.local().update(localRes)
      } else {
        await Form.local().insert({
          data: form
        })
      }
    })

    Event.emit({
      name: 'FAST:FORMS:UPDATED',
      data: remoteForms.length,
      text: 'Forms were updated'
    })
  }
  return Object.freeze({
    update
  });
})()
export default RemoteForms
