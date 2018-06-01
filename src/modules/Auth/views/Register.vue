<template>
<div class="container">
    <div class="row">
        <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
            <div class="wrap">
                <p class="form-title">
                    {{$FAST_CONFIG.APP_FANTACY_NAME}}
                 <div class="form-subtitle"> {{$FAST_CONFIG.APP_PHRASE}}</div>
                </p>


                <div class="form-login" id="registerForm" >
                  <br>
                        <formio
                          :formURL="$FAST_CONFIG.APP_URL + '/userregister'"
                          hashField="password"
                        />
                    <br>
                <p class="text-center"><router-link :to="{ path: 'login' }">{{$t('Back to login')}}</router-link></p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import formio from "modules/Formio/components/formio/formio";
export default {
  components: {
    formio
  },
  data() {
    return {
      form: null
    };
  }
};
</script>
