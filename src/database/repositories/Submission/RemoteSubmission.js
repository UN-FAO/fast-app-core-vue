import FormioJS from "formiojs";
import Auth from "modules/Auth/api/Auth";
import Config from "database/repositories/Configuration/Configuration";

let RemoteSubmission = class {
  static async find({ form, filter, limit, select, pagination }) {
    if (!form || !form.path) {
      throw new Error('Form not present. You must provide the full Form.io JSON form to execute the query')
    }
    let formio = await RemoteSubmission.getFormioInstance(form)
    let queryParams = {
      limit: limit
    }

    if (filter) {
      let filterQuery = RemoteSubmission.filterToString(filter)
      queryParams = { ...queryParams, ...filterQuery }
    }

    if (select) {
      let selectQuery = RemoteSubmission.selectToString(select)
      queryParams = { ...queryParams, ...selectQuery }
    }

    let remoteSubmissions = await formio.loadSubmissions({
      params: queryParams
    });
    return remoteSubmissions
  }

  static async save({ form, submission }) {
    FormioJS.deregisterPlugin("offline");
    let formio = await RemoteSubmission.getFormioInstance(form, submission._id)
    return formio.saveSubmission(submission)
  }

  static async getFormioInstance(form, submissionID) {
    FormioJS.setToken(Auth.user().x_jwt_token);
    FormioJS.clearCache();
    // Get the base URL
    let formUrl = await Config.getLocal();
    // Get ID of the Form
    let formString = form && form.path ? form.path : form
    formUrl = formUrl.APP_URL + "/" + formString;
    // Set URL in case of submission context
    formUrl = submissionID ? formUrl + 'submission/' + submissionID : formUrl
    return new FormioJS(formUrl);
  }

  static filterToString(filter) {
    if (!filter) {
      return
    }
    // Condition {element: '_id', query: 'in', value: ''}
    let filterQuery = {}
    filter.forEach(condition => {
      let valueString = ''
      switch (condition.query) {
        case '=':
          filterQuery[condition.element] = condition.value
          break;
        case '!=':
          filterQuery[condition.element + '__ne'] = condition.value
          break;
        case '>':
          filterQuery[condition.element + '__gt'] = condition.value
          break;
        case '>=':
          filterQuery[condition.element + '__gte'] = condition.value
          break;
        case '<':
          filterQuery[condition.element + '__lt'] = condition.value
          break;
        case '<=':
          filterQuery[condition.element + '__lte'] = condition.value
          break;
        case 'in':
          valueString = ''
          condition.value.forEach((value, index, array) => {
            valueString = index === array.length - 1 ? valueString + value : valueString + value + ','
          })
          filterQuery[condition.element + '__in'] = valueString
          break;
        case 'nin':
          valueString = ''
          condition.value.forEach((value, index, array) => {
            valueString = index === array.length - 1 ? valueString + value : valueString + value + ','
          })
          filterQuery[condition.element + '__nin'] = valueString
          break;
        case 'exists':
          filterQuery[condition.element + '__exists'] = true
          break;
        case '!exists':
          filterQuery[condition.element + '__exists'] = false
          break;
        case 'regex':
          filterQuery[condition.element + '__regex'] = condition.value
          break;
      }
    });
    return filterQuery
  }

  static selectToString(select) {
    if (!select) {
      return
    }
    let selectString = select.reduce((reducer, column) => {
      reducer = reducer + "," + column;
      return reducer;
    }, "_id");
    return { select: selectString }
  }
}
export default RemoteSubmission
