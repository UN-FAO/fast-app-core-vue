import {mapMutations, mapState, mapActions} from 'vuex'
import Auth from 'modules/Auth/api/Auth'
import Formio from 'modules/Formio/api/Formio'
import Connection from 'modules/Wrappers/Connection'
import * as Database from 'database/Database'
import _ from 'lodash'

export default {
  mounted: async function () {
    this.subscribeToForms()
    this.$eventHub.$on('openLeftDrawer', () => {
      if (_.hasIn(this.$refs, 'leftDrawer.open')) {
        this.$refs.leftDrawer.open()
      }
    })
  },
  data () {
    return {
      form: {},
      forms: [],
      subs: []
    }
  },
  computed: {
    ...mapState({
      User: state => state.authStore.authUser
    }),
    isOnline () {
      return this.$root.VueOnline
    }
  },
  methods: {
    ...mapActions(['getResources']),
    /**
       * Map layout methods for the theme
       */
    ...mapMutations(['setLayoutNeeded', 'setIsLoginPage']),
    closeDrawer () {
      this.$refs.leftDrawer.close()
    },
    getForms () {
      this.getResources({
        appName: this.$store.state.authStore.appName,
        isOnline: this.$root.VueOnline// this.$store.getters.isOnline
      })
    },
    handleLogout () {
      this.$store.dispatch('clearAuthUser')
      Auth.logOut()
      this.setLayoutNeeded(false)
      this.setIsLoginPage(true)
    },
    async subscribeToForms () {
      this.subs.forEach(sub => sub.unsubscribe())
      let self = this
      const db = await Database.get()
      this.subs.push(
        db.forms
          .find()
          .$
          .subscribe(forms => {
            this.forms = forms
          })
      )
    }
  }
}
