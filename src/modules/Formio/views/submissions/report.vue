<template>
<div>
  <report :submission="submission"> </report>
</div>
</template>

<script>
import report from "./report/report";
import Submission from "database/models/Submission";
export default {
  components: {
    report
  },
  async mounted() {
    let resuls = await Submission.local().get(this.$route.params.idSubmission);
    this.submission = resuls.data.data;
  },
  data() {
    return {
      submission: {}
    };
  }
};
</script>
