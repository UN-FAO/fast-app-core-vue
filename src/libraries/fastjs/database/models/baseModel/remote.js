import Formio from 'formiojs'
import config from "../../../config";

const remoteModel = (() => {
  /* eslint-disable no-unused-vars */
  async function getFormioInstance({ formPath, submissionID = undefined }) {
    // Get the base URL
    let formUrl = formPath ? await config.get().baseURL : await config.get().url
    console.log('formUrformUrlformUrlformUrll', formUrl, formPath)
    if (config.get().jwt) {
      Formio.setToken(config.get().jwt);
    }
    Formio.clearCache();
    // Get ID of the Form
    formUrl = formUrl + "/" + formPath;
    // Set URL in case of submission context
    formUrl = submissionID ? formUrl + 'submission/' + submissionID : formUrl
    return new Formio(formUrl);
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  async function find({ formPath, filter, limit, select, pagination }) {
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

    let remoteSubmissions = await formio.loadSubmissions({
      params: queryParams
    });

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
    }, "_id");
    return { select: selectString }
  }

  return Object.freeze({
    find,
    findOne,
    remove,
    insert,
    update,
    updateOrCreate,
    findAndRemove
  });
})()
export default remoteModel
