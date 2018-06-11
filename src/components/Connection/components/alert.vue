<template>
</template>

<script>
import { Connection, Auth, Event } from 'fast-fastjs';
import { Alert } from 'quasar';
import 'quasar-extras/animate/bounceInRight.css';
import 'quasar-extras/animate/bounceOutRight.css';
import _debounce from 'lodash/debounce';
export default {
  name: 'connectionAlert',
  mounted: function() {
    this.showPopUp = _debounce(this.showPopUp, 3000);
    Event.listen({
      name: 'FAST:CONNECTION:ONLINE',
      callback: this.showPopUp
    });
  },
  beforeDestroy() {
    Event.remove({
      name: 'FAST:CONNECTION:ONLINE',
      callback: this.showPopUp
    });
  },
  methods: {
    handleLogout() {
      Auth.logOut();
    },
    showPopUp() {
      let self = this;
      if (
        this.$route.name !== 'login' &&
        this.$route.name !== 'register' &&
        this.$route.name !== 'login_redirect' &&
        !Auth.check() &&
        Connection.isOnline()
      ) {
        Alert.create({
          enter: 'bounceInRight',
          leave: 'bounceOutRight',
          color: 'positive',
          icon: 'wifi',
          html: this.$t('You have connection now! Login and sync you data'),
          position: 'top-right',
          actions: [
            {
              label: this.$t('Snooze'),
              handler() {
                console.log('acting');
              }
            },
            {
              label: this.$t('Go to Login'),
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
