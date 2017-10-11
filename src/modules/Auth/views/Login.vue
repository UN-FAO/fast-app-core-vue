<style>
#follow-up-main {
    height: 100%;
    overflow-x: hidden;
}
  [data-reactroot].main-app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
.login-main-container {
    overflow: hidden;
}

.login-main-container {
    overflow: hidden;
}
.login-main-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: visible;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-main-container {
    flex-grow: 1;
    flex-direction: column;
    text-align: center;
}
.login-form-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-main-container .big-logo {
    opacity: .25;
}
.login-main-container .big-logo {
    opacity: .15;
    display: block;
}
.login-main-container .big-logo {
    position: absolute;
    height: 1124px;
    width: 1124px;
    background-image: url("../../../statics/big-logo.png");
    display: none;
    opacity: 0;
    left: -562px;
    z-index: -1;
    text-align: center;
}


.fao-logo-login {
    height: 59px;
    width: 300px;
    background-image: url("../../../statics/login-logo.svg");
    background-size: contain;
    background-repeat: no-repeat;
}
.login-form-holder h1 {
    font-size: 41px;
    font-family: open_sanslight,sans-serif;
    margin-bottom: 20px;
}
.login-form-holder button {
    width: 100%;
    height: 45px;
}
.btn.btn-primary {
    background-color: #1976d3;
}
.q-btn {
    padding: 6px 10px;
    font-size: 13px;
    position: relative;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    -ms-border-radius: 25px;
    border-radius: 25px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: rgba(255,255,255,0);
}
body {
    font-family: open_sansregular,sans-serif;
    background-color: #f3f3f5;
    color: #333;
    overflow-x: hidden;
}
body, html {
    height: 100%;
}
</style>
<template>
  <div id="follow-up-main" class="row justify-center">
    <q-card inline class="col-lg-6" style="
       margin: auto; position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
       right: 0;" flat>
    <div data-reactroot="" data-desktop="true" data-section="login" data-style="table" class="main-app-container container-fluid">
        <div class="login-main-container">
            <div class="login-form-container">
                <div class="login-form-holder">
                    <div class="fao-logo-login"></div>
                    <h1><!-- react-text: 28 --><!-- /react-text --><!-- react-text: 29 -->Sharp+<!-- /react-text --></h1>
                    <h4>Self-evaluation and Holistic Assessment of climate resilence of Farmers and Pastoralists</h4>
                    <br>
                    <form>
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
                        <q-btn loader
                             color="primary"
                             @click="handleLogin">
                        Login
                        <span slot="loading">Loading...</span>
                      </q-btn>
                    </form>
                    <br>

                    <p class="text-center"><router-link :to="{ path: 'register' }">New user?</router-link></p>
                </div>
            </div>
            <div class="big-logo"></div>
            <p>
                <!-- react-text: 44 -->Version
                <!-- /react-text -->
                <!-- react-text: 45 -->0.1.0
                <!-- /react-text -->
            </p>
        </div>
    </div>
  </q-card>
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

export default {
  components: {
    QCard,
    QCardTitle,
    QField,
    QCardMain,
    QInput,
    QBtn,
    QCardActions
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.setLayoutNeeded(false)
      vm.setIsLoginPage(true)
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.setLayoutNeeded(false)
    this.setIsLoginPage(true)
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
      logInError: false
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
    ]),
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
          this.setLayoutNeeded(true)
          this.setIsLoginPage(false)
          this.$store.dispatch('setUserObject', User)
          done()
          this.$router.push({
            name: 'dashboard',
            params: {
              id: User.email
            }
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

<style scoped="">
h4 {
  font-weight: 300;
}
</style>
