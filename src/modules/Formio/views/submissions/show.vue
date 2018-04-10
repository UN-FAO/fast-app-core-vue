<template>
  <div class="row" style="background:#f3f3f5">
    <div>
      <q-card color="white" style="bottom: unset;margin-top: 30px;" class="col-lg-10 col-lg-offset-1 col-md-offset-1 col-md-10 col-sm-10 col-sm-offset-1 col-xs-offset-0 col-xs-12  centered relative-position">
          <q-card-main>
        <h1 class="_control-label-title">{{formTitle}}</h1>
          <span v-if="loading">Loading...</span>
             <datatable
              :data="submissions"
              :form="currentForm"
              :menuActions="['create', 'export']"
              :tableActions="['edit', 'delete']"
              fastMode="show"
              v-on:refresh="refreshData"
              v-if="currentForm && currentForm.data.title !== ''"
            />
        </q-card-main>

        <loading :visible="noSubmissions"></loading>

      </q-card>
    </div>
  </div>
</template>

<script>
import loading from "components/loading";
import { QCard, QCardMain, Toast } from "quasar";
import datatable from "components/dataTable/dataTable";
import Form from "libraries/fastjs/database/models/Form";
import Auth from "libraries/fastjs/repositories/Auth/Auth";
import Columns from "components/dataTable/tableFormatter/Columns";
import Submission from "libraries/fastjs/database/models/Submission";
import Event from "libraries/fastjs/Wrappers/Event";

export default {
  async mounted() {
    this.currentForm = await Form.local().findOne({
      "data.path": this.$route.params.idForm
    });
    this.refreshData();

    Event.listen({
      name: "FAST:SUBMISSION:SYNCED",
      callback: this.handleDataSynced
    });

    this.$eventHub.on("FAST-DATA_IMPORTED", async data => {
      await this.refreshData();
      this.$swal("Imported!", "Your submission were imported", "success");
    });

    this.$eventHub.on("lenguageSelection", async data => {
      await this.refreshData();
    });
  },
  beforeDestroy() {
    Event.remove({
      name: "FAST:SUBMISSION:SYNCED",
      callback: this.handleDataSynced
    });
  },
  computed: {
    formTitle() {
      let title = "";
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : "";
      }
      return this.$t(title);
    },
    noSubmissions() {
      return typeof this.submissions === "undefined";
    }
  },
  components: {
    datatable,
    QCard,
    QCardMain,
    Toast,
    loading
  },
  data() {
    return {
      currentForm: {},
      submissions: undefined,
      loading: false
    };
  },
  methods: {
    async handleDataSynced() {
      await this.refreshData();
      Toast.create.positive({ html: "Your data was uploaded!" });
    },
    async refreshData() {
      this.loading = true;
      let submissions = await Submission.merged().showView({
        form: this.$route.params.idForm,
        filter: {
          "data.formio.formId": this.$route.params.idForm,
          "data.user_email": Auth.userEmail()
        },
        select: Columns.getTableView(this.currentForm.data).map(
          o => "data." + o.path
        )
      });
      this.submissions = submissions.results;
      this.loading = false;
    }
  }
};
</script>
