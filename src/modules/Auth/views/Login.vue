<template>
<q-transition appear group enter="fadeIn" leave="fadeOut">
  <div class="row justify-center" >
    <q-card class="col-md-6 col-sm-8 col-lg-5 text-white" id="login" key="login-container">

      <q-card-title class="card-title bg-primary text-center">
      <div class="row" style="display: block">
      <img src="statics/fao-logo-white.png" style="width: 60%; height: 50%">
      </div>
        <h4 style="color:white; text-transform: uppercase;"> Plant Breeding Capacity Analysis</h4>
      </q-card-title>
        <q-card-main>
          <q-field
            icon="person"
            helper="type your username ( i.e: 'myUsername@fao.org')"
          >
            <q-input v-model="credentials.username" float-label="username" />
          </q-field>
          <q-field
            icon="lock_outline"
            helper="type your secret password"
          >
            <q-input v-model="credentials.password" type="password" float-label="password" @keyup.enter="handleLogin" />
          </q-field>
          <div class="col-md-12 col-lg-12 justify-center">
          <router-link  :to="{ path: 'register' }">You dont have an account?</router-link>
          </div>
        </q-card-main>
        
        <q-card-actions class="justify-center">
          <q-btn loader color="primary" @click="handleLogin">
            Login
            <span slot="loading">Loading...</span>
          </q-btn>
        </q-card-actions>
    </q-card>
</div>
</q-transition>
</template>

<script>
  /* eslint-disable */
  import 'quasar-extras/animate/fadeIn.css'
  import 'quasar-extras/animate/fadeOut.css'
  import { mapMutations } from 'vuex'
  import Auth from 'modules/Auth/api/Auth'
  import { Platform, Loading, Toast, QCard, QCardTitle, QField, QCardMain, QInput,QBtn, QCardActions  } from 'quasar'
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
     mounted () {
    },
     beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.setLayoutNeeded(false)
         vm.setIsLoginPage(true)
      });
    },
    beforeRouteUpdate (to, from, next) {
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
      heightSize (){
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
    data () {
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
      ...mapMutations(['setLayoutNeeded', 'setIsLoginPage']),
      /**
       * Response to the login method
       * sets the layout for the App ON.
       * @return {[type]} [description]
       */
      handleLogin (event, done) {
        this.logingIn = true
        //Try to authenticate the User
        Auth.attempt(this.credentials, this.$store.state.authStore.appURL)
          .then((User) => {
            this.setLayoutNeeded(true)
            this.setIsLoginPage(false)
            this.$store.dispatch('setUserObject', User)
            done()
            this.$router.push({name: 'dashboard', params: {id: User.email}})
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
<style scoped>

  h4 {
    font-weight: 300;
  }
</style>
