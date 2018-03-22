<template>
  <div style="color:black">
    Hello from the datable
     <q-btn icon="fa-check" color="green" @click="exportTo('csv')">
      </q-btn>
    <q-data-table
                :data="data"
                :config="config"
                :columns="columns"
                @selection="handleSelectionChange"
                @rowclick="handleRowClick"
                >

                   <template slot='col-review' scope='scope'>
                <q-btn color="primary" round small  @click='handleReview(scope)'> <i class="material-icons remove_red_eye" >remove_red_eye</i>
                  <q-tooltip>{{$t('Review')}}</q-tooltip>
                </q-btn>
              </template>

              <template slot='col-deleted' scope='scope'>

                <q-chip icon="fa-ban" color="red" v-if="scope.row.deleted && scope.row.deleted === true">
                </q-chip>

                <q-chip icon="fa-check" color="green" v-else>
                </q-chip>

              </template>
     </q-data-table>
</div>
</template>

<script>
import FormioUtils from "formiojs/utils";
import { QTooltip, QBtn, QDataTable, QChip } from "quasar";
import Submission from "database/models/Submission";
import Export from "./dataTable/dataExport/Export";
export default {
  components: {
    QTooltip,
    QBtn,
    QDataTable,
    QChip
  },
  name: "datatable",
  props: {
    data: {
      required: true
    },
    form: {
      required: true
    }
  },
  watch: {
    data: function(data) {
      console.log("data", data);
    },
    form: function(data) {
      console.log("form", data);
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
      // If no columns yet
      if (!this.form || this.form.data.title === "") {
        return [{}];
      }
      // Get all columns
      this.visibleColumns = FormioUtils.findComponents(
        this.form.data.components,
        {
          input: true,
          tableView: true
        }
      );
      // Take only the fisrt 10
      this.visibleColumns = this.visibleColumns.slice(0, 10);
      let columns = [];
      // Check to have label
      this.visibleColumns = this.visibleColumns.filter(c => {
        return !!(c.label !== "");
      });
      // Set the columns with their translations
      this.visibleColumns.forEach((column, index) => {
        // let self = this;
        let visibleColum = {
          label: this.$t(column.label),
          field: column.key,
          filter: true,
          sort: true,
          width: "200px"
        };
        columns.push(visibleColum);
      });
      // Set the default edit column
      columns.push({
        label: "Review",
        field: "review",
        filter: false,
        sort: false,
        width: "110px"
      });

      return columns;
    }
  },
  methods: {
    async exportTo(type) {
      let data = [];
      data = this.selectedRows.length === 0 ? [] : this.selectedRows;
      let submissions = await this.getFullSubmissions(data);
      await Export.jsonTo({
        output: "csv",
        data: submissions,
        formioForm: this.form.data,
        vm: this
      });
      this.$swal("Exported!", "The file has been exported.", "success");
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
        ids.length > 0 ? [{ element: "_id", query: "in", value: ids }] : null;

      let sub = await Submission.remote().find({
        form: this.form.data,
        filter: filter,
        limit: 50000
      });
      return sub;
    }
  }
};
</script>




