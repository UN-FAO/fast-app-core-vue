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
                            v-on:submit="submit"
                            v-if="form && options"
                            :key="key"
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
import { Form, User, Hash, Translation } from 'fast-fastjs';
import to from 'await-to-js';
import _debounce from 'lodash/debounce'
export default {
  components: {
    formio: vForm
  },
  data() {
    return {
      language: localStorage.getItem('defaultLenguage')
        ? localStorage.getItem('defaultLenguage')
        : 'en',
      key: Math.random()
    };
  },
  asyncData: {
    form: {
      get() {
        return Form.local()
          .where('data.path', '=', 'userregister')
          .first();
      },
      transform(result) {
        return result.data;
      }
    },
    options: {
      async get() {
        let i18n = (await Translation.local().first()).data;

        return { i18n };
      },
      transform(result) {
        return result;
      }
    }
  },
  created() {
    this.submit = _debounce(this.submit, 1000)
  },
  methods: {
    async submit(event) {
      event.data.hashedPassword = await Hash.string(event.data.password);

      let [error, user] = await to(
        User.storeLocally({
          data: event.data,
          sync: false,
          path: 'userregister'
        })
      );

      if (error) {
        console.log(error);
        this.$swal(
          this.$t('Email already taken'),
          this.$t('That email is already taken. Try a different one'),
          'error'
        );
        this.key = Math.random();
      }

      if (user) {
        this.$router.push({ path: 'login' });
      }
    },
    changeLanguage(language) {
      this.language = language.code;
    }
  }
};
</script>
