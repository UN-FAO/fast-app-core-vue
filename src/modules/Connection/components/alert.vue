<template>
</template>

<script>
import Connection from 'libraries/fastjs/Wrappers/Connection'
import Auth from 'libraries/fastjs/repositories/Auth/Auth'
import { Alert } from "quasar";
import "quasar-extras/animate/bounceInRight.css";
import "quasar-extras/animate/bounceOutRight.css";
import _debounce from "lodash/debounce";
export default {
  name: "connectionAlert",
  mounted: function() {
    this.showPopUp = _debounce(this.showPopUp, 3000);
    this.$eventHub.on("connectionStatusChanged", this.showPopUp);
  },
  beforeDestroy() {
    this.$eventHub.off("connectionStatusChanged", this.showPopUp);
  },
  methods: {
    handleLogout() {
      this.$store.dispatch("clearAuthUser");
      Auth.logOut();
    },
    showPopUp() {
      let self = this;
      if (
        this.$route.name !== "login" &&
        this.$route.name !== "register" &&
        this.$route.name !== "login_redirect" &&
        !Auth.check() &&
        Connection.isOnline()
      ) {
        Alert.create({
          enter: "bounceInRight",
          leave: "bounceOutRight",
          color: "positive",
          icon: "wifi",
          html: `You have connection now! It's time to login and sync you data`,
          position: "top-right",
          actions: [
            {
              label: "Snooze",
              handler() {
                console.log("acting");
              }
            },
            {
              label: "Go to Login",
              handler() {
                self.handleLogout();
              }
            }
          ]
        });
      }
    }
  }
};
</script>
