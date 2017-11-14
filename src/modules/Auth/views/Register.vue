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
                        <formio :formioURL="formioURL"
                                hashField="password"
                                :submission="submission"
                        />
                    <br>

                      <p class="text-center _new-user"><router-link :to="{ path: 'login' }">Back to login</router-link></p>
               </div>
            </div>
        </div>
    </div>

  </div>
</div>
</template>

<script>
import * as Database from "database/Database";
import formio from "modules/Formio/components/formio/formio";
import { APP_URL, APP_FANTACY_NAME, APP_PHRASE } from "config/env";

export default {
  components: {
    formio
  },
  async beforeRouteEnter(to, from, next) {
    // Load the form and submission before entering the route
    let db = await Database.get();
    let formRequest = await db.forms
      .findOne()
      .where("data.name")
      .eq("userregister")
      .exec();
    let form = formRequest.data;
    next(vm => {
      // Load the form and submission before entering the route
      vm.form = form;
    });
  },
  async beforeRouteUpdate(to, from, next) {
    this.form = null;
    let db = await Database.get();
    let formRequest = await db.forms
      .findOne()
      .where("data.name")
      .eq("userregister")
      .exec();
    this.form = formRequest.data;
    next();
  },
  mounted() {
    this.mountPicture();
  },
  /**
   * Data for Login view
   * @return {[type]} [description]
   */
  data() {
    return {
      form: null,
      formioURL: APP_URL + "/userregister",
      submission: { data: "register" },
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
    mountPicture() {
      let loadStuff = function() {
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
      };
      window.addEventListener("load", loadStuff(), false);
    }
  }
};
</script>
