<template>
    <div class="container">
        <div class="row">
            <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
                <div class="wrap">
                    <p class="form-title">
                        {{$t($FAST_CONFIG.APP_FANTACY_NAME)}}
                        <div class="form-subtitle"> {{$t($FAST_CONFIG.APP_PHRASE)}}</div>
                    </p>
                    <div class="form-login" @keyup.enter="handleLogin" >
                         <div class="segment-title">{{isAdminLogin ? $t('Admin Login'): $t('User Login')}}</div>
                      <formio
                        :form="form"
                        :options="options"
                        :language="language"
                        v-on:submit="handleLogin"
                        v-if="form && options"
                        :key="error"
                      />

                        <p class="text-center" v-if="$FAST_CONFIG.ENABLE_REGISTER">
                            <router-link :to="{ path: 'register' }">
                                <h5>{{$t('New user')}}?</h5></router-link>
                                <router-link :to="{ path: 'sendreset' }">
                                <h5>{{$t('Forgot your password?')}}</h5></router-link>
                        </p>
                        <p class="text-center" style="color: grey !important">
                            {{$t('Version')}} {{$appVersion}}
                            <q-icon name="fa-cog" color="white" @click="adminLogin" style="cursor:pointer;" v-if="!isAdminLogin" />
                            <q-icon style="cursor:pointer;" name="fa-arrow-circle-left" color="white" @click="adminLogin" v-if="isAdminLogin" />
                        </p>
                    </div>

                    <div class="sponsors">

                    </div>

                </div>
            </div>
        </div>
    </div>

</template>
<style >
.form-login label.control-label {
  font-size: medium !important;
  font-weight: 350 !important;
  color: white;
}
</style>
<script>
import { Form as vForm } from 'vue-formio';
import { Auth, OfflinePlugin, Form } from 'fast-fastjs';
import { Loading, QField, QInput, QBtn, QIcon, QSpinnerMat } from 'quasar';
export default {
  components: {
    formio: vForm,
    QField,
    QInput,
    QBtn,
    QIcon,
    QSpinnerMat
  },
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      isAdminLogin: false,
      LoadingLogIn: false,
      language: localStorage.getItem('defaultLenguage')
        ? localStorage.getItem('defaultLenguage')
        : 'en',
      error: null
    };
  },
  asyncData: {
    form: {
      get() {
        return Form.local().findOne({
          'data.path': 'user/login'
        });
      },
      transform(result) {
        return result.data;
      }
    },
    options: {
      async get() {
        let i18n = await OfflinePlugin.getLocalTranslations();
        return { i18n };
      },
      transform(result) {
        return result;
      }
    }
  },
  mounted() {
    this.$eventHub.$on('FAST:LANGUAGE:CHANGED', this.changeLanguage);
  },
  beforeDestroy() {
    this.$eventHub.$off('FAST:LANGUAGE:CHANGED', this.changeLanguage);
  },
  methods: {
    /**
     * Response to the login method
     * sets the layout for the App ON.
     * @return {[type]} [description]
     */
    handleLogin(event, done) {
      this.LoadingLogIn = true;
      this.credentials.password = event.data.password.trim();
      this.credentials.username = event.data.email.trim();
      // Try to authenticate the User
      Loading.show('Loging in...');
      Auth.attempt(
        this.credentials,
        this.$FAST_CONFIG.APP_URL,
        this.isAdminLogin ? 'admin' : undefined
      )
        .then((User) => {
          Loading.hide();
          this.$router.push({
            name: 'dashboard'
          });
        })
        .catch((error) => {
          console.log('Could not login', error);
          Loading.hide();
          this.LoadingLogIn = false;
          this.error = Math.random();
          this.$swal(
            'Wrong Credentials!',
            'Wrong username or password...try again',
            'error'
          );
        });
    },
    adminLogin() {
      this.isAdminLogin = !this.isAdminLogin;
    },
    changeLanguage(language) {
      this.language = language.code;
    }
  }
};
</script>
