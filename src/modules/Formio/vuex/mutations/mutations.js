import _findIndex from 'lodash/findIndex'

const mutations = {

  /**
   * [SET_FORMS description]
   * @param {[type]} state [description]
   * @param {[type]} forms [description]
   */
  SET_FORMS(state, forms) {
    state.forms = forms
  },
  /**
   * [SET_SUBMISSIONS description]
   * @param {[type]} state [description]
   * @param {[type]} data  [description]
   */
  SET_SUBMISSIONS(state, data) {
    let index = _findIndex(state.forms, {
      '_id': String(data.formId)
    })
    state.forms[index] = { ...state.forms[index],
      submissions: data.submissions
    }
  },

  /**
   * [ADD_SUBMISSION description]
   * @param {[type]} state [description]
   * @param {[type]} data  [description]
   */
  ADD_SUBMISSION(state, response) {
    console.log(response.data.form)
    let Formindex = _findIndex(state.forms, {
      '_id': String(response.data.form)
    })
    // Keeping it for the edit of the submision
    // let submissionIndex = _findIndex(state.forms[index].submissions, { '_id': String(response.data._id)});
    state.forms[Formindex].submissions.push(response.data)
  }

}

export default mutations
