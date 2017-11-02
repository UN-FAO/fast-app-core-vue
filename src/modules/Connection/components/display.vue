<template>
 <div> 
<q-icon name="signal_wifi_off" style="font-size: 24px;" color="red" v-if="!isOnline" />
</div>
</template>

<script>
import { QIcon } from 'quasar'
export default {
  name: 'wifiDisplay',
  components: {
    QIcon
  },
  data: () => {
    return {
      isOnline: true
    }
  },
  mounted () {
    this.$eventHub.$on('connectionStatusChanged', (isOnline) => {
      this.isOnline = isOnline
    })
  }
}
</script>