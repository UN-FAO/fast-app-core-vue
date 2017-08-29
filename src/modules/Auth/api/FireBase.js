import axios from 'config/axios'
import { LocalStorage, Loading } from 'quasar'
import router from 'config/router'
const Auth = class {
  /**
   * Retrieves the current auth user
   * @return {boolean} [description]
   */
  static user() {
    let user = JSON.parse(LocalStorage.get.item('authUser'))
    if (user === null) {
      return false
    }
    return user
  }

  /**
   * Checks if the current user is
   * Authenticated
   * @return {boolean}
   */
  static check() {
    let user = JSON.parse(LocalStorage.get.item('authUser'))
    return user !== null
  }

  /**
   * Logs the Authenticated User Out
   */
  static logOut() {
    LocalStorage.remove('authUser')
    router.push({ path: '/login' })
  }

  /**
   * [attempt description]
   * @param  {[type]}   credentials [description]
   * @return {Promise}              [description]
   */
  static attempt(credentials) {
    let authUser = {}
    return new Promise((resolve, reject) => {
      this.authenticate(credentials)
        // If credentials are OK
        .then((token) => {
          authUser.access_token = token
          LocalStorage.set('authUser', JSON.stringify(authUser))
          return this.getUser()
        })
        // If user is properly fetched
        .then((user) => {
          authUser.email = user.email
          authUser.name = user.name
          LocalStorage.set('authUser', JSON.stringify(authUser))
          resolve(authUser)
        })
        // If there are errors
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * [authenticate description]
   * @param  {[type]} credentials [description]
   * @return {Promise}             [description]
   */
  static authenticate(credentials) {
    Loading.show({
      message: 'Requesting Auth Token..'
    })
    return new Promise((resolve, reject) => {
      let ajaxCall = axios.post('/authenticate', {
        email: credentials.email,
        password: credentials.password
      })
      // If OK
      ajaxCall.then((response) => {
        if (response.status === 200) {
          resolve(response.data.token)
        }
      })
      // If fails
      ajaxCall.catch((error) => {
        reject(error)
      })
    })
  }

  /**
   * Gets the current authenticated
   * User information
   * @return {Promise} [description]
   */
  static getUser() {
    Loading.show({
      message: 'Authenticating...'
    })
    return new Promise((resolve, reject) => {
      axios.get('authenticated_user')
        .then(response => {
          resolve(response.data.user)
          Loading.hide()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
export default Auth
