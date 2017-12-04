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
                  <br>
                        <formio :formioURL="formioURL"
                                hashField="password"
                                :submission="submission"
                        />
                    <br>
                <p class="text-center _new-user"><router-link :to="{ path: 'login' }">{{$t('Back to login')}}</router-link></p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import formio from "modules/Formio/components/formio/formio";
import { APP_URL, APP_FANTACY_NAME, APP_PHRASE } from "config/env";

export default {
  components: {
    formio
  },
  data() {
    return {
      form: null,
      formioURL: APP_URL + "/userregister",
      submission: { data: "register" },
      appName: APP_FANTACY_NAME,
      appPhrase: APP_PHRASE
    };
  }
};
</script>
