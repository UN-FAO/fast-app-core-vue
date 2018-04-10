<template>
  <div v-if="show && showLoading">
    <q-inner-loading :visible="showLoading">
      <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
    </q-inner-loading>
  </div>
</template>
<script>
import { QinnerLoading, QSpinnerAudio } from "quasar";
export default {
  name: "loading",
  components: {
    QinnerLoading,
    QSpinnerAudio
  },
  props: {
    visible: {
      required: true
    }
  },
  watch: {
    visible: function(data) {
      this.showLoading = data
      this.rerender()
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
        this.$nextTick(() => {
        });
      });
    }
  }
};
</script>
