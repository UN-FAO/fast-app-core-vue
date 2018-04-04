<template>
<div class="container">
    <div class="row">
        <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
            <div class="wrap">
                <p class="form-title">
                     {{$t($FAST_CONFIG.APP_FANTACY_NAME)}}
                  <div class="form-subtitle"> {{$t($FAST_CONFIG.APP_PHRASE)}}</div>
                </p>
                <div class="form-login" >
                  <div class="form-group">
                        <div class="segment-title">{{isAdminLogin ? $t('Admin Login'): $t('User Login')}}</div>
                    <q-field >
                    <q-input v-model="credentials.username"
                    :stack-label="$t('Email')" :placeholder="$t('Email')" name="Email" />
                    </q-field>
                  </div>
                  <div class="form-group">

                    <q-field>
                              <q-input v-model="credentials.password"
                                      name="password"
                                       type="password"
                                       :stack-label="$t('Password')"
                                       :placeholder="$t('Password')"
                                       @keyup.enter="handleLogin"/>
                            </q-field>
                  </div>

                <input type="submit" :value="$t('Login')" class="btn btn-success btn-sm" @click="handleLogin" name="LOGIN" />
                  <br>
                  <p class="text-center _new-user"><router-link :to="{ path: 'register' }">{{$t('New user')}}?</router-link></p>
                  <p class="text-center" style="color: grey !important">
                    {{$t('Version')}}   {{$FAST_CONFIG.FAST_VERSION}}
                     <q-icon name="fa-cog" color="white" @click="adminLogin" style="cursor:pointer;" v-if="!isAdminLogin"/>
                       <q-icon style="cursor:pointer;" name="fa-arrow-circle-left" color="white" @click="adminLogin" v-if="isAdminLogin"/>
                  </p>
                  <a href="fastapp://">Open the App!</a>
                </div>

                     <div class="sponsors" >

                     </div>

            </div>
        </div>
    </div>
</div>

</template>

<script>
import Auth from "libraries/fastjs/repositories/Auth/Auth";
import { Loading, QField, QInput, QBtn, QIcon } from "quasar";
export default {
  components: {
    QField,
    QInput,
    QBtn,
    QIcon
  },
  data() {
    return {
      credentials: {
        username: "",
        password: ""
      },
      isAdminLogin: false
    };
  },
  /**
   * Available methods for the
   * Login view
   * @type {Object}
   */
  methods: {
    /**
     * Response to the login method
     * sets the layout for the App ON.
     * @return {[type]} [description]
     */
    handleLogin(event, done) {
      this.credentials.password = this.credentials.password.trim();
      this.credentials.username = this.credentials.username.trim();
      // Try to authenticate the User
      Loading.show("Loging in...");
      Auth.attempt(
        this.credentials,
        this.$FAST_CONFIG.APP_URL,
        this.isAdminLogin ? "admin" : undefined
      )
        .then(User => {
          Loading.hide();
          this.$router.push({
            name: "dashboard"
          });
        })
        .catch(error => {
          console.log(error);
          Loading.hide();
          this.$swal(
            "Wrong Credentials!",
            "Wrong username or password...try again",
            "error"
          );
        });
    },
    adminLogin() {
      this.isAdminLogin = !this.isAdminLogin;
    }
  }
};
</script>
