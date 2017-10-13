import axios from './axios'
import { Loading } from 'quasar'
import _ from 'lodash'
import FormioUtils from 'formiojs/utils'
import FormioForm from 'formiojs/form'
import AXIOS from 'axios'

const Formio = class {
  /**
   * [authenticate description]
   * @param  {[type]} username [description]
   * @param  {[type]} password [description]
   * @return {[type]}          [description]
   */
  static authenticate (username, password) {
    return new Promise((resolve, reject) => {
      axios.post('https://formio.form.io/user/login', { data: { email: username, password: password } })
        .then(response => {
          resolve({ headers: response.headers, data: response.data })
          Loading.hide()
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [projects description]
   * @return {[type]} [description]
   */
  static projects () {
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Loading projects..'
      })
      axios.get('https://api.form.io/project?limit=9007199254740991&sort=-modified')
        .then(response => {
          let projects = response.data
          resolve(projects)
          Loading.hide()
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [projects description]
   * @return {[type]} [description]
   */
  static project (id) {
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Loading project information..'
      })
      axios.get('https://api.form.io/project/' + id)
        .then(response => {
          let project = response.data
          resolve(project)
          Loading.hide()
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [getResource description]
   * @param  {[type]} options.projectName [description]
   * @param  {[type]} options.resource    [description]
   * @param  {[type]} options.process     [description]
   * @return {[type]}                     [description]
   */
  static getResource ({ projectName, resource, process }) {
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Loading forms..'
      })
      axios.get('https://' + projectName + '.form.io/' + resource)
        .then(response => {
          let forms = response.data
          if (typeof process === 'function') {
            process(forms)
          }
          resolve(forms)
          Loading.hide()
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [forms description]
   * @param  {[type]} projectName [description]
   * @return {[type]}             [description]
   */
  static forms (projectName) {
    let self = this

    return this.getResource({
      projectName,
      resource: 'form',
      process: function (forms) {
        _.forEach(forms, function (form, index) {
          forms[index].editUrl = self.setEditUrl(form)
        })
      }
    })
  }

  /**
   * [users description]
   * @param  {[type]} projectName [description]
   * @return {[type]}             [description]
   */
  static users (projectName) {
    return this.getResource({ projectName, resource: 'user/submission' })
  }

  /**
   * [setEditUrl description]
   * @param {[type]} form [description]
   */
  static setEditUrl (form) {
    let url = 'https://portal.form.io/#/project/' + form.project + '/form/' + form._id + '/edit'
    return url
  }

  /**
   * [setSubmissionEditURL description]
   * @param {[type]} submission [description]
   */
  static setSubmissionEditURL (submission) {
    let url = '/form/' + submission.form + '/submission/' + submission._id + '/edit'
    return url
  }

  /**
   * [getSubmissions description]
   * @param  {[type]} formPath [description]
   * @return {[type]}          [description]
   */
  static getSubmissions (idMachine, formPath) {
    let self = this
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Loading form submissions..'
      })

      let res = idMachine.substring(0, idMachine.indexOf(':'))
      let url = 'https://' + res + '.form.io/' + formPath + '/submission?limit=50000'
      axios.get(url)
        .then(response => {
          let submissions = response.data
          _.forEach(submissions, function (submission, index) {
            submissions[index].editUrl = self.setSubmissionEditURL(submission)
          })
          resolve(submissions)
          Loading.hide()
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [loadConfigProject description]
   * @param  {[type]} container [description]
   * @return {[type]}           [description]
   */
  static loadConfigProject (container) {
    let form = new FormioForm(container)
    form.src = 'https://swgxzpjusiyswjy.form.io/projects'
    return form
  }

  /**
   * [loadConfigProject description]
   * @param  {[type]} container [description]
   * @return {[type]}           [description]
   */
  static loadForm (container, formModel) {
    let form = new FormioForm(container)
    form.src = 'https://' + formModel.machineName.substring(0, formModel.machineName.indexOf(':')) + '.form.io/' + formModel.path
    return form
  }

  /**
   * [loadFormFromJson description]
   * @param  {[type]} container [description]
   * @param  {[type]} formModel [description]
   * @return {[type]}           [description]
   */
  static loadFormFromJson (container, formModel) {
    let form = new FormioForm(container)
    form.form = { components: formModel.components }
    form.formio = {}
    form.formio.formUrl = 'https://' + formModel.machineName.substring(0, formModel.machineName.indexOf(':')) + '.form.io/' + formModel.path

    return form
  }

  /**
   * [loadConfigProject description]
   * @param  {[type]} container [description]
   * @return {[type]}           [description]
   */
  static loadConfigForm (container) {
    let form = new FormioForm(container)
    form.src = 'https://swgxzpjusiyswjy.form.io/forms'
    return form
  }

  /**
   * [createProject description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  static createProject (data) {
    return new Promise((resolve, reject) => {
      let parsedData = data.data
      parsedData.template = 'https://cdn.rawgit.com/formio/formio-app-basic/2.1.0/src/project.json'
      parsedData.settings = {
        'cors': '*'
      }
      Loading.show({
        message: 'Creating new project...'
      })
      axios.post('https://api.form.io/project', parsedData)
        .then(response => {
          this.generateApiKey(response.data)
            .then((proyect) => {
              // this.generateTranslationForm(proyect)
              resolve(proyect)
            })
            .catch((error) => {
              Loading.hide()
              reject(error)
            })
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [deleteProject description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  static deleteProject (url) {
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Deleting project...'
      })
      axios.delete(url)
        .then(response => {
          resolve({ headers: response.headers, data: response.data })
          Loading.hide()
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [generateApiKey description]
   * @param  {[type]} projectModel [description]
   * @return {[type]}              [description]
   */
  static generateApiKey (projectModel) {
    let url = 'https://api.form.io/project/' + projectModel._id
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Generating API for the project..'
      })
      this.project(projectModel._id).then((project) => {
        project.settings.keys = [{
          name: 'FAST_NODE_RED',
          key: 'ASUiwa0aEMZI7LZNBPlfXiMG3ub5TO',
          $$hashKey: 'object:2235'
        }]
        axios.put(url, project)
          .then(response => {
            resolve({ headers: response.headers, data: response.data })
            Loading.hide()
          })
          .catch((error) => {
            Loading.hide()
            reject(error)
          })
      })
    })
  }

  /**
   * [generateForm description]
   * @param  {[type]} formInformation [description]
   * @param  {[type]} projectId       [description]
   * @return {[type]}                 [description]
   */
  static generateForm (formInformation, projectId) {
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Creating new Form..'
      })

      let url = 'https://api.form.io/project/' + projectId + '/form'
      this.project(projectId)
        .then((project) => {
          let projectNameLower = project.title.replace(/\s/g, '') + '-' + project.name
          let newForm = {
            title: formInformation.data.title,
            type: 'form',
            submissionAccess: [],
            path: formInformation.data.path,
            page: 0,
            name: formInformation.data.name,
            display: formInformation.data.display,
            components: [{
              defaultValue: project._id,
              input: true,
              tableView: true,
              key: 'projectId',
              label: 'projectID',
              protected: false,
              unique: false,
              persistent: true,
              type: 'hidden',
              tags: [],
              conditional: {}
            },
            {
              defaultValue: projectNameLower.toLowerCase(),
              input: true,
              tableView: true,
              key: 'projectName',
              label: 'projectName',
              protected: false,
              unique: false,
              persistent: true,
              type: 'hidden',
              tags: [],
              conditional: {}
            },
            {
              input: true,
              label: 'Submit',
              tableView: false,
              key: 'submit',
              size: 'md',
              leftIcon: '',
              rightIcon: '',
              block: false,
              action: 'submit',
              disableOnInvalid: false,
              theme: 'primary',
              type: 'button'
            }
            ],
            // TODO This has to be the logged in user Change needed
            owner: '573cc203e35b990100f16c0a',
            access: [{
              type: 'read_all',
              roles: ['595b6646ae632f00de0b9269', '595b6646ae632f00de0b926a', '595b6646ae632f00de0b926b']
            }]
          }

          axios.post(url, newForm)
            .then(response => {
              // Set the editUrl for the new Form
              response.data.editUrl = this.setEditUrl(response.data)
              this.generateAction(projectId, response.data._id)
                .then((data) => {
                  resolve(response.data)
                  Loading.hide()
                })
                .catch((error) => {
                  Loading.hide()
                  reject(error)
                })
            })
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
     * [generateTranslationForm description]
     * @param  {[type]} projectID [description]
     * @return {[type]}           [description]
     */
  static generateTranslationForm (projectID) {
    let formInformation = {}
    formInformation.data.title = 'translations'
    formInformation.data.path = 'translations'
    formInformation.data.name = 'translations'
    formInformation.data.display = 'form'

    this.generateForm(formInformation, projectID)
  }

  /**
   * [generateAction description]
   * @param  {[type]} projectId [description]
   * @param  {[type]} formId    [description]
   * @return {[type]}           [description]
   */
  static generateAction (projectId, formId) {
    console.log('Generating Actions for the project', projectId, formId)
    let url = 'https://api.form.io/project/' + projectId + '/form/' + formId + '/action'
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Generating Webhook to Node-Red...'
      })
      this.project(projectId).then((project) => {
        console.log('This is the project that we have', project)
        let Action = {
          data: {
            condition: {},
            handler: ['after'],
            method: ['create', 'update', 'delete'],
            name: 'webhook',
            priority: 0,
            settings: {
              url: 'http://fast-poc-connector.eu-gb.mybluemix.net/FAST-NODERED-CONNECTOR',
              password: 'ASUiwa0aEMZI7LZNBPlfXiMG3ub5TO',
              username: 'admin'
            },
            title: 'FAST_NODE_RED_CONNECTOR'
          }
        }
        axios.post(url, Action)
          .then(response => {
            resolve({ headers: response.headers, data: response.data })
            Loading.hide()
          })
          .catch((error) => {
            Loading.hide()
            reject(error)
          })
      })
    })
  }

  /**
   * [getEmptyErrors description]
   * @param  {[type]} form [description]
   * @return {[type]}      [description]
   */
  static getEmptyErrors (form) {
    let emptyErrors = []
    FormioUtils.eachComponent(form.components, (component) => {
      if (component.component.validate && component.component.validate.required === true && component.value === '') {
        emptyErrors.push({ component: component.component, message: 'Empty Field' })
      }
    })

    return emptyErrors
  }

  /**
   * [createSubmission description]
   * @param  {[type]} form [description]
   * @return {[type]}      [description]
   */
  static createSubmission (form) {
    return new Promise((resolve, reject) => {
      if (!form.formio) {
        console.log('This is not defined', form)
      }
      let url = form.formio.formUrl
      if (form.formio.formUrl.indexOf('/user/register/') !== -1) {
        url = form.formio.formUrl + '/submission'
      }
      let dataToInsert = form.submission

      if (!form.sync) {
        dataToInsert = { data: form.data }
      }

      axios.post(url, dataToInsert)
        .then(response => {
          // Loading.hide();
          resolve(response)
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [registerUser description]
   * @param  {[type]} user    [description]
   * @param  {[type]} formUrl [description]
   * @return {[type]}         [description]
   */
  static registerUser (user, formUrl) {
    let url = formUrl + '/user/register/'
    return axios.post(url, { data: user })
  }

  /**
   * [userAuth description]
   * @param  {[type]} credentials [description]
   * @param  {[type]} baseUrl     [description]
   * @return {Promise}             [description]
   */
  static userAuth (credentials, baseUrl) {
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Login user in...'
      })
      let url = baseUrl + '/user/login'
      AXIOS.post(url, { data: { email: credentials.username, password: credentials.password } })
        .then(response => {
          Loading.hide()
          resolve(response)
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [getUser description]
   * @param  {[type]} id      [description]
   * @param  {[type]} baseUrl [description]
   * @return {[type]}         [description]
   */
  static getUser (id, baseUrl) {
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Loading user info...'
      })
      let url = baseUrl + '/user/submission/' + id
      // console.log("login in to", url)
      axios.get(url)
        .then(response => {
          // console.log("user fetched", response)
          Loading.hide()
          resolve(response)
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  /**
   * [loadRegisterForm description]
   * @param  {[type]} container [description]
   * @param  {[type]} url       [description]
   * @return {[type]}           [description]
   */
  static loadRegisterForm (container, url) {
    let form = new FormioForm(container)
    form.src = url + '/user/register'
    return form
  }

  /**
   * [getRoles description]
   * @param  {[type]} projectId [description]
   * @return {[type]}           [description]
   */
  static getRoles (projectId) {
    let roles = []
    // url = 'https://api.form.io/project/' + projectId + '/role'
    return roles
  }

  /**
   * [getSubmissions description]
   * @param  {[type]} formPath [description]
   * @return {[type]}          [description]
   */
  static getTranslations (idMachine) {
    return new Promise((resolve, reject) => {
      Loading.show({
        message: 'Loading form submissions..'
      })

      let url = 'https://' + idMachine + '.form.io/translations/submission?limit=50000'
      axios.get(url)
        .then(response => {
          let submissions = response.data
          resolve(submissions)
          Loading.hide()
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }
}
export default Formio
