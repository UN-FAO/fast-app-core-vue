<template>
    <q-card color="white">
        <q-card-title>
            Card Title
            <q-btn icon="create" @click="changeData">Change Data</q-btn>
        </q-card-title>
        <q-card-separator />
        <q-card-main>
            Card Content

<div style="maxWidth: 450px">
    <q-data-table
      :data="table"
      :config="config"
      :columns="columns"
    >
</q-data-table>
</div>
<br>
<br>
<div style="maxWidth: 450px">
    <q-data-table
      :data="naModules"
      :config="config"
      :columns="columns"
    >
</q-data-table>
</div>

            <mybar :chartData="_chartComputedInfo" :options="reportOptions"></mybar>
        </q-card-main>
    </q-card>
</template>

<script>
import {
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
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
  clone
} from "quasar";
import Submission from "database/models/Submission";
import mybar from "./bar";
export default {
  components: {
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    mybar,
    QDataTable,
    QField,
    QInput,
    QCheckbox,
    QSelect,
    QSlider,
    QBtn,
    QIcon,
    QTooltip,
    QCollapsible
  },
  async mounted() {
    let resuls = await Submission.local().get(this.$route.params.idSubmission);
    var rows = [resuls.data.data];
    var adequacy = ['AG-hh-ac-adq', 'AG-agr-adq', 'EC-iga-adq', 'EN-landac-adq', 'AG-crop-adq', 'AG_inter_adq', 'EN-weed-adq', 'AG-spm-adq', 'EN-slm-adq', 'EN_legum_adq', 'EN-fert-adq', 'AG-animal-adq', 'AG-breed-adq', 'AG-health-adq', 'AG-new-adq', 'EC-input-adq', 'EN-wacc-adq', 'EN-wcp-adq', 'EN-wqa-adq', 'EN-landqa-adq', 'AG-trees-ac-adq', 'EN-lands-adq', 'EN-enerso-adq', 'EN-enercp-adq', 'SO-dist-adq', 'SO-cc-adq', 'AG-infoac-adq', 'EC-ict-adq', 'GO-gov-adq', 'EC-mkt-adq', 'EC-inc-adq', 'EC-ass-adq', 'EC-fin-adq', 'EC-ins-adq', 'SO-coop-adq', 'SO-group-adq', 'SO-meal-adq', 'SO-dmhh-adq', 'SO-dmfarm-adq'];
    var academic = ['AG-hh-ac-average', 'AG-agr-ac-average', 'EC-iga-ac-average', 'EN-landac-ac-average', 'AG-crop-ac-average', 'AG-inter-ac-average', 'EN-weed-ac-average', 'AG_spm_ac_average', 'EN-slm-ac-average', 'EN_legum_ac_average', 'EN-fert-ac-average', 'AG-animal-ac-average', 'AG-breed-ac-average', 'AG-health-ac-average', 'AG-new-ac-average', 'EC-input-ac-average', 'EN-wacc-ac-average', 'EN-wcp-ac-average', 'EN-wqa-ac-average', 'EN-landqa-ac-average', 'AG-trees-ac-average', 'EN-lands-ac-average', 'EN-enerso-ac-average', 'EN-enercp-ac-average', 'SO-dist-ac-average', 'SO-cc-ac-average', 'AG-infoac-ac-a', 'EC-ict-ac-average', 'GO-gov-ac-average', 'EC-mkt-ac-average', 'EC-inc-ac-average', 'EC-ass-ac-average', 'EC-fin-ac-average', 'EC-ins-ac-average', 'SO-coop-ac-average', 'SO-group-ac-average', 'SO-meal-ac-average', 'SO-dmhh-ac-average', 'SO-dmfarm-ac-average'];
    console.log("rows", rows);
    this.getRelativeResilience(rows, academic, adequacy);
    this.getNAmodules(rows, adequacy);

    console.log("this.table", this.table);
  },
  methods: {
      getRelativeResilience(rows, academic, adequacy) {
      for (var i = 0; i < adequacy.length; i++) {
              var jsonData = {};
              var aca = academic[i];
              var adq = adequacy[i];
              jsonData["module"] = "Module" + (i + 2);
              var score = rows[0][aca] + (parseFloat(rows[0][adq]) || 0);
              jsonData["score"] = score <= 20 ? parseFloat(Math.round((score) * 100) / 100).toFixed(2) : 20;
              this.table.push(jsonData);
        }
    },
     getNAmodules(rows, adequacy) {
          // var elements = [];
      for (var i = 0; i < adequacy.length; i++) {
              var jsonData = {};
              var adq = adequacy[i];
              console.log("getNAmodules", adq, rows[0][adq]);
              if (typeof rows[0][adq] === "undefined") {
                  jsonData["module"] = "Module" + (i + 2);
                  // console.log("jsonData ", i, jsonData, this.table[i].module, this.table[i].score);
                  this.naModules.push(jsonData);
              }
        }
              console.log("jsonData ", i, jsonData, this.naModules);
    },
    changeData() {
      this.ourData = this.ourData.map(v => {
        return v + Math.random();
      });
    },
    getIndividualScore() {
      this.ourData = this.ourData.map(v => {
        return v + Math.random();
      });
    },
    changeMessage(props) {
      props.rows.forEach(row => {
        row.data.message = "Gogu";
      });
    },
    deleteRow(props) {
      props.rows.forEach(row => {
        this.table.splice(row.index, 1);
      });
    },
    refresh(done) {
      this.timeout = setTimeout(() => {
        done();
      }, 5000);
    },
    selection(number, rows) {
      console.log(`selected ${number}: ${rows}`);
    },
    rowClick(row) {
      console.log("clicked on a row", row);
    }
  },
  computed: {
    _chartComputedInfo() {
      return {
        labels: ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
        datasets: [
          {
            label: "GitHub Commits",
            backgroundColor: "#f87979",
            data: this.ourData
          }
        ]
      };
    }
  },
  data() {
    return {
      table: [],
      naModules: [],
      config: {
        title: "Relative resilience",
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        rowHeight: "30px",
        responsive: true,
        bodyStyle: {
            maxWidth: "450px"
        },
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
          messages: {
            noData: '<i>warning</i> No data available to show.',
            noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
  }
      },
      columns: [
        {
          label: "Module",
          field: "module",
          sort: true,
          type: "string",
          width: "20px"
        },
        {
          label: "Average score (individual)",
          field: "score",
          sort: true,
          type: "string",
          width: "20px"
        }
      ],
      pagination: true,
      rowHeight: 50,
      bodyHeightProp: "maxHeight",
      bodyHeight: 50
    };
  },
  watch: {
    pagination(value) {
      if (!value) {
        this.oldPagination = clone(this.config.pagination);
        this.config.pagination = false;
        return;
      }
      this.config.pagination = this.oldPagination;
    },
    rowHeight(value) {
      this.config.rowHeight = value + "px";
    },
    bodyHeight(value) {
      let style = {};
      if (this.bodyHeightProp !== "auto") {
        style[this.bodyHeightProp] = value + "px";
      }
      this.config.bodyStyle = style;
    },
    bodyHeightProp(value) {
      let style = {};
      if (value !== "auto") {
        style[value] = this.bodyHeight + "px";
      }
      this.config.bodyStyle = style;
    }
  }
};
</script>
<style SCOPED>
.q-card-title {
  color: red;
}
</style>
<style lang="stylus">
.my-label {
  padding: 5px;
  border-radius: 3px;
  display: inline-block;
}
</style>
