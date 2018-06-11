<template>
  <div style="text-align: center;">
    <q-inner-loading  v-if="visible" :visible="visible">
      <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
      <h5>{{$t('Loading...')}}</h5>
    </q-inner-loading>
  </div>
</template>
<script>
import { QInnerLoading, QSpinnerAudio } from 'quasar';
export default {
  name: 'loading',
  components: {
    QInnerLoading,
    QSpinnerAudio
  },
  props: {
    visible: {
      required: true
    }
  },
  watch: {
    visible: function(data) {}
  }
};
</script>
