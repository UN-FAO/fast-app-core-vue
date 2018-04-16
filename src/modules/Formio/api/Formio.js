import axios from 'lodash'
import {
  Loading
} from 'quasar'
import _assign from 'lodash/assign'

const Formio = class {
  /**
   * [getSubmissions description]
   * @param  {[type]} formPath [description]
   * @return {[type]}          [description]
   */
  static getTranslations(idMachine) {
    return new Promise((resolve, reject) => {
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

  static setTranslations(idMachine, label, translations) {
    return new Promise((resolve, reject) => {
      let url = 'https://' + idMachine + '.form.io/translations/submission?data.label=' + encodeURIComponent(label)
      axios.get(url)
        .then(response => {
          if (response.data && response.data.length > 0) {
            let submissions = response.data[0]
            let id = submissions._id
            let mergedTranslations = _assign(submissions.data, translations)
            Formio.updateTranslation(idMachine, id, mergedTranslations).then((updatedSubmission) => {
              resolve(submissions)
              Loading.hide()
            })
              .catch((error) => {
                Loading.hide()
                reject(error)
              })
          }
        })
        .catch((error) => {
          Loading.hide()
          reject(error)
        })
    })
  }

  static updateTranslation(idMachine, submissionId, translations) {
    return new Promise((resolve, reject) => {
      let url = 'https://' + idMachine + '.form.io/translations/submission/' + submissionId
      let updateObject = {}
      updateObject.data = translations
      axios.put(url, updateObject)
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
