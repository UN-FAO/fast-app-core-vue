<template>
 <div>
<q-icon name="signal_wifi_off" style="font-size: 24px;" color="red" v-if="!isOnline" />
</div>
</template>

<script>
import { QIcon } from "quasar";
import {Event} from "fast-fastjs";
export default {
  name: "wifiDisplay",
  components: {
    QIcon
  },
  data: () => {
    return {
      isOnline: true
    };
  },
  methods: {
    changeOnlineStatus(event) {
      this.isOnline = event.detail.data;
    }
  },
  mounted() {
    Event.listen({
      name: "FAST:CONNECTION:ONLINE",
      callback: this.changeOnlineStatus
    });
    Event.listen({
      name: "FAST:CONNECTION:OFFLINE",
      callback: this.changeOnlineStatus
    });
  },
   beforeDestroy() {
    Event.remove({
      name: "FAST:CONNECTION:ONLINE",
      callback: this.changeOnlineStatus
    });
    Event.remove({
      name: "FAST:CONNECTION:OFFLINE",
      callback: this.changeOnlineStatus
    });
  }
};
</script>
