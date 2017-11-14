<template>
  <div>
<header class="post-header">
</header>
  <div class="post-body col-xl-4 col-lg-4 col-md-5 col-sm-6 col-xs-12 pull-right shadow-4">
      <div data-reactroot="" data-desktop="true" data-section="login" data-style="table" class="main-app-container container-fluid">
        <div class="login-main-container">
            <div class="login-form-container">
                <div class="login-form-holder">
                   <div class="appTitleHolder">
                    <!--<div class="fao-logo-login"></div>-->
                    <h4><!-- react-text: 28 --><!-- /react-text --><!-- react-text: 29 -->{{appName}}<!-- /react-text --></h4>
                    <h5 style="color: #0e6da5">{{appPhrase}}</h5>
                  </div>
                    <br>
                         <div class="form-group">
            <q-field icon="person" style="text-align: -webkit-auto;">
               <q-input v-model="credentials.username"
                stack-label="username" style="border-bottom: 1px solid;" />
                </q-field>
    </div>
                        <div class="form-group">
                            <q-field icon="lock_outline" style="text-align: -webkit-auto;">
                              <q-input v-model="credentials.password"
                                       type="password"
                                       stack-label="password"
                                       @keyup.enter="handleLogin" style="border-bottom: 1px solid;" />
                            </q-field>
                        </div>
                        <p class="text-center">
                        <q-btn loader
                             color="white"
                             style="border: #0E6DA5 solid 1px; color: #0e6da5 !important;"
                             @click="handleLogin">
                        Login
                        <span slot="loading">Load...</span>
                      </q-btn>
                    </p>
                    <br>
                    <p class="text-center _new-user"><router-link :to="{ path: 'register' }">New user ?</router-link></p>
            <br>
            <p class="text-center" style="color: grey !important">
                <!-- react-text: 44 -->Version
                <!-- /react-text -->
                <!-- react-text: 45 -->{{fastVersion}}
                <!-- /react-text -->
            </p>
               </div>
            </div>
        </div>
    </div>

  </div>
</div>
</template>

<script>
import Auth from "modules/Auth/api/Auth";
import { QField, QInput, QBtn } from "quasar";
import { FAST_VERSION, APP_FANTACY_NAME, APP_PHRASE } from "config/env";
import { mapActions } from "vuex";

export default {
  mounted() {
    this.getResources({
      appName: this.$store.state.authStore.appName
    });
    this.mountPicture();
  },
  components: {
    QField,
    QInput,
    QBtn
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
    mountPicture() {
      var win, doc, img, header, enhancedClass;
      // Quit early if older browser (e.g. IE8).
      if (!("addEventListener" in window)) {
        return;
      }
      win = window;
      doc = win.document;
      img = new Image();
      header = doc.querySelector(".post-header");
      enhancedClass = "post-header-enhanced";

      // Rather convoluted, but parses out the first mention of a background
      // image url for the enhanced header, even if the style is not applied.
      var bigSrc = (function() {
        // Find all of the CssRule objects inside the inline stylesheet
        var styles = doc.querySelector("style").sheet.cssRules;
        // Fetch the background-image declaration...
        var bgDecl = (function() {
          // ...via a self-executing function, where a loop is run
          var bgStyle,
            i,
            l = styles.length;
          for (i = 0; i < l; i++) {
            // ...checking if the rule is the one targeting the
            // enhanced header.
            if (
              styles[i].selectorText &&
              styles[i].selectorText === "." + enhancedClass
            ) {
              // If so, set bgDecl to the entire background-image
              // value of that rule
              bgStyle = styles[i].style.backgroundImage;
              // ...and break the loop.
              break;
            }
          }
          // ...and return that text.
          return bgStyle;
        })();
        // Finally, return a match for the URL inside the background-image
        // by using a fancy regex i Googled up, if the bgDecl variable is
        // assigned at all.
        return bgDecl && bgDecl.match(/(?:\(['|"]?)(.*?)(?:['|"]?\))/)[1];
      })();

      // Assign an onLoad handler to the dummy image *before* assigning the src
      header.className += " " + enhancedClass;

      // Finally, trigger the whole preloading chain by giving the dummy
      // image its source.
      if (bigSrc) {
        img.src = bigSrc;
      }
    },
    /**
     * Response to the login method
     * sets the layout for the App ON.
     * @return {[type]} [description]
     */
    handleLogin(event, done) {
      this.logingIn = true;
      this.credentials.password = this.credentials.password.trim();
      this.credentials.username = this.credentials.username.trim();
      // Try to authenticate the User
      Auth.attempt(this.credentials, this.$store.state.authStore.appURL)
        .then(User => {
          this.$store.dispatch("setUserObject", User);
          done();
          this.$router.push({
            name: "dashboard"
          });
        })
        .catch(error => {
          console.log(error);
          this.logingIn = false;
          done();
          this.$swal(
            "Wrong Credentials!",
            "Wrong username or password...try again",
            "error"
          );
        });
    }
  }
};
</script>
