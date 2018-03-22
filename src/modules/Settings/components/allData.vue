<template>
    <div class="row" style="color:black">
        <div class="section-title pageTitle" style="margin:auto">
          {{ $t("All Data") }}
        </div>

        <div style="width:100%;color:grey">
         <hr>
        </div>

        <div style="width:100%" class="relative-position">
            <q-select filter separator autofocus-filter v-model="selectForm" :options="formList" stack-label="Search your form" filter-placeholder="Search for the country" style="border-bottom: 1px solid grey; width: 50%" clearable />

            <q-card-main>

                <h1 class="_control-label-title"><span v-if="formTitle !== ''">Form:</span> {{formTitle}}</h1>

                <datatable
                  :data="submissions"
                  :form="currentForm"
                  v-if="currentForm && currentForm.data.title !== ''"
                ></datatable>
            </q-card-main>

            <!-- This should be extracted to its own component -->
            <q-inner-loading :visible="loading">
                <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
            </q-inner-loading>
            <!--Until Here      -->
        </div>

        <!-- This should be extracted to its own component -->
        <q-fixed-position corner="top-right" :offset="[18, 18]">
            <q-fab color="red" icon="add" direction="down" push>
                <q-btn color="primary" round @click='createSubmission()'> <i class="material-icons edit" style="font-size: 1.7em;">add</i>
                    <q-tooltip>{{$t('New Submission')}}</q-tooltip>
                </q-btn>

                <q-btn color="positive" round small @click='exportCSV()'> <i class="material-icons edit" style="font-size: 1.3em;">file_download</i><span style="font-size: 0.6em;">CSV</span>
                    <q-tooltip>{{$t('Export CSV')}}</q-tooltip>
                </q-btn>
                <q-btn color="positive" round small @click='exportJson()'> <i class="material-icons edit" style="font-size: 1.3em;">file_download</i><span style="font-size: 0.6em;">JSON</span>
                    <q-tooltip>{{$t('Export Json')}}</q-tooltip>
                </q-btn>

                <q-fab-action color="secondary" @click="importSubmission()" icon="fa-upload">
                    <q-tooltip>
                        {{$t('Import Submissions')}}
                    </q-tooltip>
                </q-fab-action>

            </q-fab>
        </q-fixed-position>
        <!--Until Here      -->
    </div>
</template>
<script>
import {
  QChip,
  QDataTable,
  QField,
  QInput,
  QCheckbox,
  QSelect,
  QSlider,
  QIcon,
  QCollapsible,
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QFab,
  QBtn,
  QFabAction,
  QFixedPosition,
  QPullToRefresh,
  QSpinnerAudio,
  QTransition,
  QInnerLoading,
  QTooltip
} from "quasar";
import Submission from "database/models/Submission";
import Form from "database/models/Form";
import FormioUtils from "formiojs/utils";
import Promise from "bluebird"
import Import from "database/repositories/Submission/Import";
import FormioJS from "formiojs";
import Auth from "modules/Auth/api/Auth";
import Config from "database/repositories/Configuration/Configuration";
import datatable from "components/dataTable"
export default {
  async mounted() {
    this.updateLocalSubmissions();
    this.$eventHub.on("lenguageSelection", async data => {
      await this.updateLocalSubmissions();
    });
  },
  asyncData: {
    formList: {
      get() {
        return Form.sAll();
      },
      transform(result) {
        let forms = result.reduce((filtered, form) => {
          if (form.data.tags.indexOf("visible") > -1) {
            filtered.push({ label: form.data.title, value: form.data.path });
          }
          return filtered;
        }, []);
        return forms;
      }
    }
  },
  asyncComputed: {
    currentForm: {
      get() {
        if (this.selectForm && this.selectForm !== "") {
          return Form.local().findOne({
            "data.path": this.selectForm
          });
        } else {
          return { data: { title: "" } };
        }
      }
    },
    submissions: {
      async get() {
        if (this.currentForm.data.title === "") {
          return [];
        }
        this.loading = true;
        let form = this.currentForm.data;

        FormioJS.setToken(Auth.user().x_jwt_token);
        let formUrl = await Config.getLocal();
        formUrl = formUrl.APP_URL + "/" + form.path;

        let formio = new FormioJS(formUrl);

        FormioJS.clearCache();

        let select = this.columns.reduce((reducer, column) => {
          reducer = reducer + ",data." + column.field;
          return reducer;
        }, "_id");

        let remoteSubmissions = await formio.loadSubmissions({
          params: {
            // "data.deleted": false,
            limit: "5000",
            select: select
          }
        });
        remoteSubmissions = remoteSubmissions.map(s => {
          let data = s.data;
          data._id = s._id;
          return data;
        });
        this.loading = false;
        return remoteSubmissions;
      },
      watch() {
        this.currentForm;
      }
    }
  },
  computed: {
    formTitle() {
      let title = "";
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : "";
      }
      return this.$t(title);
    },
    columns() {
      if (!this.currentForm || this.currentForm.data.title === "") {
        return [
          {
            label: "Longitude",
            field: "longitude",
            filter: true,
            sort: true
          },
          {
            label: "Another",
            field: "another",
            filter: true,
            sort: true
          }
        ];
      }
      this.visibleColumns = FormioUtils.findComponents(
        this.currentForm.data.components,
        {
          input: true,
          tableView: true
        }
      );
      this.visibleColumns = this.visibleColumns.slice(0, 7);
      let columns = [];
      this.visibleColumns = this.visibleColumns.filter(c => {
        return !!(c.label !== "");
      });
      this.visibleColumns.forEach((column, index) => {
        // let self = this;
        let visibleColum = {
          label: this.$t(column.label),
          field: column.key,
          filter: true,
          sort: true
        };
        columns.push(visibleColum);
      });
      columns.push({
        label: "Review",
        field: "review",
        filter: false,
        sort: false
      });
      return columns;
    }
  },
  components: {
    datatable,
    QChip,
    QDataTable,
    QField,
    QInput,
    QCheckbox,
    QSelect,
    QSlider,
    QBtn,
    QIcon,
    QTooltip,
    QCollapsible,
    QInnerLoading,
    QTransition,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QFab,
    QFabAction,
    QFixedPosition,
    QPullToRefresh,
    QSpinnerAudio
  },
  data() {
    return {
      loading: false,
      formList: [],
      selectForm: this.$route.query.form
    };
  },
  beforeDestroy() {
    this.$eventHub.off("FAST-DATA_SYNCED");
    this.$eventHub.off("FAST-DATA_IMPORTED");
    this.$eventHub.off("lenguageSelection");
  },
  methods: {
    async handleReview(data) {
      let submission = await this.loadSubmission(data.row._id)
      this.$router.push({
        name: "formio_submission_update",
        params: {
          idForm: this.currentForm.data.path,
          idSubmission: data.row._id,
          fullSubmision: { data: submission.content.data, _id: data.row._id },
          formio: submission.formio,
          FAST_EDIT_MODE: "online-review"
        }
      });
    },
    async loadSubmission(_id) {
      this.loading = true
      FormioJS.setToken(Auth.user().x_jwt_token);
        let formUrl = await Config.getLocal();
        formUrl = formUrl.APP_URL + "/" + this.currentForm.data.path + '/submission/' + _id;
        let formio = new FormioJS(formUrl);
        FormioJS.clearCache();
        let submission = await formio.loadSubmission()
        this.loading = false
        return {content: submission, formio: formio}
    },
    handleReport(data) {
      let self = this;
      let submission = data.row;
      self.$router.push({
        name: "formio_submission_report",
        params: {
          idForm: submission.formio.formId,
          idSubmission: submission.id_submision
        }
      });
    },
    handleDelete(props) {
      let rows = this.selectedRows;
      let self = this;
      if (rows.length === 0) {
        self.$swal({
          title: this.$t("No row selected"),
          text: this.$t("You must select at least one row to delete"),
          type: "error"
        });
        return;
      }
      self
        .$swal({
          title: this.$t("Are you sure?"),
          text: this.$t("You won't be able to revert this!"),
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: this.$t("Yes, delete it!"),
          cancelButtonText: this.$t("Cancel")
        })
        .then(async () => {
          Promise.each(rows, async submission => {
            let online = await Submission.local().findOne({
              "data._id": submission.id_submision
            });

            let offline = await Submission.local().findOne({
              _id: submission.id_submision
            });

            let deleteSubmission = offline;
            if (online) {
              deleteSubmission = online;
            }
            await Submission.local().remove(deleteSubmission);
          }).then(async () => {
            await this.updateLocalSubmissions();
            self.$swal(
              this.$t("Deleted!"),
              this.$t("Your submission has been deleted."),
              "success"
            );
          });
        });
    },
    scrollToEnd: function(ID) {
      var container = this.$el.querySelector("#container");
      container.scrollTop = container.scrollHeight;
    },
    async importSubmission() {
      const file = await this.$swal({
        title: this.$t("Select your JSON file"),
        input: "file",
        inputAttributes: {
          accept: ".json",
          "aria-label": this.$t("Upload your JSON File")
        }
      });
      if (file) {
        Import.fromJsonFile(file, this);
      }
    },
    async updateLocalSubmissions(done) {
      if (done) {
        done();
      }
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
