import _map from 'lodash/map'
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import _uniqBy from 'lodash/uniqBy'
import _get from 'lodash/get'
import Auth from 'libraries/fastjs/repositories/Auth/Auth'
import moment from 'moment'
import RemoteSubmission from 'libraries/fastjs/repositories/Submission/RemoteSubmission'
import baseModel from './baseModelFactory'

let Submission = (args) => {
  var baseModel = args.baseModel;
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  /* eslint-disable no-unused-vars */
  function getOwnName() {
    return 'Submission'
  }

  function getFormPath() {
    return undefined
  }

  async function rFind({ filter, limit, select, pagination, formioPath }) {
    return new RemoteSubmission(this.formPath).find({ filter, limit, select, pagination, formioPath })
    switch (baseModel.getFrom) {
      case 'remote':
        console.log('fwefew')
        break;
      case 'local':
        return baseModel.local().find(filter).filter(o => {
          return (
            (o.data.owner && o.data.owner === Auth.user()._id) ||
            (o.data.user_email && o.data.user_email === Auth.userEmail())
          )
        }).map(o => o.data);
        break;
      case 'remote-local':
        let merged = []
        let remote = await new RemoteSubmission(this.formPath).find({ filter, limit, select, pagination })

        let local = baseModel.local().find(filter).filter(o => {
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

  async function get(id) {
    id = id.replace(/\s/g, '')
    let offline = await Submission.local().find({
      filter: {
        '_id': id
      }
    })
    let online = await Submission.local().find({
      filter: {
        'data._id': id
      }})
    if (online) {
      return online[0]
    }
    if (offline) {
      return offline[0]
    } else {
      return {
        data: false
      }
    }
  }

  async function offline(formId) {
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

  async function stored(formId) {
    return Submission
      .find({
        'data.formio.formId': formId,
        'data.owner': Auth.user()._id
      })
  }

  async function getUnsync() {
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

  async function showView({ form, filter, limit, select, pagination }) {
    let page = (pagination && pagination.page) || 1
    let pageLimit = (pagination && pagination.limit) || 500
    let paginationInfo = {}
    let submissions = []

    submissions = await Submission.find({ form, limit, select, pagination })

    submissions = submissions.map(o => {
      if (!o.data._id) {
        o.data._id = o._id
      }
      if (!o.data.owner) {
        o.data.owner = o.owner
      }
      if (!o.data.modified) {
        o.data.modified = o.modified
      }
      return o.data
    }
    )

    if (pageLimit > 0) {
      let totalRecords = submissions.length
      let pages = Math.ceil(totalRecords / pageLimit)
      // let firstRecord = (pageLimit * page) - (pageLimit - 1)
      // let lastRecord = (pageLimit * page)
      paginationInfo = { total: totalRecords, pages: pages, currentPage: page, pageLimit: pageLimit }
      // submissions = submissions.slice(firstRecord - 1, lastRecord);
    }

    submissions = submissions.map(s => {
      let sub = {
        _id: s._id,
        status: s.sync === false ? 'offline' : 'online',
        draft: s.draft,
        HumanUpdated: moment(s.updated || s.modified).fromNow(),
        syncError: s.syncError ? s.syncError : false,
        updated: s.updated || s.modified
      }
      select.forEach(c => {
        c = c.replace('data.', '')
        sub[c] = s[c]
      })
      return sub
    })

    submissions = _orderBy(submissions, ['updated'], ['desc'])
    let paginated = { results: submissions, pagination: paginationInfo }
    return paginated
  }

  async function getParallelParticipants(idForm, idSubmission) {
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

  function getParallelSurvey(submission) {
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

  function setParallelSurvey(parallelsurveyInfo) {
    return JSON.stringify(parallelsurveyInfo)
  }

  async function getGroups(formId) {
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

  async function getGroup(id) {
    let groups = await this.getGroups()
    groups = groups.filter((group) => {
      return group.groupId === id
    })
    return groups[0]
  }

  async function removeFromGroup(submission) { }

  async function assingToGroup(submissionId, groupId) {
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

  return Object.freeze(Object.assign({}, baseModel, {
    getOwnName,
    getFormPath,
    assingToGroup,
    removeFromGroup,
    getGroup,
    getGroups,
    setParallelSurvey,
    getParallelSurvey,
    getParallelParticipants,
    showView,
    getUnsync,
    stored,
    offline,
    get,
    rFind
  }));
}
Submission = Submission({
  baseModel: baseModel()
});
export default Submission
