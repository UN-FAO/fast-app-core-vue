import Vue from 'vue'
import Vuex from 'vuex'

import authStore from 'modules/Auth/vuex/store'
import FormioStore from 'modules/Formio/vuex/store'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    authStore,
    FormioStore
  },
  strict: debug
})
