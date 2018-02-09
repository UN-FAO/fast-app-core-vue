import _map from 'lodash/map'
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import _uniqBy from 'lodash/uniqBy'
import _get from 'lodash/get'
import Auth from 'modules/Auth/api/Auth'
import * as Database from 'database/Database';
import uuidv4 from 'uuid/v4'
import _cloneDeep from 'lodash/cloneDeep'


const Submission = class {
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  static getOwnName() {
    return 'Submission'
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  static remote() {
    Submission.getFrom = 'remote'
    return Submission
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  static local() {
    Submission.getFrom = 'local'
    return Submission
  }
  /**
   * [getModel description]
   * @return {[type]} [description]
   */
  static async getModel() {
    const DB = await Database.get()
    return DB.getCollection(Submission.getOwnName())
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async find(filter) {
    const model = await Submission.getModel()
    return model.find(filter);
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  static async findOne(filter) {
    const model = await Submission.getModel()
    return model.findOne(filter);
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async remove(document) {
    const model = await Submission.getModel()
    return model.remove(document);
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  static async insert(element) {
    const model = await Submission.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  static async update(document) {
    const model = await Submission.getModel()
    return model.update(document);
  }

  static async updateOrCreate(document) {
    const model = await Submission.getModel()
    let role = await model.findOne(document)
    if (!role) {
      model.insert(document)
    }
  }

  static async findAndRemove(filter) {
    const model = await Submission.getModel()
    return model.findAndRemove(filter);
  }

  static async get(id) {
    id = id.replace(/\s/g, '')
    let offline = await Submission.findOne({
      '_id': id
    })
    let online = await Submission.findOne({
      'data._id': id
    })
    if (online) {
      return online
    }
    if (offline) {
      return offline
    } else {
      return {
        data: false
      }
    }
  }

  static async offline(formId) {
    let filter = await Submission.find({
      'data.user_email': Auth.userEmail(),
      'data.formio.formId': formId
    })
    // updated incomplete submission
    filter = _filter(filter, function (o) {
      return ((o.data.sync === false || o.data.draft === false))
    })
    filter = _orderBy(filter, ['data.created'], ['asc'])
    return filter
  }

  static async stored(formId) {
    return Submission
      .find({
        'data.formio.formId': formId,
        'data.owner': Auth.user()._id
      })
  }

  static async getUnsync() {
    let unsynced = await Submission.find({
      'data.sync': false
    })
    // updated incomplete submission
    unsynced = _filter(unsynced, function (o) {
      return (o.data.sync === false && o.data.draft === false && o.data.user_email === Auth.userEmail() && !o.data.queuedForSync && !o.data.syncError)
    })

    unsynced = _orderBy(unsynced, ['data.created'], ['asc'])
    return unsynced
  }

  static async sFind(vm, filter, pagination) {
    var t0 = performance.now();
    let page = (pagination && pagination.page) || 1
    let limit = (pagination && pagination.limit) || 600
    let paginationInfo = {}
    let local = await Submission.find(filter)

    if (limit > 0) {
      let totalRecords = local.length
      let pages = Math.ceil(totalRecords / limit)
      let firstRecord = (limit * page) - (limit - 1)
      let lastRecord = (limit * page)
      paginationInfo = { total: totalRecords, pages: pages, currentPage: page, limit: limit }
      local = local.slice(firstRecord - 1, lastRecord);
    }
    var t1 = performance.now();
    console.log("Create pagination " + (t1 - t0) / 1000 + " seconds.");
    t0 = performance.now();

    local = _filter(local, function (o) {
      return (
        (o.data.owner && o.data.owner === Auth.user()._id) ||
        (o.data.user_email && o.data.user_email === Auth.userEmail())
      )
    })
    local = _orderBy(local, [
      'created'
    ], [
        'desc'
      ])
    t1 = performance.now();
    console.log("Clone filter and ordering " + (t1 - t0) / 1000 + " seconds.");
    t0 = performance.now();
    let submissions = _map(local, function (submission) {
      let data = submission.data.data
      let formio = submission.data.formio
      submission = _cloneDeep(submission)
      let tableRow = {
        created: submission.meta.created,
        Humancreated: vm.humanizeDate(submission.meta.created),
        HumanUpdated: vm.humanizeDate(submission.meta.updated),
        id_submision: submission.data._id ? submission.data._id : submission._id,
        local: !submission.data._id,
        status: submission.data.sync === false ? 'offline' : 'online',
        draft: submission.data.draft,
        fullSubmission: data,
        formio: formio,
        syncError: submission.data.syncError ? submission.data.syncError : false
      }
      return tableRow
    })
    t1 = performance.now();
    console.log("Map and add new values " + (t1 - t0) / 1000 + " seconds.");
    let paginated = { results: submissions, pagination: paginationInfo }
    return paginated
  }

  static async getParallelParticipants(idForm, idSubmission) {
    let currentSubmission = await Submission.find({
      '_id': idSubmission
    })

    currentSubmission = currentSubmission[0]
    let groupId = _get(currentSubmission, 'data.data.parallelSurvey', undefined)

    groupId = groupId && groupId !== '[object Object]' ? JSON.parse(groupId).groupId : undefined

    let submissions = await Submission.find({
      'data.formio.formId': idForm
    })

    let a = submissions.filter((submission) => {
      let parallelSurveyID = _get(
        submission,
        "data.data.parallelSurvey",
        undefined
      );
      parallelSurveyID =
        parallelSurveyID && parallelSurveyID !== "[object Object]" ? JSON.parse(parallelSurveyID).groupId : undefined;
      return parallelSurveyID && (parallelSurveyID === groupId)
    })
    a = _map(a, 'data.data.parallelSurvey')
    a = _map(a, (survey) => {
      return JSON.parse(survey)
    })
    return a
  }

  static getParallelSurvey(submission) {
    let parallelsurveyInfo =
      _get(
        submission,
        "data.data.parallelSurvey",
        undefined
      ) ||
      _get(
        submission,
        "data.parallelSurvey",
        undefined
      )

    parallelsurveyInfo =
      (parallelsurveyInfo && parallelsurveyInfo !== "[object Object]") ?
        JSON.parse(parallelsurveyInfo) :
        undefined;

    return parallelsurveyInfo
  }

  static setParallelSurvey(parallelsurveyInfo) {
    return JSON.stringify(parallelsurveyInfo)
  }

  static async getGroups(formId) {
    let submissions = await Submission.find();

    submissions = formId ? submissions.filter((submission) => {
      return submission.data.formio.formId === formId
    }) : submissions

    let groups = submissions.map((submission) => {
      return Submission.getParallelSurvey(submission) ? {
        groupId: Submission.getParallelSurvey(submission).groupId,
        groupName: Submission.getParallelSurvey(submission).groupName
      } : undefined
    })

    groups = groups.filter((group) => {
      return typeof group !== "undefined"
    })

    return _uniqBy(groups, 'groupId')
  }

  static async getGroup(id) {
    let groups = await Submission.getGroups()
    groups = groups.filter((group) => {
      return group.groupId === id
    })
    return groups[0]
  }

  static async removeFromGroup(submission) { }

  static async assingToGroup(submissionId, groupId) {
    let group = await Submission.getGroup(groupId[0])
    let submission = await Submission.get(submissionId)

    let parallelData = Submission.getParallelSurvey(submission)

    let parallelSurvey = {
      ...parallelData,
      groupId: group.groupId,
      groupName: group.groupName
    };
    submission.data.data.parallelSurvey = Submission.setParallelSurvey(
      parallelSurvey
    );
    await Submission.update(submission)
  }
}
export default Submission
