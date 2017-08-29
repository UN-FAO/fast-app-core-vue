<template>
  <div class="flex justify-center full-height" :class="heightSize">
    <div class="card text-white text-center width-3of4 bg-width-2of5 gt-bg-width-1of4 sm-auto " id="login">

      <div class="card-title" :class="finalBgColor">

        <h4 style="color:white"> REGISTRATION</h4>
      </div>
      <div class="card-content bg-white ">
        <div ref="registerForm">

        </div>
        <div>
          <router-link :to="{ path: 'login' }">Back to login</router-link>
        </div>
      </div>
      <div class="card-actions inline-block vertical-middle">
        <button :disabled='!isFormValid()' @click="handleRegister()" v-show="!this.logingIn" class="teal fit"
                :class="buttonClass">Register
        </button>
      </div>
      <div class="card-actions inline-block vertical-middle">
        <!-- <button class="red fit" :class="buttonClass" @click="login()">Login Google</button> -->
        <!--  <button class="blue fit" :class="buttonClass" @click="login()">Login Facebook</button> -->
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import {mapMutations} from 'vuex'
  import Auth from 'modules/Auth/api/Auth'
  import {Platform, Loading, Toast} from 'quasar'
  import {mapState} from 'vuex'
  import Formio from 'modules/Formio/api/Formio'
  import * as Database from 'database/Database';
  import _clone from 'lodash/clone'
  import md5 from 'md5';
  import {MD5_KEY} from 'config/env';


  export default {
    mounted() {
      this.formContainer = new FormioForm(this.$refs.registerForm);
      this.getRegisterForm();
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
       * [finalBgColor description]
       * @return {[type]} [description]
       */
      finalBgColor() {
        return `bg-blue-6`
      },
      /**
       * [description]
       * @param  {[type]} state [description]
       * @return {[type]}       [description]
       */
      ...mapState({
        userStore: state => state.userStore
      }),
    },
    /**
     * Data for Login view
     * @return {[type]} [description]
     */
    data() {
      return {
        buttonClass: 'normal',
        credentials: {
          email: '',
          password: ''
        },
        logingIn: false,
        logInError: false,
        formContainer: {}
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

      isFormValid() {

        //let errors = this.formContainer.showErrors();
        let emptyErrors = Formio.getEmptyErrors(this.formContainer);

        return emptyErrors.length === 0

      },
      /**
       * Response to the login method
       * sets the layout for the App ON.
       * @return {[type]} [description]
       */
      handleRegister() {
        console.log('Handle register')

        const isValid = this.isFormValid();
        if (isValid) {

          let values = Object.assign({}, this.formContainer.data);
          let formio = Object.assign({}, this.formContainer.formio);
          values.hashedPassword = md5(values.password, MD5_KEY)

          console.log('About to store user locally')
          console.log(values)

          this.$store.dispatch('storeUserLocally', {data: values, sync: false, formio: formio})
            .then(() => {
              this.formContainer.reset();
              this.$router.push({path: '/login'})
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          this.$swal(
            'Oops...',
            'There are errors in the form. Check the required fields',
            'error'
          )

        }

      },

      async getRegisterForm() {

        let db = await Database.get();
        let formRequest = await db.forms.findOne().where('data.name').eq('userRegister').exec();
        let form = formRequest.data;
        //form.components = this.setTranslations(form.components)
        this.formContainer.form = {components: form.components}
        this.formContainer.formio = {}
        this.formContainer.formio.formUrl = 'https://' + form.machineName.substring(0, form.machineName.indexOf(":")) + '.form.io/' + form.path;


      }
    }
  }
</script>
<style scoped>
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
