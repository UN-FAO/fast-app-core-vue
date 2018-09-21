<template>
    <div class="container">
        <div class="row">

            <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
                <div class="wrap">

                    <p class="form-title">
                        {{$FAST_CONFIG.APP_FANTACY_NAME}}
                        <div class="form-subtitle"> {{$FAST_CONFIG.APP_PHRASE}}</div>
                    </p>

                    <div class="form-login" id="registerForm">
                        <p class="text-center pull-right" style="text-decoration:underline">
                            <router-link :to="{ path: 'login' }">
                                <h5>{{$t('Back to login')}}</h5></router-link>
                        </p>
                        <br>

                         <formio
                            :form="form"
                            :options="options"
                            :language="language"
                            v-on:change="onSubmissionChange"
                            v-on:submit="onFormSubmit"
                            v-if="form && options"
                          />

                        <br>
                        <p class="text-center">
                            <router-link :to="{ path: 'login' }">
                                <h5>{{$t('Back to login')}}</h5></router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Form as vForm } from 'vue-formio';
import { OfflinePlugin, Form, Hash } from 'fast-fastjs';
import Formio from 'formiojs/Formio';
import ErrorFormatter from 'components/dataTable/submission/errorFormatter';
export default {
  components: {
    formio: vForm
  },
  data: function() {
    return {
      language: localStorage.getItem('defaultLenguage')
        ? localStorage.getItem('defaultLenguage')
        : 'en',
      activeSubmission: null
    };
  },
  mounted() {
    this.$eventHub.$on('FAST:LANGUAGE:CHANGED', this.changeLanguage);
    if (this.hasToken()) {
      localStorage.removeItem('formioAppUser');
      localStorage.removeItem('formioUser');
      localStorage.setItem('formioToken', this.$route.query.token);
      // window.history.pushState({}, document.title, "/#/sendreset");
    }
  },
  beforeDestroy() {
    this.$eventHub.$off('FAST:LANGUAGE:CHANGED', this.changeLanguage);
  },
  asyncData: {
    form: {
      get() {
        if (this.hasToken()) {
          return Form.local().findOne({
            'data.path': 'resetpassword'
          });
        } else {
          return Form.local().findOne({
            'data.path': 'sendreset'
          });
        }
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
  methods: {
    hasToken() {
      return !!(this.$route.query.token && this.$route.query.token !== '');
    },
    onSubmissionChange(event) {
      if (event.data) {
        this.activeSubmission = event.data;
      }
    },
    async onFormSubmit(event) {
      let url;
      let formSubmission = {
        data: this.activeSubmission,
        draft: false,
        redirect: true,
        trigger: 'formioSubmit',
        syncError: false
      };

      // If we are configuring the Password Reset
      // Send reset Email
      if (
        this.$route.name === 'sendreset' &&
        this.$route.query.token &&
        this.$route.query.token !== ''
      ) {
        let user = await Formio.currentUser();
        formSubmission.data = Object.assign({}, user.data, formSubmission.data);
        formSubmission.data.hashedPassword = await Hash.string(
          formSubmission.data.password
        );
        formSubmission._id = user._id;
        url = this.$FAST_CONFIG.APP_URL + '/user';
      }

      if (this.$route.name === 'sendreset' && !this.$route.query.token) {
        url = this.$FAST_CONFIG.APP_URL + '/sendreset';
      }

      let formio = new Formio(url);

      this.onlineSave(formSubmission, formio);
    },
    onlineSave(submission, formio) {
      this.$swal({
        title: 'Saving...',
        text: this.$t(
          'The information is being saved. This can take a couple seconds...'
        ),
        showCancelButton: false,
        onOpen: async () => {
          Formio.deregisterPlugin('offline');
          this.$swal.showLoading();
          formio
            .saveSubmission(submission)
            .then((updated) => {
              this.$swal.close();
              if (this.$route.name === 'sendreset') {
                this.$router.push({
                  name: 'login'
                });
              }
            })
            .catch((e) => {
              console.log(e);
              let errorString = ErrorFormatter.format({ errors: e, vm: this });
              this.$swal({
                title: e.name,
                type: 'info',
                html: errorString,
                showCloseButton: true,
                showCancelButton: false,
                confirmButtonText: 'OK'
              });
            });
        }
      });
    },
    changeLanguage(language) {
      this.language = language.code;
    }
  }
};
</script>
