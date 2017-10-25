import axios from 'axios'
import {HEARTBEAT_URL} from 'config/env'
import _ from 'lodash'

let isOnline = window.navigator.onLine
let tabVisible = window.navigator.tabVisible

const Connection = class {
  static check () {
    let dHeartBeat = _.debounce(this.heartBeat, 3000)
    return dHeartBeat
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

  static isTabInUse () {
    return tabVisible
  }

  static isOnline () {
    return isOnline
  }

  static tabInUse () {
    return tabVisible
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
  static listenPageInUse () {
    var vis = (function() {
    var stateKey,
        eventKey,
        keys = {
                hidden: 'visibilitychange',
                webkitHidden: 'webkitvisibilitychange',
                mozHidden: 'mozvisibilitychange',
                msHidden: 'msvisibilitychange'
    }
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey]
            break
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c)
        return !document[stateKey]
    }
})()

vis(function() {
    if (vis()) {
      setTimeout(function() {
            tabVisible = true
        }, 300)
    } else {
        tabVisible = false
    }
})

var notIE = (document.documentMode === undefined),
    isChromium = window.chrome
      
if (notIE && !isChromium) {
    // checks for Firefox and other  NON IE Chrome versions
    window.on('focusin', function () {
        setTimeout(function() {
            tabVisible = true
        }, 300)
    }).on('focusout', function () {
        tabVisible = false
    })
} else {
    // checks for IE and Chromium versions
    if (window.addEventListener) {
        // bind focus event
        window.addEventListener('focus', function (event) {
            // tween resume() code goes here
            setTimeout(function() {
                 tabVisible = true
            }, 300)
        }, false)

        // bind blur event
        window.addEventListener('blur', function (event) {
             tabVisible = false
        }, false)
    } else {
        window.attachEvent('focus', function (event) {
            // tween resume() code goes here
            setTimeout(function() {
                 tabVisible = true
            }, 300)
        })

        // bind focus event
        window.attachEvent('blur', function (event) {
            tabVisible = false
        })
    }
}
  }
}
export default Connection
