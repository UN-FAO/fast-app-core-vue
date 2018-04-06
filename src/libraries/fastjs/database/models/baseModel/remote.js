import Formio from 'formiojs'
import config from "../../../config";
import Auth from 'libraries/fastjs/repositories/Auth/Auth'
import to from 'await-to-js';

const remoteModel = (() => {
  /* eslint-disable no-unused-vars */
  async function getFormioInstance({ formPath, submissionID = undefined }) {
    let formUrl
    if (Auth.user().x_jwt_token) {
      Formio.setToken(Auth.user().x_jwt_token);
    }
    // Get the base URL
    switch (formPath) {
      case 'custom':
        formUrl = await config.get().baseURL
          break;
      case undefined:
        formUrl = await config.get().url
        Formio.setToken('');
        break;
      default:
        formUrl = await config.get().baseURL
        formUrl = formUrl + "/" + formPath;
        break;
    }

    Formio.clearCache();
    // Set URL in case of submission context
    formUrl = submissionID ? formUrl + 'submission/' + submissionID : formUrl
    return new Formio(formUrl);
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  async function find({ formPath, filter = undefined, limit = 30, select = undefined, pagination }) {
    let remoteSubmissions, error
    let formio = await getFormioInstance({ formPath: formPath })

    let queryParams = {
      limit: limit
    }

    if (filter) {
      let filterQuery = filterToString(filter)
      queryParams = { ...queryParams, ...filterQuery }
    }

    if (select) {
      let selectQuery = selectToString(select)
      queryParams = { ...queryParams, ...selectQuery }
    }

    [error, remoteSubmissions] = await to(formio.loadSubmissions({
      params: queryParams
    }));
    if (error) { let e = "The API call to " + formPath + " could not be completed, server responded with " + JSON.stringify(error); throw new Error(e) }

    return remoteSubmissions
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  async function findOne({ formPath, filter }) {
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  async function remove({ formPath, document }) {
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  async function insert({ formPath, element }) {
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  async function update({ formPath, document }) {
  }

  async function updateOrCreate({ formPath, document }) {
  }

  async function findAndRemove({ formPath, filter }) {
  }

  function filterToString(filter) {
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

  function selectToString(select) {
    if (!select) {
      return
    }
    let selectString = select.reduce((reducer, column) => {
      reducer = reducer + "," + column;
      return reducer;
    }, "_id,owner,modified");
    return { select: selectString }
  }

  return Object.freeze({
    find,
    findOne,
    remove,
    insert,
    update,
    updateOrCreate,
    findAndRemove,
    getFormioInstance
  });
})()
export default remoteModel
