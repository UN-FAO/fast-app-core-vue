<template>
  <div class="container">
    <div class="row">
      <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12 col-xl-offset-3 col-lg-offset-3 col-md-offset-3 col-sm-offset-2">
        <div class="wrap">
          <p class="form-title">
            {{$t(appName)}}
            <div class="form-subtitle"> {{$t(appPhrase)}}</div>
          </p>
          <div class="form-login">
            <div class="form-group">
              <div class="segment-title">{{$t('Admin Login')}}</div>
              <q-field>
                <q-input v-model="credentials.username" :stack-label="$t('Email')" :placeholder="$t('Email')" />
              </q-field>
            </div>
            <div class="form-group">

              <q-field>
                <q-input v-model="credentials.password" type="password" :stack-label="$t('Password')" :placeholder="$t('Password')" @keyup.enter="handleLogin" />
              </q-field>
            </div>

            <input type="submit" :value="$t('Login')" class="btn btn-success btn-sm" @click="handleLogin" />
            <br>
            <p class="text-center _new-user">
              <router-link :to="{ path: 'register' }">{{$t('New user')}}?</router-link>
            </p>
            <p class="text-center" style="color: grey !important">
              {{$t('Version')}} {{fastVersion}}
              <q-icon style="cursor:pointer;" name="fa-arrow-circle-left" color="white" @click="userLogin" />
            </p>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Auth from "modules/Auth/api/Auth";
  import {
    QField,
    QInput,
    QBtn,
    QIcon
  } from "quasar";
  import {
    FAST_VERSION,
    APP_FANTACY_NAME,
    APP_PHRASE
  } from "config/env";
  import {
    mapActions
  } from "vuex";

  export default {
    mounted() {
      this.getResources({
        appName: this.$store.state.authStore.appName
      });
    },
    components: {
      QField,
      QInput,
      QBtn,
      QIcon
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
      async handleLogin(event, done) {
        this.logingIn = true;
        this.credentials.password = this.credentials.password.trim();
        this.credentials.username = this.credentials.username.trim();
        // Try to authenticate the User
        Auth.attempt(
            this.credentials,
            this.$store.state.authStore.appURL,
            "admin"
          )
          .then(async User => {
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
      },
      userLogin() {
        this.$router.push({
          name: "login"
        });
      }
    }
  };
</script>
