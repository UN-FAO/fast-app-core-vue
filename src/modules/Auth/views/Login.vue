<template>
  <div>
  <div class="backgroundImage">
  </div>
  <div id="follow-up-main">
    <q-card  class="col-lg-4  col-lg-offset-7 col-md-4  col-md-offset-7 col-xs-10  col-xs-offset-1  col-sm-6  col-sm-offset-5 shadow-7" style="background-color: white; position: absolute; bottom: 50px; max-height: 600px; min-height: 600px">
    <div data-reactroot="" data-desktop="true" data-section="login" data-style="table" class="main-app-container container-fluid">
        <div class="login-main-container">
            <div class="login-form-container">
                <div class="login-form-holder">
                   <div class="appTitleHolder">
                    <!--<div class="fao-logo-login"></div>-->
                    <h4><!-- react-text: 28 --><!-- /react-text --><!-- react-text: 29 -->SHARP+<!-- /react-text --></h4>
                    <h5>Self-evaluation and Holistic Assessment of climate resilence of Farmers and Pastoralists</h5>
                  </div>
                    <br>
                         <div class="form-group">  
            <q-field icon="person" style="text-align: -webkit-auto;">  
               <q-input v-model="credentials.username"  
                float-label="username" />  
                </q-field>  
    </div>  
                        <div class="form-group"> 
                            <q-field icon="lock_outline" style="text-align: -webkit-auto;">  
                              <q-input v-model="credentials.password" 
                                       type="password" 
                                       float-label="password" 
                                       @keyup.enter="handleLogin" /> 
                            </q-field> 
                        </div> 
                        <p class="text-center"> 
                        <q-btn loader 
                             color="primary" 
                             @click="handleLogin"> 
                        Login 
                        <span slot="loading">Loading...</span> 
                      </q-btn> 
                    </p> 
                    <br> 
                    <p class="text-center _new-user"><router-link :to="{ path: 'register' }">New user ?</router-link></p> 
            <br> 
            <p class="text-center"> 
                <!-- react-text: 44 -->Version 
                <!-- /react-text --> 
                <!-- react-text: 45 -->{{fastVersion}} 
                <!-- /react-text --> 
            </p>     
                    <br>

                      <p class="text-center _new-user"><router-link :to="{ path: 'login' }">Back to login</router-link></p>
               </div>
            </div>
        </div>
    </div>
  </q-card>
</div>
</div>
</template>

<script>
/* eslint-disable */
import 'quasar-extras/animate/fadeIn.css'
import 'quasar-extras/animate/fadeOut.css'
import { mapMutations } from 'vuex'
import Auth from 'modules/Auth/api/Auth'
import { Platform, Loading, Toast, QCard, QCardTitle, QField, QCardMain, QInput, QBtn, QCardActions } from 'quasar'
import { mapState } from 'vuex'
import {FAST_VERSION} from 'config/env'
import {mapActions} from 'vuex'

export default {
  mounted () {
    this.getResources({
      appName: this.$store.state.authStore.appName
    })
  },
  components: {
    QCard,
    QCardTitle,
    QField,
    QCardMain,
    QInput,
    QBtn,
    QCardActions
  },
  /**
   * Computed Properties for
   * Login View
   * @type {Object}
   */
  computed: {
    /**
     * [heightSize description]
     * @return {[type]} [description]
     */
    heightSize() {
      if (Platform.is.desktop) {
        return 'items-center'
      }
      return ''
    },
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
      buttonClass: 'normal',
      credentials: {
        username: '',
        password: ''
      },
      logingIn: false,
      logInError: false,
      fastVersion: FAST_VERSION
    }
  },
  /**
   * Available methods for the
   * Login view
   * @type {Object}
   */
  methods: {
    ...mapActions(['sendOfflineData', 'getResources']),
    /**
     * Response to the login method
     * sets the layout for the App ON.
     * @return {[type]} [description]
     */
    handleLogin(event, done) {
      this.logingIn = true
      // Try to authenticate the User
      Auth.attempt(this.credentials, this.$store.state.authStore.appURL)
        .then((User) => {
          this.$store.dispatch('setUserObject', User)
          done()
          this.$router.push({
            name: 'dashboard'
          })
        })
        .catch((error) => {
          this.logingIn = false
          done()
          this.$swal(
            'Wrong Credentials!',
            'Wrong username or password...try again',
            'error'
          )
        })
    }
  }
}

</script>