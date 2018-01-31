import Formio from 'formiojs'
import _debounce from 'lodash/debounce'
import Form from 'database/models/Form'
import StoreForm from './StoreForm'

const PostRequest = class {
  /**
   *
   * @param {*} args
   */
  static async handle(args, redirect, hashField, formId, eventHub) {
    if (args.type === 'submission') {
      return PostRequest.handleSubmission(args, redirect, hashField, formId, eventHub)
    }
  }
  /**
   *
   */
  static async handleSubmission(args, redirect, hashField, formId, eventHub) {
    let formio = await PostRequest.getFormioInstance(args)
    let submission = args.data
    if (args.data && !args.data.trigger) {
      let formSubmission = {
        data: args.data.data,
        redirect: false,
        draft: false,
        trigger: 'resourceCreation'
      }
      submission = formSubmission
    }
    let dStoreForm = _debounce(StoreForm.handle, 1000)
    dStoreForm(submission, formio, redirect, hashField, formId, eventHub)
    return args.data
  }
  /**
   *
   * @param {*} args
   */
  static async getFormioInstance(args) {
    let form = await Form.local().get(args.formio.formId)
    let formioPath = 'https://' + form.machineName.split(':')[0] + '.form.io/' + form.path
    let formio = new Formio(formioPath)
    return formio
  }
}
export default PostRequest
