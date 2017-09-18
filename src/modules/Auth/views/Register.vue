<template>
<q-transition appear
              group
              enter="fadeIn"
              leave="fadeOut">
  <div class="row justify-center">
    <q-card class="col-md-6 col-sm-8 col-lg-5 text-white"
            id="login"
            key="login-container">
      <q-card-title class="card-title bg-primary text-center">
        <div class="row"
             style="display: block">
          <img src="statics/fao-logo-white.png"
               style="width: 60%; height: 50%">
        </div>
        <h4 style="color:white; text-transform: uppercase;">FAST POC</h4>
      </q-card-title>
      <q-card-main>
        <formio :formioURL="formioURL"
                hashField="password"></formio>
        <div class="col-md-12 col-lg-12 justify-center">
          <router-link :to="{ path: 'login' }">Back to login</router-link>
        </div>
      </q-card-main>
    </q-card>
  </div>
</q-transition>

</template>

<script>
/* eslint-disable */
import { mapMutations } from 'vuex'
import Auth from 'modules/Auth/api/Auth'
import { Platform, Loading, Toast, QCard, QCardTitle, QField, QCardMain, QInput, QBtn, QCardActions } from 'quasar'
import { mapState } from 'vuex'
import Formio from 'modules/Formio/api/Formio'
import * as Database from 'database/Database';
import _clone from 'lodash/clone'
import md5 from 'md5';
import { MD5_KEY } from 'config/env';
import formio from 'modules/Formio/components/formio'
import { APP_URL } from 'config/env'

export default {
  components: {
    QCard,
    QCardTitle,
    QField,
    QCardMain,
    QInput,
    QBtn,
    QCardActions,
    formio
  },
  async beforeRouteEnter(to, from, next) {
    // Load the form and submission before entering the route
    let db = await Database.get()
    let formRequest = await db.forms.findOne().where('data.name').eq('userregister').exec()
    let form = formRequest.data
    console.log('form => ', form)
    next(vm => {
      // Load the form and submission before entering the route
      vm.form = form
    })
  },
  async beforeRouteUpdate(to, from, next) {
    this.form = null
    let formRequest = await db.forms.findOne().where('data.name').eq('userregister').exec()
    this.form = formRequest.data
    console.log('this.form => ', this.form)
    next()
  },
  /**
   * Computed Properties for
   * Login View
   * @type {Object}
   */
  computed: {
    /**
     * [description]
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    ...mapState({
          userStore: state => state.userStore
    })
  },
  /**
   * Data for Login view
   * @return {[type]} [description]
   */
  data() {
    return {
      form: null,
      formioURL: APP_URL + '/userregister'
    }
  },
  /**
   * Available methods for the
   * Login view
   * @type {Object}
   */
  methods: {
    /**
     * Map layout methods for the theme
     */
    ...mapMutations([
          'setLayoutNeeded',
          'setIsLoginPage'
    ])
  }
}

</script>

<style scoped="">
.card {
  margin-bottom: 0px;
}

.card-content {
  min-height: 160px;
}

button {
  margin-bottom: 4%;
}

h4 {
  font-weight: 300;
}
</style>
