<template>
<div>
  <report :submission="submission"> </report>
</div>
</template>

<script>
import report from "./report/report";
import Submission from "libraries/fastjs/database/models/Submission";
export default {
  components: {
    report
  },
  async mounted() {
    if (this.$route.params.idSubmission.indexOf("_local") >= 0) {
      let resuls = await Submission.local().get(
        this.$route.params.idSubmission
      );
      resuls = resuls.data.data;
      this.submission = resuls;
    } else {
      let online = await Submission.remote().find({
        form: this.$route.params.idForm,
        filter: [
          {
            element: "_id",
            query: "=",
            value: this.$route.params.idSubmission
          }
        ],
        limit: 1
      });
      online = online.length > 0 ? online[0] : [];
      this.submission = online.data;
    }
  },
  data() {
    return {
      submission: {}
    };
  }
};
</script>
