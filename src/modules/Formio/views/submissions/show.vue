<template>
  <div class="row">
        <div style="width:100%" class="col-lg-10 col-lg-offset-1 col-md-offset-1 col-md-10 col-sm-10 col-sm-offset-1 col-xs-offset-0 col-xs-12">
          <q-card color="white" style="bottom: unset;margin-top: 30px;" class="relative-position text-dark">
            <q-card-title>
              {{formTitle}}
            </q-card-title>
              <q-card-main >
                  <loading :visible="noSubmissions"></loading>
                <datatable
                  :data="submissions"
                  :form="currentForm"
                  :menuActions="['create', 'export', 'import']"
                  :tableActions="$FAST_CONFIG.HAS_REPORT ? ['edit', 'delete', 'report'] : ['edit', 'delete']"
                  fastMode="show"
                  v-on:refresh="refreshData"
                  v-if="currentForm && currentForm.data.title !== '' && !noSubmissions"
                />
            </q-card-main>
          </q-card>
         </div>
  </div>
</template>

<script>
import loading from "components/loading";
import { QCard, QCardMain, QCardTitle, Toast, Loading } from "quasar";
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
    Event.listen({
      name: "FAST:DATA:IMPORTED",
      callback: this.handleDataImported
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
    loading,
    QCardTitle
  },
  data() {
    return {
      currentForm: {},
      submissions: undefined,
      loading: false
    };
  },
  methods: {
    async handleDataImported() {
      await this.refreshData();
      Loading.hide()
      this.$swal("Imported!", "Your submission were imported", "success");
    },
    async handleDataSynced() {
      await this.refreshData();
      Toast.create.positive({ html: "Your data was uploaded!" });
    },
    async refreshData() {
      this.loading = true;
      let submissions = await Submission.merged().showView({
        form: this.$route.params.idForm,
        limit: 1000,
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
