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
<br>
<br>
<div style="maxWidth: 450px">
    <q-data-table
      :data="impElem"
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
var academic = ['AG-hh-ac-average', 'AG-agr-ac-average', 'EC-iga-ac-average', 'EN-landac-ac-average', 'AG-crop-ac-average', 'AG-inter-ac-average', 'EN-weed-ac-average', 'AG_spm_ac_average', 'EN-slm-ac-average',
 'EN_legum_ac_average', 'EN-fert-ac-average', 'AG-animal-ac-average', 'AG-breed-ac-average', 'AG-health-ac-average', 'AG-new-ac-average', 'EC-input-ac-average', 'EN-wacc-ac-average', 'EN-wcp-ac-average', 'EN-wqa-ac-average',
 'EN-landqa-ac-average', 'AG-trees-ac-average', 'EN-lands-ac-average', 'EN-enerso-ac-average', 'EN-enercp-ac-average', 'SO-dist-ac-average', 'SO-cc-ac-average', 'AG-infoac-ac-average', 'EC-ict-ac-average', 'GO-gov-ac-average',
 'EC-mkt-ac-average', 'EC-inc-ac-average', 'EC-ass-ac-average', 'EC-fin-ac-average', 'EC-ins-ac-average', 'SO-coop-ac-average', 'SO-group-ac-average', 'SO-meal-ac-average', 'SO-dmhh-ac-average', 'SO-dmfarm-ac-average'];

var adequacy = ['AG-hh-ac-adq', 'AG-agr-adq', 'EC-iga-adq', 'EN-landac-adq', 'AG-crop-adq', 'AG_inter_adq', 'EN-weed-adq', 'AG-spm-adq', 'EN-slm-adq',
 'EN_legum_adq', 'EN-fert-adq', 'AG-animal-adq', 'AG-breed-adq', 'AG-health-adq', 'AG-new-adq', 'EC-input-adq', 'EN-wacc-adq', 'EN-wcp-adq', 'EN-wqa-adq',
 'EN-landqa-adq', 'AG-trees-ac-adq', 'EN-lands-adq', 'EN-enerso-adq', 'EN-enercp-adq', 'SO-dist-adq', 'SO-cc-adq', 'AG-infoac-adq', 'EC-ict-adq', 'GO-gov-adq',
 'EC-mkt-adq', 'EC-inc-adq', 'EC-ass-adq', 'EC-fin-adq', 'EC-ins-adq', 'SO-coop-adq', 'SO-group-adq', 'SO-meal-adq', 'SO-dmhh-adq', 'SO-dmfarm-adq'];

var importance = ['AG-hh-ac-imp', 'AG-agr-imp', 'EC-iga-imp', 'EN-landac-imp', 'AG-crop-imp', 'AG-inter-ac-imp', 'EN-weed-imp', 'AG-spm-imp', 'EN-slm-imp',
 'EN_legum_imp', 'EN-fert-imp', 'AG-animal-imp', 'AG-breed-imp', 'AG-health-imp', 'AG-new-imp', 'EC-input-imp', 'EN-wacc-imp', 'EN-wcp-imp', 'EN-wqa-imp',
 'EN-landqa-imp', 'AG-trees-ac-imp', 'EN-lands-imp', 'EN-enerso-imp', 'EN-enercp-imp', 'SO-dist-imp', 'SO-cc-imp', 'AG-infoac-imp', 'EC-ict-imp', 'GO-gov-imp',
 'EC-mkt-imp', 'EC-inc-imp', 'EC-ass-imp', 'EC-fin-imp', 'EC-ins-imp', 'SO-coop-imp', 'SO-group-imp', 'SO-meal-imp', 'SO-dmhh-imp', 'SO-dmfarm-imp'];

var adqElem = ['AG-hh-ac-adq', 'AG-agr-adq', 'EC-iga-adq', 'EN-landac-adq', 'AG-crop-adq', 'AG_inter_adq', 'EN-weed-adq', 'AG-spm-adq', 'EN-slm-adq',
 'EN_legum_adq', 'EN-fert-adq', 'AG-animal-adq', 'AG-breed-adq', 'AG-health-adq-health', 'AG-new-cropsFoodSecurityRevenues', 'AG-new-breedsFoodSecurityRevenues', 'AG-new-improvingAccessBreedsSecurity', 'EC-input-adq', 'EN-wacc-adq', 'EN-wcp-adq', 'EN-wqa-adq',
 'EN-landqa-adq', 'AG-trees-ac-adq', 'EN-lands-adq', 'EN-enerso-adq', 'EN-enercp-adq', 'SO-dist-adq', 'SO-cc-adq', 'AG-infoac-adq', 'EC-ict-adq', 'GO-gov-adq',
 'EC-mkt-adq', 'EC-inc-adq', 'EC-ass-adq', 'EC-fin-adq', 'EC-ins-adq', 'SO-coop-adq', 'SO-group-adq', 'SO-meal-adq', 'SO-dmhh-adq', 'SO-dmfarm-adq'];

 
var impElem = ['AG-hh-ac-imp', 'AG-agr-imp', 'EC-iga-imp', 'EN-landac-imp', 'AG-crop-imp', 'AG-inter-ac-imp', 'EN-weed-imp', 'AG-spm-imp', 'EN-slm-imp',
 'EN_legum_imp', 'EN-fert-imp', 'AG-animal-imp', 'AG-breed-imp', 'AG-health-adq-house', 'AG-health-imp-health', 'AG-new-improvingAccessSecurityRevenues', 'AG-new-improvingAccessBreedsSecurity', 'EC-input-imp', 'EN-wacc-imp', 'EN-wcp-imp', 'EN-wqa-imp',
 'EN-landqa-imp', 'AG-trees-ac-imp', 'EN-lands-imp', 'EN-enerso-imp', 'EN-enercp-imp', 'SO-dist-imp', 'SO-cc-imp', 'AG-infoac-imp', 'EC-ict-imp', 'GO-gov-imp',
 'EC-mkt-imp', 'EC-inc-imp', 'EC-ass-imp', 'EC-fin-imp', 'EC-ins-imp', 'SO-coop-imp', 'SO-group-imp', 'SO-meal-imp', 'SO-dmhh-imp', 'SO-dmfarm-importance1', 'SO-dmfarm-importance2'];

console.log("rows", rows);
    this.getRelativeResilience(rows, academic, adequacy);
    this.getNAmodules(rows, adqElem);
    this.getImportanceLevel(rows, impElem);
    this.getPriorities(rows, academic, adequacy, importance);
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
     getNAmodules(rows, adqElem) {
      var adjust = 2;
      for (var i = 0; i < adqElem.length; i++) {
              var jsonData = {};
              var adq = adqElem[i];
              if (typeof rows[0][adq] === "undefined" || rows[0][adq] === 'NA') {
                if (adq === 'AG-health-adq-health') {
                      jsonData["module"] = "Module 15.2";
                  } else if (adq === 'AG-new-cropsFoodSecurityRevenues') {
                      jsonData["module"] = "Module 16.1";
                  } else if (adq === 'AG-new-breedsFoodSecurityRevenues') {
                      jsonData["module"] = "Module 16.2";
                      adjust = adjust - 2;
                  } else {
                      jsonData["module"] = "Module " + (i + adjust);
                  }
                  this.naModules.push(jsonData);
              } else if (adq === 'AG-new-breedsFoodSecurityRevenues') {
                  adjust = adjust - 2;
              }
        }
    },
    getImportanceLevel(rows, impElem) {
      var notAtAll = [];
      var little = [];
      var avg = [];
      var aLot = [];
      var very = [];
      var adjust = 2;
      for (var i = 0; i < impElem.length; i++) {
            var imp = impElem[i];
            var impLevel = rows[0][imp];
 console.log('ImpLevel module ' + (i + adjust), impLevel);
            if (impLevel === 10) {
              notAtAll.push(i + adjust);
            } else if (impLevel === 7.5) {
              little.push(i + adjust);
            } else if (impLevel === 5) {
              avg.push(i + adjust);
            } else if (impLevel === 2.5) {
              aLot.push(i + adjust);
            } else if (impLevel === 0) {
              very.push(i + adjust);
            }
            if (impLevel === 'notAtAll') {
                if (imp === 'AG-health-adq-house') {
                    adjust = adjust - 1;
                } else if (imp === 'AG-new-improvingAccessSecurityRevenues') {
                    adjust = adjust - 1;
                } else if (imp === 'SO-dmfarm-importance1') {
                    adjust = adjust - 1;
                }
                  notAtAll.push(i + adjust);
            } else if (impLevel === 'aLittle') {
                if (imp === 'AG-health-adq-house') {
                    adjust = adjust - 1;
                } else if (imp === 'AG-new-improvingAccessSecurityRevenues') {
                    adjust = adjust - 1;
                } else if (imp === 'SO-dmfarm-importance1') {
                    adjust = adjust - 1;
                }
              little.push(i + adjust);
            } else if (impLevel === 'average') {
                if (imp === 'AG-health-adq-house') {
                    adjust = adjust - 1;
                } else if (imp === 'AG-new-improvingAccessSecurityRevenues') {
                    adjust = adjust - 1;
                } else if (imp === 'SO-dmfarm-importance1') {
                    adjust = adjust - 1;
                }
              avg.push(i + adjust);
            } else if (impLevel === 'aLot') {
                if (imp === 'AG-health-adq-house') {
                    adjust = adjust - 1;
                } else if (imp === 'AG-new-improvingAccessSecurityRevenues') {
                    adjust = adjust - 1;
                } else if (imp === 'SO-dmfarm-importance1') {
                    adjust = adjust - 1;
                }
              aLot.push(i + adjust);
            } else if (impLevel === 'very') {
                if (imp === 'AG-health-adq-house') {
                    adjust = adjust - 1;
                } else if (imp === 'AG-new-improvingAccessSecurityRevenues') {
                    adjust = adjust - 1;
                } else if (imp === 'SO-dmfarm-importance1') {
                    adjust = adjust - 1;
                }
              very.push(i + adjust);
            }
        }
 console.log('Not at all', notAtAll, little, avg, aLot, very);
        var impModules = [notAtAll, little, avg, aLot, very];
        var impElements = ["Not at all", "A little", "Average", "A lot", "Very"];
        for (var j = 0; j < impElements.length; j++) {
        var jsonData = {};
              jsonData["module"] = impElements[j];
              jsonData["score"] = impModules[j].join();
              this.impElem.push(jsonData);
        }
console.log('jsonData ', jsonData);
    },
    getPriorities(rows, academic, adequacy, importance) {
      for (var i = 0; i < adequacy.length; i++) {
              var jsonData = {};
              var aca = academic[i];
              var adq = adequacy[i];
              var imp = importance[i];
              jsonData["module"] = "Module" + (i + 2);
              var score = rows[0][aca] + (parseFloat(rows[0][adq]) || 0) + (parseFloat(rows[0][imp]) || 0);
              jsonData["score"] = score <= 20 ? parseFloat(Math.round((score) * 100) / 100).toFixed(2) : 20;
              this.table.push(jsonData);
        }
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
      impElem: [],
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
