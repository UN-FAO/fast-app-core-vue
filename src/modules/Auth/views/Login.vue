<template>
  <div>
<header class="post-header">
</header>
  <div class="post-body col-xl-4 col-lg-4 col-md-5 col-sm-6 col-xs-12 pull-right">
      <div data-reactroot="" data-desktop="true" data-section="login" data-style="table" class="main-app-container container-fluid"> 
        <div class="login-main-container"> 
            <div class="login-form-container"> 
                <div class="login-form-holder"> 
                   <div class="appTitleHolder"> 
                    <!--<div class="fao-logo-login"></div>--> 
                    <h4><!-- react-text: 28 --><!-- /react-text --><!-- react-text: 29 -->SHARP+<!-- /react-text --></h4> 
                    <h5 style="color: #0e6da5">Self-evaluation and Holistic Assessment of climate resilence of Farmers and Pastoralists</h5> 
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
/* eslint-disable */
import 'quasar-extras/animate/fadeIn.css'
import 'quasar-extras/animate/fadeOut.css'
import { mapMutations } from 'vuex'
import Auth from 'modules/Auth/api/Auth'
import { Platform, Loading, Toast, QCard, QCardTitle, QField, QCardMain, QInput, QBtn, QCardActions } from 'quasar'
import { mapState } from 'vuex'
import {FAST_VERSION} from 'config/env'
import {mapActions} from 'vuex'

export default {
  mounted () {
    this.getResources({
      appName: this.$store.state.authStore.appName
    })
    this.mountPicture()
  },
  components: {
    QCard,
    QCardTitle,
    QField,
    QCardMain,
    QInput,
    QBtn,
    QCardActions
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
     * [description]
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    ...mapState({
          userStore: state => state.userStore
    })
  },
  /**
   * Data for Login view
   * @return {[type]} [description]
   */
  data() {
    return {
      buttonClass: 'normal',
      credentials: {
        username: '',
        password: ''
      },
      logingIn: false,
      logInError: false,
      fastVersion: FAST_VERSION
    }
  },
  /**
   * Available methods for the
   * Login view
   * @type {Object}
   */
  methods: {
    ...mapActions(['sendOfflineData', 'getResources']),
    mountPicture(){
     let loadStuff = function ()  {
      var win, doc, img, header, enhancedClass
      // Quit early if older browser (e.g. IE8).
      if (!('addEventListener' in window)) {
        return
      }
      win = window
      doc = win.document
      img = new Image()
      header = doc.querySelector('.post-header')
      enhancedClass = 'post-header-enhanced'

      // Rather convoluted, but parses out the first mention of a background
      // image url for the enhanced header, even if the style is not applied.
      var bigSrc = (function() {
        // Find all of the CssRule objects inside the inline stylesheet 
        var styles = doc.querySelector('style').sheet.cssRules
        // Fetch the background-image declaration...
        var bgDecl = (function() {
          // ...via a self-executing function, where a loop is run
          var bgStyle, i, l = styles.length
          for (i = 0; i < l; i++) {
            // ...checking if the rule is the one targeting the
            // enhanced header.
            if (styles[i].selectorText &&
              styles[i].selectorText == '.' + enhancedClass) {
              // If so, set bgDecl to the entire background-image
              // value of that rule
              bgStyle = styles[i].style.backgroundImage
              // ...and break the loop.
              break
            }
          }
          // ...and return that text.
          return bgStyle
        }())
        // Finally, return a match for the URL inside the background-image
        // by using a fancy regex i Googled up, if the bgDecl variable is
        // assigned at all.         
        return bgDecl && bgDecl.match(/(?:\(['|"]?)(.*?)(?:['|"]?\))/)[1]
      }())

      // Assign an onLoad handler to the dummy image *before* assigning the src
      header.className += ' ' + enhancedClass

      // Finally, trigger the whole preloading chain by giving the dummy
      // image its source.
      if (bigSrc) {
        img.src = bigSrc
      }
    }
      window.addEventListener('load', loadStuff(), false)
    },
    /**
     * Response to the login method
     * sets the layout for the App ON.
     * @return {[type]} [description]
     */
    handleLogin(event, done) {
      this.logingIn = true
      // Try to authenticate the User
      Auth.attempt(this.credentials, this.$store.state.authStore.appURL)
        .then((User) => {
          this.$store.dispatch('setUserObject', User)
          done()
          this.$router.push({
            name: 'dashboard'
          })
        })
        .catch((error) => {
          this.logingIn = false
          done()
          this.$swal(
            'Wrong Credentials!',
            'Wrong username or password...try again',
            'error'
          )
        })
    }
  }
}

</script>

<style>
 body {
  font-family: Georgia, Times New Roman, serif;
  line-height: 1.5;
  margin: 0;
}

header,
section,
article,
footer,
aside,
figure {
  display: block;
}

.post-lede {
  font-family: Avenir Next, SegoeUI, Franklin Gothic, arial, sans-serif;
  font-size: 1.25em;
  font-weight: 500;
}

.post-body p {
  margin: 0;
}

.post-body p + p {
  margin-top: 1.5em;
}

.post-body {
    box-sizing: border-box;
    max-width: 50em;
    /* width: 40vh; */
    font-size: 1.125em;
    margin: -80vh 2vw 2em auto;
    padding: 5%;
    position: relative;
    background-color: #fff;
}

.post-title {
  font-family: Avenir Next, SegoeUI, Franklin Gothic, arial, sans-serif;
  text-align: center;
  text-shadow: 0 0 .5em rgba(0, 0, 0, 0.6);
  font-size: calc(1em + 5vw);
  margin: auto auto 23vw;
  padding: .5em;
  color: #fff;
}

.post-header {
  overflow: hidden;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  height: calc(100vh - 50px);
  margin: 0 auto;
  background-color: #567DA7;
  background-size: cover;
  background-position: 50% 0;
  background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMDAwMDAwQEBAQFBQUFBQcHBgYHBwsICQgJCAsRCwwLCwwLEQ8SDw4PEg8bFRMTFRsfGhkaHyYiIiYwLTA+PlQBAwMDAwMDBAQEBAUFBQUFBwcGBgcHCwgJCAkICxELDAsLDAsRDxIPDg8SDxsVExMVGx8aGRofJiIiJjAtMD4+VP/AABEIACEAMgMBIgACEQEDEQH/xACYAAACAwADAQAAAAAAAAAAAAAABgcICQIDBQQQAAEDAwMCAwQFDQAAAAAAAAECAwQABREGBxIhMRNBUQgUIzYzNHODshUiJDI1UnV2kbO0wcIBAAMBAQEAAAAAAAAAAAAAAAQFBgMBAhEAAgEDAQMICwEAAAAAAAAAAQIDAAQREhMxMhUzQVFxcoGSBRQhIlJTVIKhsdHS/9oADAMBAAIRAxEAPwC50/dl0SkNWoBmK2pxPFwcnF8R3PKvvt+6zkgoRJaYWQroQMVQTby9zFRpaZlxW+6iS4lwrcK+COycE4J5Y5V7Oqt3bNpqN7vbnGpdydBDbYWFIawcFbpHmP3Korq1sEgYMAqgYzualUfrbz6FJY58KnnUe8t4h6gTZrpIajSX32wy2l4Bt5C1ZSoA4qc4e9Gm4NtJkvyZkhAKlojslfQehPEHArIfXF4ul5bsbr8jx1iRK/Sycj4nFSgs+RHcD0p4kbm3nT8G0xY6Ahl2JxE7IeU4UfmrKevf1zUYlrFbOJYpHbOfdY5qjtrQBys2TjG7pNa86l3C0vpWwsXq5TfAYfZ5xkYPiyVqAKWWW+63FZ6Jpetm4U93Stvu1ws70OXdAkM29BC30rPTi7kgJIyOlUGRuVeGrpZdXXy9Q76Ya3kBhbPJyBGDYLb0dhJOHF4IKqZNEe0+5rLX8CxvWvwGn5xjNLaa4ONoeOEKWMmuzzzhGkQR6VUk6mwcjqoWeN4XRBFI+o4JQZ09tWkeu+6Tjzi0Wbw0qWSlBWySkE9sk0VJ4sCcfXHj/Sip7leX6f8AI/lYbB/iNY53bRWlXtT3GAxq6dNfW8lmNFtzXD3sK5BOXV4Rz4pOSAQT0FRnrvTSdDTosSOuU4y7EjvLccThIccTy49gAePXHetJtudB2bQOnosKLHacmhpHvMkoypxafQqKiEgk4FPlytNu1Xbnrbeo7EuMvHFp5IUAtJ5JKc9eQPUYqwk28g1TTNIcdgoqKZIjhI1Xd2+yskzb77Ms9nTChzHE3GcoRloSS2+8MIDSD2Kxk063XSesdH2mA9f7C25DW442UK8N7wlq9Sg5QSBkda0DsV40zfoqLVwt7qIz6U/CI4NSY/TKSAOK0Gq47/be6gkTXZ705aLVEZ+BHCAUNKI6lXHqS55LNDIsbBkOQ44a1mu50ljcBdiec6xUAR4D9xvV7TamLfaWoURD6npM4t5aW1hpaCoEnr5iueidaai09OjlpKotyWoNrlFKy82EAnxgkJJUE9yaUYWrTAgwipTcmGW0tLaWMqZcHXKfNIOAcg96lHTm6yGpjMi9uIfixQfcnCnx3G08QkpbWvrhZB5A9KFubeKaIRTKdJIpvZXMttLtoWViN4ODkeNWnjb+buojMpF/21lgNpAkKuYbL3T9coOOJVRVWHpGmnHXF/kSxr5KJ5lnHLJ74BxRQnJlt81PLTTlaz6fRK+VP81pEn6NVVi3/wDmPa7+Z439xuiiqB+A1Epx116C+kkfx++/5rlN3tA/JMb7j/qiigW55e8KLPNHums84/7LT95+CvLY+W4/2c//AFRRRE3CnjXu14m+390wQfqMb7FH4aKKKU0+r//Z')
}

.post-header-enhanced {
  background-image: url('/statics/videos/login.jpg');
   -webkit-filter: opacity(.8);
  filter: opacity(.8);
}

@supports (background-image: filter(url('i.jpg'), blur(1px))) {
  .post-header {
    transform: translateZ(0);
  }
  .post-header-enhanced {
    animation: sharpen .5s both;
  }
  @keyframes sharpen {
    from {
      background-image: filter(url('/statics/videos/login.jpg'), blur(20px));
    }
    to {
      background-image: filter(url('/statics/videos/login.jpg'), blur(0px));
    }
  }
}
</style>