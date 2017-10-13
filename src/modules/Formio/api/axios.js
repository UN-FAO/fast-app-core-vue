import axios from 'axios'
import { LocalStorage, Loading } from 'quasar'

/**
 * Sets the default URL for API Calls
 * and sets fixed headers for JWT Auth
 * @type {[type]}
 */
var axiosInstance = axios.create({
  baseURL: 'https://jnvqpahuqbulzuz.form.io/',
  headers: {
    'Accept': 'application/json',
    'x-token': ''
  }
})

/**
 * Intercepts every request, before it goes out
 * It sets the w-jwt-token required by formio
 * @param  {[type]} config) {} [description]
 * @return {[type]}         [description]
 */
axiosInstance.interceptors.request.use(function (config) {
  let authUser = JSON.parse(LocalStorage.get.item('authUser'))
  let hasUser = !!authUser && typeof authUser === 'object'
  let hasToken = hasUser && !!authUser.x_jwt_token

  if (hasToken) {
    config.headers['x-jwt-token'] = authUser.x_jwt_token
  }
  return config
})

/**
 * Intercepts every response.
 * @param  {[type]} response) {} [description]
 * @param  {[type]} function  (error) {} [description]
 * @return {[type]}           [description]
 */
axiosInstance.interceptors.response.use(function (response) {
  // Loading.hide()
  return response
}, function (error) {
  Loading.hide()
  return Promise.reject(error)
})

export default axiosInstance
