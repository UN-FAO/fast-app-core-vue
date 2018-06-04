<template>
  <div style="text-align: center;">
    <q-inner-loading  v-if="show && showLoading">
      <q-spinner-audio size="50px" color="blue"></q-spinner-audio>
      <h5>{{$t('Loading...')}}</h5>
    </q-inner-loading>
  </div>
</template>
<script>
import { QInnerLoading, QSpinnerAudio } from "quasar";
export default {
  name: "loading",
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
    visible: function(data) {
      this.showLoading = data;
      this.rerender();
    }
  },
  data: function() {
    return {
      show: true,
      showLoading: true
    };
  },
  methods: {
    rerender() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
        this.$nextTick(() => {});
      });
    }
  }
};
</script>
