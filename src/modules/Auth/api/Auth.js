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
import LocalUser from 'database/collections/scopes/LocalUser'
import store from 'config/store'
import Connection from 'modules/Wrappers/Connection'
import LocalRoles from "database/collections/scopes/LocalRoles";
import _forEach from "lodash/forEach";
import _find from 'lodash/find'

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

  static hasRole(roleName) {
    let user = JSON.parse(LocalStorage.get.item('authUser'))
    user = user === null ? false : user
    let result = _find(user.rolesNames, {
      title: roleName
    });

    return typeof (result) !== 'undefined'
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

    router.push({
      path: '/login'
    })
  }

  /**
   * [attempt description]
   * @param  {[type]}   credentials [description]
   * @return {Promise}   callback    [description]
   */
  static attempt(credentials, baseUrl, role) {
    role = role || 'user'

    return new Promise((resolve, reject) => {
      this.authenticate(credentials, baseUrl, role)
        // If credentials are OK
        .then(async(response) => {
          Loading.hide()
          let headers = response.headers || {}
          let user = response.data
          user.x_jwt_token = headers['x-jwt-token']

          // Save auth user
          LocalStorage.set('authUser', JSON.stringify(user))

            // user.isAdmin = true
            let roles = await Formio.getRoles();
            console.log('rewrerwe', roles)
            user.rolesNames = [];
            _forEach(roles, async role => {
              LocalRoles.updateOrCreate(role);
              if (user.roles && user.roles.indexOf(role._id) !== -1) {
                user.rolesNames.push(role)
              }
            });
            LocalStorage.set('authUser', JSON.stringify(user))

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
  static authenticate(credentials, baseUrl, role) {
    let isOnline = Connection.isOnline()

    if (role === 'admin') {
      if (isOnline) {
        return this.remoteAuthenticate(credentials, baseUrl, role)
          .catch(() => {
            console.log('Remote Auth failed, trying locally')
          })
      }
    }
    if (isOnline) {
      return this.remoteAuthenticate(credentials, baseUrl, role)
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
  static remoteAuthenticate(credentials, baseUrl, role) {
    Loading.show({
      message: 'Authenticating to Formio..'
    })

    if (role === 'admin') {
      return Formio.adminAuth(credentials, baseUrl)
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
    let dbUser = await LocalUser.findOne({
      'data.data.email': username
    })
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
