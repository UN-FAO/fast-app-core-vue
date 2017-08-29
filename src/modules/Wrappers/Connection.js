import axios from 'axios'
import {HEARTBEAT_URL} from 'config/env'

let isOnline = window.navigator.onLine

const Connection = class {
  static check () {
    return this.heartBeat
  }

  /**
   * [status description]
   * @return {Promise} [description]
   */
  static initEventListeners (vm) {
    let self = this
    window.addEventListener('online', function () {
      console.log('App is now online')
      self.setOnline(vm)
    })

    window.addEventListener('offline', function () {
      console.log('App is now offline')
      self.setOffline(vm)
    })
  }

  static setOnline (vm) {
    if (!isOnline) {
      isOnline = true
      vm && vm.$eventHub.$emit('connectionStatusChanged', isOnline)
    }
  }

  static setOffline (vm) {
    if (isOnline) {
      isOnline = false
      vm && vm.$eventHub.$emit('connectionStatusChanged', isOnline)
    }
  }

  static isOnline () {
    return isOnline
  }

  static heartBeat (vm) {
    return axios.get(HEARTBEAT_URL)
      .then(() => {
        this.setOnline.bind(this)(vm)
        return isOnline
      })
      .catch(() => {
        this.setOffline.bind(this)(vm)
        return isOnline
      })
  }
}

export default Connection
