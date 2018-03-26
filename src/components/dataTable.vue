<template>
  <div style="color:black">
    <q-data-table :data="data" :config="config" :columns="columns" @selection="handleSelectionChange" @rowclick="handleRowClick">

              <template slot='col-actions' scope='scope'>
                 <q-btn v-if="tableActions.includes('review')" color="primary" round small  @click='handleReview(scope)'> <i class="material-icons remove_red_eye" >remove_red_eye</i>
                <q-tooltip>{{$t('Review')}}</q-tooltip>
                </q-btn>
                <q-btn  v-if="tableActions.includes('edit')" color="primary" round small  @click='goToEditView(scope)'> <i class="material-icons edit" >edit</i>
                  <q-tooltip>{{$t('Edit')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="tableActions.includes('report')"  color="primary" round small  @click='handleReport(scope)'> <i class="material-icons assignment" >assignment</i>
                  <q-tooltip>{{$t('Report')}}</q-tooltip>
                </q-btn>
              </template>
              <template slot="selection" slot-scope="props">
              <q-btn flat v-if="tableActions.includes('delete')"  color="primary" @click="handleDelete(props)">
                <q-icon name="delete" />
              </q-btn>
            </template>

<template slot='col-deleted' scope='scope'>
  <q-chip icon="fa-ban" color="red" v-if="scope.row.deleted && scope.row.deleted === true">
  </q-chip>

  <q-chip icon="fa-check" color="green" v-else>
  </q-chip>
</template>
     </q-data-table>

     <button-menu render="outside" :actions="menuActions"/>
</div>
</template>

<script>
import FormioUtils from "formiojs/utils";
import buttonMenu from "./dataTable/menu";
import Export from "./dataTable/dataExport/Export";
import Submission from "database/models/Submission";
import { QTooltip, QBtn, QDataTable, QChip, QIcon } from "quasar";
import Import from "database/repositories/Submission/Import";

export default {
  components: {
    QIcon,
    QTooltip,
    QBtn,
    QDataTable,
    QChip,
    buttonMenu
  },
  name: "datatable",
  props: {
    data: {
      required: true
    },
    form: {
      required: true
    },
    tableActions: {
      required: true
    },
    menuActions: {
      required: true
    }
  },
  mounted() {
    this.$eventHub.on("FAST:EXPORT", type => {
      this.exportTo(type);
    });
    this.$eventHub.on("FAST:IMPORT", type => {
      this.exportTo(type);
    });
    this.$eventHub.on("FAST:GO:CREATE", () => {
      this.goToCreateView();
    });
  },
  beforeDestroy() {
    this.$eventHub.off("FAST:EXPORT");
    this.$eventHub.off("FAST:GO:CREATE");
    this.$eventHub.off("FAST:IMPORT");
    this.$eventHub.off("FAST-DATA_SYNCED");
    this.$eventHub.off("FAST-DATA_IMPORTED");
    this.$eventHub.off("lenguageSelection");
  },
  watch: {
    data: function(data) {},
    form: function(data) {},
    tableActions: function(data) {},
    menuActions: function(data) {}
  },
  methods: {
    async exportTo(type) {
      this.$swal({
        title: "Exporting...",
        text: this.$t(
          "Wait until the file is ready. This can take a couple minutes..."
        ),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          let data = [];
          data = this.selectedRows.length === 0 ? [] : this.selectedRows;
          let submissions = await this.getFullSubmissions(data);
          console.log('submissions', submissions)
          await Export.jsonTo({
            output: type,
            data: submissions,
            formioForm: this.form.data,
            vm: this
          });
          this.$swal("Exported!", "The file has been exported.", "success");
        }
      });
    },
    handleSelectionChange(number, rows) {
      this.selectedRows = rows.map(r => {
        return r.data;
      });
    },
    handleRowClick(row) {
      this.clickedRow = row;
    },
    async getFullSubmissions(submissions) {
      let ids = submissions.reduce((reducer, submission) => {
        reducer.push(submission._id);
        return reducer;
      }, []);

      let filter =
        ids.length > 0
          ? [
              {
                element: "_id",
                query: "in",
                value: ids
              }
            ]
          : null;

      let sub = await Submission.remote().find({
        form: this.form.data,
        filter: filter,
        limit: 50000
      });
      return sub;
    },
    async handleReview(data) {
      let submission = await this.loadSubmission(data.row._id);
      this.$router.push({
        name: "formio_submission_update",
        params: {
          idForm: this.form.data.path,
          idSubmission: data.row._id,
          fullSubmision: {
            data: submission.content.data,
            _id: data.row._id
          },
          formio: submission.formio,
          FAST_EDIT_MODE: "online-review"
        }
      });
    },
    async loadSubmission(_id) {
      this.loading = true;
      let submission = await Submission.remote().find({
        form: this.form.data,
        filter: [{element: '_id', query: '=', value: _id}],
        limit: 1
      });
      this.loading = false;
      return {
        content: submission[0]
      };
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
    displayError(error) {
      this.form;
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
    },
    goToCreateView() {
      let formId = this.form.data.path;
      if (
        this.form.data &&
        this.form.data.properties &&
        this.form.data.properties["create-view"]
      ) {
        formId = this.form.data.properties["create-view"];
      }
      this.$router.push({
        name: "formio_form_submission",
        params: {
          idForm: formId
        }
      });
    },
    goToEditView(data) {
      let formId = this.form.data.path;
      if (
        this.form.data &&
        this.form.data.properties &&
        this.form.data.properties["edit-view"]
      ) {
        formId = this.form.data.properties["edit-view"];
      }

      this.$router.push({
        name: "formio_submission_update",
        params: {
          idForm: formId,
          idSubmission: data.row._id
        }
      });
    }
  },
  computed: {
    formTitle() {
      let title = "";
      if (this.form) {
        title = this.form.data ? this.form.data.title : "";
      }
      return this.$t(title);
    },
    columns() {
      if (!this.form || this.form.data.title === "") {
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
        this.form.data.components,
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
        label: "Actions",
        field: "actions",
        filter: false,
        sort: false
      });
      return columns;
    }
  },
  data() {
    return {
      config: {
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 1,
        rowHeight: "70px",
        responsive: true,
        pagination: {
          rowsPerPage: 100,
          options: [10, 30, 50, 100]
        },
        messages: {
          noData: this.$t("No data available to show."),
          noDataAfterFiltering: this.$t(
            "No results. Please refine your search terms."
          )
        },
        // (optional) Override default labels. Useful for I18n.
        labels: {
          columns: this.$t("Columns"),
          allCols: this.$t("All Columns"),
          rows: this.$t("Rows"),
          selected: {
            singular: this.$t("item selected."),
            plural: this.$t("items selected.")
          },
          clear: this.$t("clear"),
          search: this.$t("Search"),
          all: this.$t("All")
        },
        selection: "multiple"
      },
      selectedRows: [],
      clickedRow: null,
      visibleColumns: []
    };
  }
};
</script>




