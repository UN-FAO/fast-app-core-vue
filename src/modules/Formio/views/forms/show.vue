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
          <!-- This should be extracted to its own component -->
        <q-inner-loading :visible="typeof submissions === 'undefined'">
          <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
        </q-inner-loading>
         <!--Until Here      -->
      </q-card>
    </div>
  </div>
</template>

<script>
import Form from "libraries/fastjs/database/models/Form";
import FormioUtils from "formiojs/utils";
import Submission from "libraries/fastjs/database/models/Submission";
import datatable from "components/dataTable/dataTable";
import { QCard, QCardMain, QInnerLoading, Toast } from "quasar";
import Columns from "components/dataTable/tableFormatter/Columns";

export default {
  async mounted() {
    this.currentForm = await Form.local().findOne({
      "data.path": this.$route.params.idForm
    });
    this.refreshData();

    this.$eventHub.on("FAST-DATA_SYNCED", async data => {
      await this.refreshData();
      Toast.create.positive({ html: "Your data was uploaded!" });
    });
    this.$eventHub.on("FAST-DATA_IMPORTED", async data => {
      await this.refreshData();
      this.$swal("Imported!", "Your submission were imported", "success");
    });

    this.$eventHub.on("lenguageSelection", async data => {
      await this.refreshData();
    });
  },
  computed: {
    formTitle() {
      let title = "";
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : "";
      }
      return this.$t(title);
    }
  },
  components: {
    datatable,
    QCard,
    QCardMain,
    QInnerLoading,
    Toast
  },
  data() {
    return {
      currentForm: {},
      submissions: undefined,
      loading: false
    };
  },
  methods: {
    async refreshData() {
      this.loading = true;
      let submissions = await Submission.merged(this.$route.params.idForm).showView({
        filter: {
          "data.formio.formId": this.$route.params.idForm
        },
        select: Columns.getTableView(this.currentForm.data).map(o => o.path)
      });
      this.submissions = submissions.results;
      this.loading = false;
    },
    displayError(error) {
      let errorString =
        '<div style="overflow-x:auto;"><table class="restable"><thead> <tr><th scope="col">' +
        this.$t("Label") +
        '</th><th scope="col">' +
        this.$t("Code") +
        '</th><th scope="col">' +
        this.$t("Module") +
        "</th></tr></thead><tbody>";

      error.details.forEach(detail => {
        let component = FormioUtils.getComponent(
          this.currentForm.data.components,
          detail.path[0]
        );
        let label = component ? this.$t(component.label) + ": " : "";
        errorString = errorString + "<tr>";
        errorString =
          errorString +
          "<td data-label=" +
          this.$t("Label") +
          ">" +
          label +
          "</td>";
        errorString =
          errorString +
          "<td data-label=" +
          this.$t("Code") +
          ">" +
          detail.message +
          "</td>";
        errorString =
          errorString +
          "<td data-label=" +
          this.$t("Module") +
          ">" +
          detail.message +
          "</td>";
        errorString = errorString + "</tr>";
      });
      errorString = errorString + "</tbody></table></div>";

      this.$swal({
        title: error.name,
        type: "info",
        html: errorString,
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonText: "OK"
      });
    }
  }
};
</script>
