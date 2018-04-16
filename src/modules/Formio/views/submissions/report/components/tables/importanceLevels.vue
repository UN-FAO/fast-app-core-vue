<template>
<div>
 <q-data-table
      :data="data"
      :config="config"
      :columns="columns"
>
</q-data-table>
<div class="pull-right" style="color:grey">

</div>
</div>
</template>
<script>
import { QDataTable } from "quasar";
import scoresByModule from "../scoresByModule";
import _chunk from "lodash/chunk";
export default {
  name: "importance",
  data() {
    return {
      config: {
        title: "Respondent's perceived priorities",
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
          label: "Priority level",
          field: "module",
          sort: true,
          type: "string",
          width: "20px",
          style: { "text-align": "center" }
        },
        {
          label: "Module",
          field: "score",
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
    submission: function(val) {}
  },
  computed: {
    data() {
      let submission = this.submission;
      let scores = scoresByModule.get();
      let table = [];

      let levels = {
        notAtAll: [],
        aLittle: [],
        average: [],
        aLot: [],
        very: []
      };
      if (!scores || !submission) {
        return {}
      }

      scores.forEach((score, index) => {
        score.importanceElements.forEach(element => {
          let module = (index + 2) + " - " + score.abbreviation
          switch (submission[element]) {
            case "notAtAll":
              levels.notAtAll.push(module);
              break;
            case "aLittle":
              levels.aLittle.push(module);
              break;
            case "average":
              levels.average.push(module);
              break;
            case "aLot":
              levels.aLot.push(module);
              break;
            case "very":
              levels.very.push(module);
              break;
          }
        });
      });

      table.push({
        module: "Very high priority",
        score: this.formatImportanceModules(levels.very)
      });

       table.push({
        module: "High priority",
        score: this.formatImportanceModules(levels.aLot)
      });

      table.push({
        module: "Medium priority",
        score: this.formatImportanceModules(levels.average)
      });

      table.push({
        module: "Low priority",
        score: this.formatImportanceModules(levels.aLittle)
      });

      table.push({
        module: "Not a priority",
        score: this.formatImportanceModules(levels.notAtAll)
      });




      return table;
    }
  },
  methods: {
    formatImportanceModules(modulesArray) {
      let chunks = _chunk(modulesArray, 1);
      let modules = "";
      if (!chunks) {
        return [];
      }
      chunks.forEach(chunk => {
        modules = modules + chunk.join(" - ") + "</br>";
      });
      return modules;
    }
  }
};
</script>
