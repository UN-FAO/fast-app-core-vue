<template>
  <div id="follow-up-main" class="row justify-center">
    <q-card inline class="col-lg-6 centered"  flat>
    <div data-reactroot="" data-desktop="true" data-section="login" data-style="table" class="main-app-container container-fluid">
        <div class="login-main-container">
            <div class="login-form-container">
                <div class="login-form-holder">
                   <div class="appTitleHolder">
                    <!--<div class="fao-logo-login"></div>-->
                    <h1><!-- react-text: 28 --><!-- /react-text --><!-- react-text: 29 -->SHARP+<!-- /react-text --></h1>
                    <h4>Self-evaluation and Holistic Assessment of climate resilence of Farmers and Pastoralists</h4>
                  </div>
                    <br>
                        <formio :formioURL="formioURL"
                                hashField="password" 
                                :submission="submission"
                        />     
                    <br>

                      <p class="text-center _new-user"><router-link :to="{ path: 'login' }">Back to login</router-link></p>
               </div>
            </div>
        </div>
    </div>
  </q-card>
</div>
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