import axios from 'axios'
import { Loading, LocalStorage } from 'quasar'

/**
 * Sets the default URL for API Calls
 * and sets fixed headers for JWT Auth
 * @type {[type]}
 */
var axiosInstance = axios.create({
  baseURL: 'http://192.168.99.102:3000/api/',
  headers: {
    'Accept': 'application/json',
    'Authorization': ''
  }
})

/**
 * Intercepts every request, before it goes out
 * @param  {[type]} config) {} [description]
 * @return {[type]}         [description]
 */
axiosInstance.interceptors.request.use(function (config) {
  console.log('INTERCEPTOR')

  let authUser = JSON.parse(LocalStorage.get.item('authUser'))
  let hasUser = !!authUser && typeof authUser === 'object'
  let hasToken = hasUser && !!authUser.x_jwt_token

  console.log(authUser)

  if (hasToken) {
    // config.headers['Authorization'] = authUser.access_token.id
    config.headers['x-jwt-token'] = authUser.x_jwt_token
  }
  if (!Loading.isActive()) {
    Loading.show()
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
  Loading.hide()
  return response
}, function (error) {
  Loading.hide()
  return Promise.reject(error)
})

export default axiosInstance
