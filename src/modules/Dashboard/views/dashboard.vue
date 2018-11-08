<template>
 <div>
   <appdashboard v-if="!$FAST_CONFIG.IS_SURVEY"></appdashboard>
   <collectiondashboard v-if="$FAST_CONFIG.IS_SURVEY"></collectiondashboard>
  </div>
</template>
<script>
import {Auth} from 'fast-fastjs';
import appdashboard from '../components/appDashboard';
import collectiondashboard from '../components/collectionDashboard';

export default {
  components: {
    appdashboard,
    collectiondashboard
  },
  async created() {
  },
  methods: {
    isAdmin() {
      return Auth.hasRole('Administrator');
    }
  }
};
</script>
