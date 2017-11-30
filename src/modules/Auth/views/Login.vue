<template>
<div class="container">
    <div class="row">
        <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12 col-xl-offset-3 col-lg-offset-3 col-md-offset-3 col-sm-offset-2">
            <div class="pr-wrap">
                <div class="pass-reset">
                    <label>
                        Enter the email you signed up with</label>
                    <input type="email" placeholder="Email" />
                    <input type="submit" value="Submit" class="pass-reset-submit btn btn-success btn-sm" />
                </div>
            </div>
            <div class="wrap">
                <p class="form-title">
                    {{appName}}
                  <div class="form-subtitle"> {{appPhrase}}</div>
                </p>


                <div class="form-login" >
                  <div class="form-group">
                    <label class="control-label" >{{$t('Username')}}</label>
                    <input type="text" v-model="credentials.username"  :placeholder="$t('Username')" />
                  </div>
                  <div class="form-group">
                    <label class="control-label" >{{$t('Password')}}</label>
                    <input type="password" v-model="credentials.password" :placeholder="$t('Password')" />
                  </div>

                <input type="submit" :value="$t('Login')" class="btn btn-success btn-sm" @click="handleLogin" />
                  <br>
                  <p class="text-center _new-user"><router-link :to="{ path: 'register' }">{{$t('New user')}}?</router-link></p>
                </div>
            </div>
        </div>
    </div>
</div>

</template>


<script>
import Auth from "modules/Auth/api/Auth";
import { QField, QInput, QBtn } from "quasar";
import { FAST_VERSION, APP_FANTACY_NAME, APP_PHRASE } from "config/env";
import { mapActions } from "vuex";

export default {
  mounted() {
    this.getResources({
      appName: this.$store.state.authStore.appName
    });
  },
  components: {
    QField,
    QInput,
    QBtn
  },
  /**
   * Data for Login view
   * @return {[type]} [description]
   */
  data() {
    return {
      buttonClass: "normal",
      credentials: {
        username: "",
        password: ""
      },
      logingIn: false,
      logInError: false,
      fastVersion: FAST_VERSION,
      appName: APP_FANTACY_NAME,
      appPhrase: APP_PHRASE
    };
  },
  /**
   * Available methods for the
   * Login view
   * @type {Object}
   */
  methods: {
    ...mapActions(["sendOfflineData", "getResources"]),
    /**
     * Response to the login method
     * sets the layout for the App ON.
     * @return {[type]} [description]
     */
    handleLogin(event, done) {
      this.logingIn = true;
      this.credentials.password = this.credentials.password.trim();
      this.credentials.username = this.credentials.username.trim();
      // Try to authenticate the User
      Auth.attempt(this.credentials, this.$store.state.authStore.appURL)
        .then(User => {
          this.$store.dispatch("setUserObject", User);
          this.$router.push({
            name: "dashboard"
          });
        })
        .catch(error => {
          console.log(error);
          this.logingIn = false;
          this.$swal(
            "Wrong Credentials!",
            "Wrong username or password...try again",
            "error"
          );
        });
    }
  }
};
</script>
