<template>
<div>
  <q-data-table
        :data="data"
        :config="config"
        :columns="columns"
  >
  </q-data-table>
  <div class="pull-right" style="color:grey">
    *Based on adequacy scores
  </div>
</div>
</template>
<script>
import { QDataTable } from "quasar";
import scoresByModule from "../scoresByModule";
export default {
  name: "naquestions",
  data() {
    return {
      sub: {},
      config: {
        title: "Non-applicable modules*",
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        rowHeight: "70px",
        responsive: true,
        pagination: {
          rowsPerPage: 5,
          options: [5, 10, 20, 40]
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
        }
      },
      columns: [
        {
          label: "Module",
          field: "module",
          sort: true,
          type: "string",
          width: "20px",
          style: { "text-align": "center" }
        }
      ]
    };
  },
  components: {
    QDataTable
  },
  props: ["submission"],
  watch: {
    submission: function(val) {
      this.sub = val;
    }
  },
  computed: {
    data() {
      let submission = this.submission;
      let scores = scoresByModule.get();
      let table = [];
      if (!scores || !submission) {
        return {}
      }
      scores.forEach((score, index) => {
        let jsonData = {};
        score.adequacyElements.forEach((adequacyElement, elIndex) => {
          if (
            typeof submission[adequacyElement] === "undefined" ||
            submission[adequacyElement] === "NA"
          ) {
            let moduleNumber =
              elIndex > 0
                ? (index + 2).toString() + "." + (elIndex + 1).toString()
                : (index + 2).toString();
            jsonData["module"] = moduleNumber + " - " + score.abbreviation;
            table.push(jsonData);
          }
        });
      });
      return table;
    }
  }
};
</script>
