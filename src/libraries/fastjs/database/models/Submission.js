import _map from 'lodash/map'
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import _uniqBy from 'lodash/uniqBy'
import _get from 'lodash/get'
import Auth from 'modules/Auth/api/Auth'
import * as Database from '../Database';
import uuidv4 from 'uuid/v4'
import moment from 'moment'
import RemoteSubmission from 'libraries/fastjs/repositories/Submission/RemoteSubmission'

const Submission = class {
  constructor(location, formPath) {
    this.getFrom = location;
    this.formPath = formPath
  }
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  getOwnName() {
    return 'Submission'
  }
  /**
  * [getModel description]
  * @return {[type]} [description]
  */
  async getModel() {
    const DB = await Database.get()
    return DB.getCollection(this.getOwnName())
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  static remote(formPath) {
    this.getFrom = 'remote'
    return new Submission('remote', formPath)
  }
  /**
   * [submission description]
   * @return {[type]} [description]
   */
  static local(formPath) {
    return new Submission('local', formPath)
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  static merged(formPath) {
    return new Submission('remote-local', formPath)
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  async find({ filter, limit, select, pagination }) {
    const model = await this.getModel()
    switch (this.getFrom) {
      case 'remote':
        return new RemoteSubmission(this.formPath).find({ filter, limit, select, pagination })
        break;
      case 'local':
        return model.find(filter).filter(o => {
          return (
            (o.data.owner && o.data.owner === Auth.user()._id) ||
            (o.data.user_email && o.data.user_email === Auth.userEmail())
          )
        }).map(o => o.data);
        break;
      case 'remote-local':
        let merged = []
        let remote = await new RemoteSubmission(this.formPath).find({ filter, limit, select, pagination })

        let local = model.find(filter).filter(o => {
          return (
            (o.data.owner && o.data.owner === Auth.user()._id) ||
            (o.data.user_email && o.data.user_email === Auth.userEmail())
          )
        });

        merged = merged.concat(remote)
        merged = merged.concat(local.map(o => {
          let _id = o._id
          if (!o.data._id) {
            o.data._id = _id
          }
          return o.data
        }
        ))
        return merged
        break;
    }
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  async remove(document) {
    const model = await this.getModel()
    return model.remove(document);
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  async insert(element) {
    const model = await this.getModel()
    element._id = uuidv4() + '_local'
    return model.insert(element);
  }

  async save(element) {
    switch (this.getFrom) {
      case 'remote':
        return RemoteSubmission.save(element)
        break;
      case 'local':
        return this.insert(element)
        break;
      case 'remote-local':
        throw new Error('Submission cannot be saved remotely and local at the same time.')
        break;
    }
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  async update(document) {
    const model = await this.getModel()
    return model.update(document);
  }

  async updateOrCreate(document) {
    const model = await this.getModel()
    let role = await model.find(document)
    if (!role) {
      model.insert(document)
    }
  }

  /**
  * [findOne description]
  * @param  {[type]} filter [description]
  * @return {[type]}        [description]
  */
  async findOne(filter) {
    const model = await this.getModel()
    return model.findOne(filter);
  }

  async findAndRemove(filter) {
    const model = await this.getModel()
    return model.findAndRemove(filter);
  }

  async get(id) {
    id = id.replace(/\s/g, '')
    let offline = await this.find({
      '_id': id
    })
    let online = await this.find({
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

  async offline(formId) {
    let filter = await this.find({
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

  async stored(formId) {
    return Submission
      .find({
        'data.formio.formId': formId,
        'data.owner': Auth.user()._id
      })
  }

  async getUnsync() {
    let unsynced = await this.find({
      'data.sync': false
    })
    // updated incomplete submission
    unsynced = _filter(unsynced, function (o) {
      return (o.data.sync === false && o.data.draft === false && o.data.user_email === Auth.userEmail() && !o.data.queuedForSync && !o.data.syncError)
    })

    unsynced = _orderBy(unsynced, ['data.created'], ['asc'])
    return unsynced
  }

  async showView({ form, filter, limit, select, pagination }) {
    let page = (pagination && pagination.page) || 1
    let pageLimit = (pagination && pagination.limit) || 500
    let paginationInfo = {}
    let submissions = []

    submissions = await this.find(filter)

    if (pageLimit > 0) {
      let totalRecords = submissions.length
      let pages = Math.ceil(totalRecords / pageLimit)
      // let firstRecord = (pageLimit * page) - (pageLimit - 1)
      // let lastRecord = (pageLimit * page)
      paginationInfo = { total: totalRecords, pages: pages, currentPage: page, pageLimit: pageLimit }
      // submissions = submissions.slice(firstRecord - 1, lastRecord);
    }

    submissions = _orderBy(submissions, ['created'], ['desc'])
    let sub = submissions.map(s => {
      let sub = {
        _id: s._id,
        status: s.sync === false ? 'offline' : 'online',
        draft: s.draft,
        HumanUpdated: moment(s.updated || s.modified).fromNow(),
        syncError: s.syncError ? s.syncError : false,
        updated: s.updated || s.modified
      }
      select.forEach(c => {
        sub[c] = s.data[c]
      })
      return sub
    })
    sub = _orderBy(sub, ['updated'], ['desc'])
    let paginated = { results: sub, pagination: paginationInfo }
    return paginated
  }

  async getParallelParticipants(idForm, idSubmission) {
    let currentSubmission = await this.find({
      '_id': idSubmission
    })

    currentSubmission = currentSubmission[0]
    let groupId = _get(currentSubmission, 'data.data.parallelSurvey', undefined)

    groupId = groupId && groupId !== '[object Object]' ? JSON.parse(groupId).groupId : undefined

    let submissions = await this.find({
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

  getParallelSurvey(submission) {
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

  setParallelSurvey(parallelsurveyInfo) {
    return JSON.stringify(parallelsurveyInfo)
  }

  async getGroups(formId) {
    let submissions = await this.find();

    submissions = formId ? submissions.filter((submission) => {
      return submission.data.formio.formId === formId
    }) : submissions

    let groups = submissions.map((submission) => {
      return this.getParallelSurvey(submission) ? {
        groupId: this.getParallelSurvey(submission).groupId,
        groupName: this.getParallelSurvey(submission).groupName
      } : undefined
    })

    groups = groups.filter((group) => {
      return typeof group !== "undefined"
    })

    return _uniqBy(groups, 'groupId')
  }

  async getGroup(id) {
    let groups = await this.getGroups()
    groups = groups.filter((group) => {
      return group.groupId === id
    })
    return groups[0]
  }

  async removeFromGroup(submission) { }

  async assingToGroup(submissionId, groupId) {
    let group = await this.getGroup(groupId[0])
    let submission = await this.get(submissionId)

    let parallelData = this.getParallelSurvey(submission)

    let parallelSurvey = {
      ...parallelData,
      groupId: group.groupId,
      groupName: group.groupName
    };
    submission.data.data.parallelSurvey = this.setParallelSurvey(
      parallelSurvey
    );
    await this.update(submission)
  }
}
export default Submission
