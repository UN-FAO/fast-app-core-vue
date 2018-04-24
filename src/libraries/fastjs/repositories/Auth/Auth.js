import Configuration from 'libraries/fastjs/repositories/Configuration/Configuration'
import md5 from 'md5'
import User from 'libraries/fastjs/database/models/User'
import UserRepository from "libraries/fastjs/repositories/User/User";
import Connection from 'libraries/fastjs/Wrappers/Connection'
import Role from "libraries/fastjs/database/models/Role";
import _forEach from "lodash/forEach";
import _find from 'lodash/find'

let Auth = (() => {
  /**
  * Retrieves the current auth user
  * @return {boolean} [description]
  */
  function user() {
    try {
      let user = JSON.parse(localStorage.getItem('authUser'))
      return user === null ? false : user
    } catch (e) {
      localStorage.removeItem('authUser')
      return false;
    }
  }

  function userEmail() {
    let userEmail = ''
    if (Auth.user() && Auth.user().data && Auth.user().data.email) {
      userEmail = Auth.user().data.email
    } else if (Auth.user() && Auth.user().email) {
      userEmail = Auth.user().email
    }
    return userEmail
  }

  function hasRole(roleName) {
    let user = JSON.parse(localStorage.getItem('authUser'))
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
  function check() {
    let user = JSON.parse(localStorage.getItem('authUser'))
    return !!user && !!user.x_jwt_token
  }

  /**
   * Logs the Authenticated User Out
   */
  async function logOut() {
    await localStorage.removeItem('authUser')
  }

  /**
   * [attempt description]
   * @param  {[type]}   credentials [description]
   * @return {Promise}   callback    [description]
   */
  function attempt(credentials, baseUrl, role) {
    role = role || 'user'

    return new Promise((resolve, reject) => {
      authenticate(credentials, baseUrl, role)
        // If credentials are OK
        .then(async (response) => {
          let headers = response.headers || {}
          let user = response.data
          user.x_jwt_token = headers['x-jwt-token']

          // Save auth user
          localStorage.setItem('authUser', JSON.stringify(user))

          // user.isAdmin = true
          let roles = await Role.getJsonRoles()
          user.rolesNames = [];
          _forEach(roles, async role => {
            Role.local().updateOrCreate(role);
            if (user.roles && user.roles.indexOf(role._id) !== -1) {
              user.rolesNames.push(role)
            }
          });
          localStorage.setItem('authUser', JSON.stringify(user))

          resolve(user)
        })
        // If there are errors
        .catch((error) => {
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
  function authenticate(credentials, baseUrl, role) {
    let isOnline = Connection.isOnline()
    if (isOnline) {
      return remoteAuthenticate(credentials, baseUrl, role)
        .catch(() => {
          console.log('Remote Auth failed, trying locally')
          return localAuthenticate(credentials, baseUrl)
        })
    }
    return localAuthenticate(credentials, baseUrl)
  }

  /**
   * [remoteAuthenticate description]
   * @param  {[type]} credentials [description]
   * @param  {[type]} baseUrl     [description]
   * @return {[type]}             [description]
   */
  function remoteAuthenticate(credentials, baseUrl, role) {
    return UserRepository.login({ credentials: credentials, role: role })
      .then((response) => {
        // Store locally the user for future offline login
        let user = response.data
        UserRepository.storeLocally(user)
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
  async function localAuthenticate(credentials) {
    const {
      username,
      password
    } = credentials
    let config = Configuration.getLocal()
    // Hash password
    const hashedPassword = md5(password, config.MD5_KEY)
    // Get the user
    let dbUser = await User.local().findOne({
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

  return Object.freeze({
    user,
    userEmail,
    hasRole,
    check,
    logOut,
    attempt
  });
})()
export default Auth
