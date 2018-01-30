import User from 'database/models/User'
import SyncHelper from 'database/helpers/SyncHelper'
import {
  APP_URL,
  APP_NAME
} from 'config/env'
import _isEmpty from 'lodash/isEmpty'
const state = {
  layoutNeeded: false,
  isLoginPage: true,
  authUser: {},
  appURL: APP_URL,
  appName: APP_NAME,
  isOnline: true
}

const mutations = {
  /**
   * [SET_AUTH_USER description]
   * @param {[type]} state [description]
   * @param {[type]} User  [description]
   */
  SET_AUTH_USER(state, User) {
    state.authUser = User
  },
  /**
   * [CLEAR_AUTH_USER description]
   * @param {[type]} state [description]
   */
  CLEAR_AUTH_USER(state) {
    state.authUser = null
  },

  CHANGE_IS_ONLINE_STATUS(state, status) {
    state.isOnline = status
  }
}

const getters = {
  /**
   * [getIsLoginPage description]
   * @return {[type]} [description]
   */
  getIsLoginPage() {
    return state.isLoginPage
  },

  getMachineUrl() {
    return state.appName
  },
  getAuthUser() {
    return state.authUser
  }
}

const actions = {
  /**
   * [description]
   * @param  {[type]} options.commit [description]
   * @param  {[type]} User           [description]
   * @return {[type]}                [description]
   */
  setUserObject: ({
    commit
  }, User) => {
    commit('SET_AUTH_USER', User)
  },
  /**
   * [description]
   * @param  {[type]} options.commit [description]
   * @return {[type]}                [description]
   */
  clearAuthUser: ({
    commit
  }) => {
    commit('CLEAR_AUTH_USER')
  },

  changeIsOnlineStatus: ({
    commit
  }, status) => {
    commit('CHANGE_IS_ONLINE_STATUS', status)
  },
  /**
   * [description]
   * @param  {[type]} options.commit [description]
   * @param  {[type]} currentForm    [description]
   * @return {[type]}                [description]
   */
  storeUserLocally: async({
    commit
  }, formIoUser) => {
    let user = await User.local().findOne({
      'data.data.email': formIoUser.data.email
    })

    formIoUser = SyncHelper.deleteNulls(formIoUser)
    let isUserAlreadyStored = !!user && !_isEmpty(user)

    //  check if user is already present in local storage
    if (isUserAlreadyStored) {
      user.data = formIoUser
      //  update the user with the updated information
      User.local().update(user)
    } else {
      //  Insert the new user
      await User.local().insert({
        data: formIoUser
      })
    }
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
