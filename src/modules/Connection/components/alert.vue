<template>
<div class="alert alert-success"
     v-if="isNotLoginSection && isNotAuth && isOnline()"> Back on line! To login and sync you data <strong @click="handleLogout()"> CLICK HERE</strong>
</div>

</template>

<script>
import Connection from 'modules/Wrappers/Connection';
import Auth from 'modules/Auth/api/Auth';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'connection-alert',

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$forceUpdate()
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.$forceUpdate()
    next()
  },
  mounted: function() {
    this.$eventHub.on('connectionStatusChanged', (status) => {
      this.$forceUpdate()
    })
  },

  methods: {
    /**
       * Map layout methods for the theme
       */
    ...mapMutations([
          'setLayoutNeeded',
          'setIsLoginPage'
    ]),

    ...mapGetters([
          'getIsLoginPage'
    ]),

    handleLogout() {
      this.$store.dispatch('clearAuthUser')
      Auth.logOut()
      this.setLayoutNeeded(false)
      this.setIsLoginPage(true)
    }
  },

  computed: {
    isOnline() {
      console.log(1, Connection.isOnline())
      return Connection.isOnline()
    },
    isNotAuth() {
      console.log(2, !Auth.check())
      return !Auth.check()
    },
    isNotLoginSection() {
      return !this.getIsLoginPage()
    }
  }
}

</script>
