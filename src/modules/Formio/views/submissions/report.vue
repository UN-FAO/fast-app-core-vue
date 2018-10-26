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
    if (this.$route.params.idSubmission.indexOf("_local") >= 0) {
      let resuls = await Submission()
        .local()
        .get(this.$route.params.idSubmission);
      resuls = resuls.data.data;
      this.submission = resuls;
    } else {
      const path = this.$route.params.idForm;
      let online = await Submission({ path })
        .remote()
        .find({
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
