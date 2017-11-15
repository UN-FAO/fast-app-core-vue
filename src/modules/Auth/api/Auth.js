import {
  LocalStorage,
  Loading
} from 'quasar'
import router from 'config/router'
import Formio from 'modules/Formio/api/Formio'
import {
  MD5_KEY
} from 'config/env'
import md5 from 'md5'
import * as Database from 'database/Database'
import store from 'config/store'
import Connection from 'modules/Wrappers/Connection'

const Auth = class {
  /**
   * Retrieves the current auth user
   * @return {boolean} [description]
   */
  static user() {
    let user = JSON.parse(LocalStorage.get.item('authUser'))
    return user === null ? false : user
  }

  static userEmail() {
    let userEmail = ''
    if (Auth.user() && Auth.user().data && Auth.user().data.email) {
      userEmail = Auth.user().data.email
    } else if (Auth.user() && Auth.user().email) {
      userEmail = Auth.user().email
    }
    return userEmail
  }

  /**
   * Checks if the current user is
   * Authenticated
   * @return {boolean}
   */
  static check() {
    let user = JSON.parse(LocalStorage.get.item('authUser'))
    return !!user && !!user.x_jwt_token
  }

  /**
   * Logs the Authenticated User Out
   */
  static logOut() {
    LocalStorage.remove('authUser')
    LocalStorage.remove('id_token')
    LocalStorage.remove('formioToken')
    LocalStorage.remove('formioUser')
    router.push({
      path: '/login'
    })
  }

  /**
   * [attempt description]
   * @param  {[type]}   credentials [description]
   * @return {Promise}   callback    [description]
   */
  static attempt(credentials, baseUrl) {
    return new Promise((resolve, reject) => {
      this.authenticate(credentials, baseUrl)
        // If credentials are OK
        .then((response) => {
          Loading.hide()
          let headers = response.headers || {}
          let user = response.data
          user.x_jwt_token = headers['x-jwt-token']

          // Save auth user
          LocalStorage.set('authUser', JSON.stringify(user))
          LocalStorage.set('formioToken', headers['x-jwt-token'])
          LocalStorage.set('formioUser', JSON.stringify(user))
          LocalStorage.set('id_token', headers['x-jwt-token'])
          resolve(user)
        })
        // If there are errors
        .catch((error) => {
          Loading.hide()
          console.log('There was an error over here!')
          reject(error)
        })
    })
  }

  /**
   * [authenticate description]
   * @param  {[type]} credentials [description]
   * @return {Promise}             [description]
   */
  static authenticate(credentials, baseUrl) {
    let isOnline = Connection.isOnline()
    if (isOnline) {
      return this.remoteAuthenticate(credentials, baseUrl)
        .catch(() => {
          console.log('Remote Auth failed, trying locally')
          return this.localAuthenticate(credentials, baseUrl)
        })
    }
    return this.localAuthenticate(credentials, baseUrl)
  }

  /**
   * [remoteAuthenticate description]
   * @param  {[type]} credentials [description]
   * @param  {[type]} baseUrl     [description]
   * @return {[type]}             [description]
   */
  static remoteAuthenticate(credentials, baseUrl) {
    Loading.show({
      message: 'Authenticating to Formio..'
    })

    return Formio.userAuth(credentials, baseUrl)
      .then((response) => {
        // Store locally the user for future offline login
        let user = response.data
        store.dispatch('storeUserLocally', user)
        return response
      })
      .catch((error) => {
        console.log('Error from remote auth', error)
      })
  }

  /**
   * [localAuthenticate description]
   * @param  {[type]} credentials [description]
   * @return {[type]}             [description]
   */
  static async localAuthenticate(credentials) {
    const {
      username,
      password
    } = credentials
    // Hash password
    const hashedPassword = md5(password, MD5_KEY)

    // Get the user
    let db = await Database.get()
    let dbUser = await db.users.findOne().where('data.data.email').eq(username).exec()
    // Compare hashed passwords
    const isValidUser = dbUser.data.data.hashedPassword === hashedPassword

    if (!isValidUser) {
      throw new Error()
    }
    // If is valid, return the user
    return dbUser
  }
}

export default Auth
