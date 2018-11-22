<template>
<div>
  <report :submission="submission"> </report>
</div>
</template>

<script>
import report from "./report/report";
import { Submission } from "fast-fastjs";
export default {
  components: {
    report
  },
  async mounted() {
    const path = this.$route.params.idForm;
    if (this.$route.params.idSubmission.indexOf("_local") >= 0) {
      const result = await Submission({ path })
        .local()
        .where('_id', '=', this.$route.params.idSubmission)
        .first();

      if (result && result.data) {
        this.submission = result.data;
      }
    } else {
      let online = await Submission({ path })
        .remote()
        .where('_id', '=', this.$route.params.idSubmission)
        .first()

      if (online && online.data) {
        this.submission = online.data;
      }
    }
  },
  data() {
    return {
      submission: {}
    };
  }
};
</script>
