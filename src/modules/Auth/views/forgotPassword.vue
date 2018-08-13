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

                        <div v-if="this.hasToken()">
                          <!-- TODO we have to insert the current user information -->
                          <!-- Then we modify the formsubmission inside de formio.vue component -->
                          <formio :formURL="$FAST_CONFIG.APP_URL + '/resetpassword'"/>
                        </div>
                        <div v-else>
                          <formio :formURL="$FAST_CONFIG.APP_URL + '/sendreset'" />
                        </div>

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
import formio from 'modules/Formio/components/formio/formio';
export default {
  components: {
    formio
  },
  mounted() {
    if (this.hasToken()) {
      localStorage.removeItem('formioAppUser');
      localStorage.removeItem('formioUser');
      localStorage.setItem('formioToken', this.$route.query.token);
      // window.history.pushState({}, document.title, "/#/sendreset");
    }
  },
  data() {
    return {
      form: null
    };
  },
  methods: {
    hasToken() {
      return !!(this.$route.query.token && this.$route.query.token !== '');
    }
  }
};
</script>
