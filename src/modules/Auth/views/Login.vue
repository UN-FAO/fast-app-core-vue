<template>
  <div class="container">
    <div class="row">
      <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
        <div class="wrap">
          <p class="form-title">{{$t($FAST_CONFIG.APP_FANTACY_NAME)}}</p>
          <div class="form-subtitle">{{$t($FAST_CONFIG.APP_PHRASE)}}</div>
          <div class="form-login" @keyup.enter="handleLogin">
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
                <h5>{{$t('New user')}}?</h5>
              </router-link>
              <router-link :to="{ path: 'sendreset' }">
                <h5>{{$t('Forgot your password?')}}</h5>
              </router-link>
            </p>
            <p class="text-center" style="color: grey !important">
              {{$t('Version')}} {{$appVersion}}
             
            </p>
          </div>
          <div class="sponsors"></div>
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
import { Form as vForm } from "vue-formio";
import { Auth, Translation, Form } from "fast-fastjs";
import { Loading, QField, QInput, QBtn, QIcon, QSpinnerMat } from "quasar";
import createSubmission from "components/createSubmission";

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
        username: "",
        password: ""
      },
      isAdminLogin: false,
      LoadingLogIn: false,
      language: localStorage.getItem("defaultLenguage")
        ? localStorage.getItem("defaultLenguage")
        : "en",
      error: null
    };
  },
  asyncData: {
    form: {
      get() {
        return Form.local()
          .where("data.path", "=", "user/login")
          .first();
      },
      transform(result) {
        return result.data;
      }
    },
    options: {
      async get() {
        let i18n = await Translation.getFormTranslations();
        return { i18n };
      },
      transform(result) {
        return result;
      }
    }
  },
  mounted() {
    this.$eventHub.$on("FAST:LANGUAGE:CHANGED", this.changeLanguage);
  },
  beforeDestroy() {
    this.$eventHub.$off("FAST:LANGUAGE:CHANGED", this.changeLanguage);
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
      this.credentials.username = event.data.username
        ? event.data.username.trim()
        : event.data.email.trim();
      this.credentials.email = this.credentials.username;
      // Try to authenticate the User
      Loading.show("Loging in...");
      Auth.attempt(
        this.credentials,
        this.$FAST_CONFIG.APP_URL,
        this.isAdminLogin ? "admin" : undefined
      )
        .then(async User => {
          Loading.hide();
          let route = { name: "dashboard" };
          let plantVillageInfo = localStorage.getItem("plantVillageScounting");
          if (plantVillageInfo) {
            try {
               plantVillageInfo = JSON.parse(atob(plantVillageInfo));
                route = await createSubmission.withData({
                  email: Auth.email(),
                  appUrl: this.$FAST_CONFIG.APP_URL,
                  path: "scoutingtraps",
                  parent: this.$route.query.parent,
                  data: plantVillageInfo.data ? plantVillageInfo.data : null,
                  _id: plantVillageInfo._id ? plantVillageInfo._id : null
                });

                localStorage.removeItem("plantVillageScounting");
            } catch (error) {
              this.$swal(
                "Submission Format Error",
                "The data that you are trying to import is not formatted properly",
                "error"
              );
            }
          }

          this.$router.push(route);
        })
        .catch(error => {
          console.log("Could not login", error);
          Loading.hide();
          this.LoadingLogIn = false;
          this.error = Math.random();
          this.$swal(
            "Wrong Credentials!",
            "Wrong username or password...try again",
            "error"
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
