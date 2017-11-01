<template>
<q-transition appear
              group
              enter="fadeIn"
              leave="fadeOut">
  <div class="row justify-center">
    <q-card class="col-lg-6"
            id="login"
            key="login-container" flat>
      <q-card-title class="card-title text-center">
        <div class="login-form-holder">
            <h1><!-- react-text: 28 --><!-- /react-text --><!-- react-text: 29 -->SHARP+<!-- /react-text --></h1>
            <h4>Self-evaluation and Holistic Assessment of climate resilence of Farmers and Pastoralists</h4>
            <br>
            <h4 style="color:black;">Register</h4>
        </div>
      </q-card-title>
      <q-card-main>
        <formio :formioURL="formioURL"
                hashField="password" 
                :submission="submission"
        />
        <div class="col-md-12 col-lg-12 justify-center _backlink">
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
import formio from 'modules/Formio/components/formio/formio'
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
      formioURL: APP_URL + '/userregister',
      submission: {data: 'register'}
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

<style scoped>
    
    .formio-form {text-align: center;}
    
    h1 {font-size: 3em; margin-bottom: 0.2em; color: #065276;}
    h4 {font-size: 1.7em; color: #065276;}
    
    .q-card-main {width: 50%; margin: 0 auto;}
    
    .btn {box-shadow: none !important; border-radius: 0px; font-size: 15px; min-width: 150px;}
    .btn-primary {margin-top: 20px;}
    
    .help-block {font-size:1em;}
    
    label {font-weight: normal;}
    
    ._backlink {text-align: center; margin-top: 2em;}
    ._backlink a {border-bottom: 1px solid #c3c7ca; padding: 0px 10px 5px; font-size: 1em;}    
    
</style>
