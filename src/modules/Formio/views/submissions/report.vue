<template>
    <q-card color="white">
        <q-card-title>
            Report
        </q-card-title>
        <q-card-separator />
        <q-card-main>
            Card Content
          <div class="row">
                      <div  class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div style="position: relative; height:500px; width:500px">
                        <mybar :chartData="_chartComputedInfo" :options="reportOptions"></mybar>
                        </div>
                      </div>
          </div>
<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-data-table
      :data="table"
      :config="config"
      :columns="columns"
    >
</q-data-table>
</div>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-data-table
        :data="naModules"
        :config="config"
        :columns="columns"
      >

  </q-data-table>
  </div>
 </div>
<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-data-table
      :data="impElem"
      :config="config"
      :columns="columns"
    >
</q-data-table>
</div>
<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-data-table
      :data="allScores"
      :config="config"
      :columns="columns"
    >
</q-data-table>
</div>
</div>
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
import _chunk from "lodash/chunk";
import _map from "lodash/map";
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
    this.submission = resuls.data.data;
    let scoresByModule = this.getScoresByModule();
    this.getRelativeResilience(this.submission, scoresByModule);
    this.getNAmodules(this.submission, scoresByModule);
    this.getImportanceLevel(this.submission, scoresByModule);
    this.getPriorities(this.submission, scoresByModule);
    // console.log("this.table", this.table);
  },
  methods: {
    getScoresByModule() {
      return [
        {
          moduleNumber: 2,
          moduleName: "Household",
          academic: "AG-hh-ac-average",
          importance: "AG-hh-ac-imp",
          adequacy: "AG-hh-ac-adq",
          adequacyElements: ["AG-hh-activityNeeds"],
          importanceElements: ["AG-hh-importantActivities"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 3,
          moduleName: "Agricultural Production Activities",
          academic: "AG-agr-ac-average",
          importance: "AG-agr-imp",
          adequacy: "AG-agr-adq",
          adequacyElements: ["AG-agr-suffHouseholdNeeds"],
          importanceElements: ["AG-agr-diversityFarmSystem"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 4,
          moduleName: "Non-farm Income Generating Activities (IGAS)",
          academic: "EC-iga-ac-average",
          importance: "EC-iga-imp",
          adequacy: "EC-iga-adq",
          adequacyElements: ["EC-iga-igasSufficient"],
          importanceElements: ["EC-iga-igasLivelihood"],
          pillar: "Economic"
        },
        {
          moduleNumber: 5,
          moduleName: "Land Access",
          academic: "EN-landac-ac-average",
          importance: "EN-landac-imp",
          adequacy: "EN-landac-adq",
          adequacyElements: ["EN-landac-adequateAccess"],
          importanceElements: ["EN-landac-communalLandAccess"],
          pillar: "Environment"
        },
        {
          moduleNumber: 6,
          moduleName: "Crop Production",
          academic: "AG-crop-ac-average",
          importance: "AG-crop-imp",
          adequacy: "AG-crop-adq",
          adequacyElements: ["AG-crop-sufficientFarmSystem"],
          importanceElements: ["AG-crop-importantDifferentCrops"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 7,
          moduleName: "Intercropping",
          academic: "AG-inter-ac-average",
          importance: "AG-inter-ac-imp",
          adequacy: "AG_inter_adq",
          adequacyElements: ["AG-inter-cropsMeetingNeeds"],
          importanceElements: ["AG-inter-intercroppingFarmSysted"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 8,
          moduleName: "Weed Species and Management",
          academic: "EN-weed-ac-average",
          importance: "EN-weed-imp",
          adequacy: "EN-weed-adq",
          adequacyElements: ["EN-weed-curtailingNegativeImpact"],
          importanceElements: ["EN-weed-invasiveWeed"],
          pillar: "Environment"
        },
        {
          moduleNumber: 9,
          moduleName: "Pest Management Practices",
          academic: "AG_spm_ac_average",
          importance: "AG-spm-imp",
          adequacy: "AG-spm-adq",
          adequacyElements: ["AG-spm-pestControl"],
          importanceElements: ["AG-spm-importantPestControl"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 10,
          moduleName: "Land Management Practices",
          academic: "EN-slm-ac-average",
          importance: "EN-slm-imp",
          adequacy: "EN-slm-adq",
          adequacyElements: ["EN-slm-improveFarmLand"],
          importanceElements: ["EN-slm-importantPractice"],
          pillar: "Environment"
        },
        {
          moduleNumber: 11,
          moduleName: "Leguminous Plants and Trees",
          academic: "EN_legum_ac_average",
          importance: "EN_legum_imp",
          adequacy: "EN_legum_adq",
          adequacyElements: ["EN-legum-leguminousAffectFarm"],
          importanceElements: ["EN-legum-importanceLeguminous"],
          pillar: "Environment"
        },
        {
          moduleNumber: 12,
          moduleName: "Fertilisation Practices",
          academic: "EN-fert-ac-average",
          importance: "EN-fert-imp",
          adequacy: "EN-fert-adq",
          adequacyElements: ["EN-fert-naturalFertilisers"],
          importanceElements: ["EN-fert-accessNaturalFertilisers"],
          pillar: "Environment"
        },
        {
          moduleNumber: 13,
          moduleName: "Animal Production Practices",
          academic: "AG-animal-ac-average",
          importance: "AG-animal-imp",
          adequacy: "AG-animal-adq",
          adequacyElements: ["AG-animal-sufficientLivestock"],
          importanceElements: ["AG-animal-importantLivestock"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 14,
          moduleName: "Animal Breeding Practices",
          academic: "AG-breed-ac-average",
          importance: "AG-breed-imp",
          adequacy: "AG-breed-adq",
          adequacyElements: ["AG-breed-ableToImprove"],
          importanceElements: ["AG-breed-importantLivestock"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 15,
          moduleName: "Animal Nutrition Practices",
          academic: "AG-health-ac-average",
          importance: "AG-health-imp",
          adequacy: "AG-health-adq",
          adequacyElements: ["AG-health-adq-house", "AG-health-adq-health"],
          importanceElements: ["AG-health-imp-house", "AG-health-imp-health"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 16,
          moduleName: "Utilization of New And Adapted Varieties and Breeds",
          academic: "AG-new-ac-average",
          importance: "AG-new-imp",
          adequacy: "AG-new-adq",
          adequacyElements: [
            "AG-new-cropsFoodSecurityRevenues",
            "AG-new-breedsFoodSecurityRevenues"
          ],
          importanceElements: [
            "AG-new-improvingAccessSecurityRevenues",
            "AG-new-improvingAccessBreedsSecurity"
          ],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 17,
          moduleName: "Farm Inputs",
          academic: "EC-input-ac-average",
          importance: "EC-input-imp",
          adequacy: "EC-input-adq",
          adequacyElements: ["EC-input-accessLocalFarm"],
          importanceElements: ["EC-input-importantAccessLocalFarm"],
          pillar: "Economic"
        },
        {
          moduleNumber: 18,
          moduleName: "Water Access",
          academic: "EN-wacc-ac-average",
          importance: "EN-wacc-imp",
          adequacy: "EN-wacc-adq",
          adequacyElements: ["EN-wacc-sufficientAccess"],
          importanceElements: ["EN-wacc-importantWaterAccess"],
          pillar: "Environment"
        },
        {
          moduleNumber: 19,
          moduleName: "Water Conservation Practices And Techniques",
          academic: "EN-wcp-ac-average",
          importance: "EN-wcp-imp",
          adequacy: "EN-wcp-adq",
          adequacyElements: ["EN-wcp-waterConservationUse"],
          importanceElements: ["EN-wcp-importantWaterConservation"],
          pillar: "Environment"
        },
        {
          moduleNumber: 20,
          moduleName: "Water Quality",
          academic: "EN-wqa-ac-average",
          importance: "EN-wqa-imp",
          adequacy: "EN-wqa-adq",
          adequacyElements: ["EN-wqa-adequacy-Human", "EN-wqa-adequacy-agric"],
          importanceElements: ["EN-wqa-importance"],
          pillar: "Environment"
        },
        {
          moduleNumber: 21,
          moduleName: "Soil Quality and Land Degradation",
          academic: "EN-landqa-ac-average",
          importance: "EN-landqa-imp",
          adequacy: "EN-landqa-adq",
          adequacyElements: ["EN-landqa-richInSoilOrganic"],
          importanceElements: ["EN-landqa-landDegradationImpact"],
          pillar: "Environment"
        },
        {
          moduleNumber: 22,
          moduleName: "Trees",
          academic: "AG-trees-ac-average",
          importance: "AG-trees-ac-imp",
          adequacy: "AG-trees-ac-adq",
          adequacyElements: ["AG-trees-accessTrees"],
          importanceElements: ["AG-trees-howImportant"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 23,
          moduleName: "Landscape Characteristics",
          academic: "EN-lands-ac-average",
          importance: "EN-lands-imp",
          adequacy: "EN-lands-adq",
          adequacyElements: ["EN-lands-yeldLosses"],
          importanceElements: ["EN-lands-importantUnmanagedAreas"],
          pillar: "Environment"
        },
        {
          moduleNumber: 24,
          moduleName: "Energy Sources",
          academic: "EN-enerso-ac-average",
          importance: "EN-enerso-imp",
          adequacy: "EN-enerso-adq",
          adequacyElements: ["EN-enerso-energySufficient"],
          importanceElements: ["EN-enerso-importantAccessEnergy"],
          pillar: "Environment"
        },
        {
          moduleNumber: 25,
          moduleName: "Energy Conservation Practices",
          academic: "EN-enercp-ac-average",
          importance: "EN-enercp-imp",
          adequacy: "EN-enercp-adq",
          adequacyElements: ["EN-enercp-methodsSaveEnergy"],
          importanceElements: ["EN-enercp-importantEnergySaving"],
          pillar: "Environment"
        },
        {
          moduleNumber: 26,
          moduleName: "Disturbances",
          academic: "SO-dist-ac-average",
          importance: "SO-dist-imp",
          adequacy: "SO-dist-adq",
          adequacyElements: ["SO-dist-responsesToDistuurbances"],
          importanceElements: ["SO-dist-disturbancesAffect"],
          pillar: "Social"
        },
        {
          moduleNumber: 27,
          moduleName: "Climate Change",
          academic: "SO-cc-ac-average",
          importance: "SO-cc-imp",
          adequacy: "SO-cc-adq",
          adequacyElements: ["SO-cc-strategiesSatisfaction"],
          importanceElements: ["SO-cc-changingClimatePriority"],
          pillar: "Social"
        },
        {
          moduleNumber: 28,
          moduleName:
            "Access To Information On Weather And Climate Change Adaptation Practices",
          academic: "AG-infoac-ac-average",
          importance: "AG-infoac-imp",
          adequacy: "AG-infoac-adq",
          adequacyElements: ["AG-infoac-usefulFarmSystemInfo"],
          importanceElements: ["AG-infoac-climateChangeAdaptation"],
          pillar: "Agronomic"
        },
        {
          moduleNumber: 29,
          moduleName:
            "Information And Comunication Technologies (ICTS) (Sensitive Question)",
          academic: "EC-ict-ac-average",
          importance: "EC-ict-imp",
          adequacy: "EC-ict-adq",
          adequacyElements: ["EC-ict-accessICTfarmSystem"],
          importanceElements: ["EC-ict-importantareICTfarmSystem"],
          pillar: "Economic"
        },
        {
          moduleNumber: 30,
          moduleName:
            "Goverment Policies and Programmes On Climate Change And Sustainable Agriculture",
          academic: "GO-gov-ac-average",
          importance: "GO-gov-imp",
          adequacy: "GO-gov-adq",
          adequacyElements: ["GO-gov-helpfulsupportlivelihood"],
          importanceElements: ["GO-gov-importantSupportLivelihood"],
          pillar: "Goverment"
        },
        {
          moduleNumber: 31,
          moduleName: "Access to Markets",
          academic: "EC-mkt-ac-average",
          importance: "EC-mkt-imp",
          adequacy: "EC-mkt-adq",
          adequacyElements: ["EC-Mkt-adequacy"],
          importanceElements: ["EC-Mkt-importance"],
          pillar: "Economic"
        },
        {
          moduleNumber: 32,
          moduleName: "Income Sources, Expenditures And Savings",
          academic: "EC-inc-ac-average",
          importance: "EC-inc-imp",
          adequacy: "EC-inc-adq",
          adequacyElements: ["EC-inc-incomeSources"],
          importanceElements: ["EC-inc-importantIncomeSources"],
          pillar: "Economic"
        },
        {
          moduleNumber: 33,
          moduleName: "Major Productive Assets",
          academic: "EC-ass-ac-average",
          importance: "EC-ass-imp",
          adequacy: "EC-ass-adq",
          adequacyElements: ["EC-ass-assetsAdequate"],
          importanceElements: ["EC-ass-importantProductiveAsset"],
          pillar: "Economic"
        },
        {
          moduleNumber: 34,
          moduleName: "Access to Financial Services",
          academic: "EC-fin-ac-average",
          importance: "EC-fin-imp",
          adequacy: "EC-fin-adq",
          adequacyElements: ["EC-fin-adequacy"],
          importanceElements: ["EC-fin-importance"],
          pillar: "Economic"
        },
        {
          moduleNumber: 35,
          moduleName: "Insurance",
          academic: "EC-ins-ac-average",
          importance: "EC-ins-imp",
          adequacy: "EC-ins-adq",
          adequacyElements: ["EC-ins-adequacy"],
          importanceElements: ["EC-ins-importance"],
          pillar: "Economic"
        },
        {
          moduleNumber: 36,
          moduleName: "Community Cooperation",
          academic: "SO-coop-ac-average",
          importance: "SO-coop-imp",
          adequacy: "SO-coop-adq",
          adequacyElements: ["SO-coop-adequacy"],
          importanceElements: ["SO-coop-importance"],
          pillar: "Social"
        },
        {
          moduleNumber: 37,
          moduleName: "Group Membership",
          academic: "SO-group-ac-average",
          importance: "SO-group-imp",
          adequacy: "SO-group-adq",
          adequacyElements: ["SO-group-adequacy"],
          importanceElements: ["SO-group-importance"],
          pillar: "Social"
        },
        {
          moduleNumber: 38,
          moduleName: "Meals",
          academic: "SO-meal-ac-average",
          importance: "SO-meal-imp",
          adequacy: "SO-meal-adq",
          adequacyElements: ["SO-meal-adequacy"],
          importanceElements: ["SO-meal-importance"],
          pillar: "Social"
        },
        {
          moduleNumber: 39,
          moduleName: "Decision-Making (Household)",
          academic: "SO-dmhh-ac-average",
          importance: "SO-dmhh-imp",
          adequacy: "SO-dmhh-adq",
          adequacyElements: ["SO-dmhh-adequacy"],
          importanceElements: ["SO-dmhh-importance"],
          pillar: "Social"
        },
        {
          moduleNumber: 40,
          moduleName: "Decision-Making (Farm Management)",
          academic: "SO-dmfarm-ac-average",
          importance: "SO-dmfarm-imp",
          adequacy: "SO-dmfarm-adq",
          adequacyElements: ["SO-dmfarm-decisionMakingSatisfaction"],
          importanceElements: [
            "SO-dmfarm-importance1",
            "SO-dmfarm-importance2"
          ],
          pillar: "Social"
        }
      ];
    },
    getRelativeResilience(submission, scores) {
      scores.forEach((score, index) => {
        let moduleNumber =
          submission[score.academic] && submission[score.adequacy]
            ? index + 2
            : undefined;
        let jsonData = {};
        if (moduleNumber) {
          jsonData["module"] = moduleNumber;
          jsonData["moduleName"] = score.moduleName;
          let calculatedScore =
            (parseFloat(submission[score.academic]) || 0) +
            parseFloat(submission[score.adequacy] || 0);
          jsonData["score"] =
            calculatedScore <= 20
              ? parseFloat(Math.round(calculatedScore * 100) / 100).toFixed(2)
              : 20;
          this.table.push(jsonData);
        }
      });
    },
    getNAmodules(submission, scores) {
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
            jsonData["module"] = moduleNumber;
            jsonData["moduleName"] = score.moduleName;
            this.naModules.push(jsonData);
          }
        });
      });
    },
    getImportanceLevel(submission, scores) {
      let levels = {
        notAtAll: [],
        aLittle: [],
        average: [],
        aLot: [],
        very: []
      };
      scores.forEach((score, index) => {
        score.importanceElements.forEach(element => {
          switch (submission[element]) {
            case "notAtAll":
              levels.notAtAll.push(index + 2);
              break;
            case "aLittle":
              levels.aLittle.push(index + 2);
              break;
            case "average":
              levels.average.push(index + 2);
              break;
            case "aLot":
              levels.aLot.push(index + 2);
              break;
            case "very":
              levels.very.push(index + 2);
              break;
          }
        });
      });

      this.impElem.push({
        module: "Not at all",
        score: this.formatImportanceModules(levels.notAtAll)
      });
      this.impElem.push({
        module: "A little",
        score: this.formatImportanceModules(levels.aLittle)
      });
      this.impElem.push({
        module: "Average",
        score: this.formatImportanceModules(levels.average)
      });
      this.impElem.push({
        module: "A lot",
        score: this.formatImportanceModules(levels.aLot)
      });
      this.impElem.push({
        module: "Very",
        score: this.formatImportanceModules(levels.very)
      });
    },
    formatImportanceModules(modulesArray) {
      let chunks = _chunk(modulesArray, 5);
      let modules = "";
      chunks.forEach(chunk => {
        modules = modules + chunk.join(" - ") + "</br>";
      });
      return modules;
    },
    getPriorities(submission, scores) {
      scores.forEach((score, index) => {
        let moduleNumber =
          submission[score.academic] &&
          submission[score.adequacy] &&
          submission[score.importance]
            ? index + 2
            : undefined;
        let jsonData = {};
        if (moduleNumber) {
          jsonData["module"] = moduleNumber;
          jsonData["moduleName"] = score.moduleName;
          let calculatedScore =
            (parseFloat(submission[score.academic]) || 0) +
            (parseFloat(submission[score.adequacy]) || 0) +
            (parseFloat(submission[score.importance]) || 0);
          jsonData["score"] =
            calculatedScore <= 30
              ? parseFloat(Math.round(calculatedScore * 100) / 100).toFixed(2)
              : 30;
          this.allScores.push(jsonData);
        }
      });
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
    reportOptions() {
      return {
        title: {
          display: true,
          text: "Custom Chart Title"
        },
        scale: {
          pointLabels: {
            fontSize: 20
          },
          ticks: {
            beginAtZero: true,
            max: 20
          }
        }
      };
    },
    _chartComputedInfo() {
      if (!this.submission) {
        return {};
      }
      let scores = this.getScoresByModule();
      let uniquePillars = _map(scores, "pillar");
      uniquePillars = Array.from(new Set(uniquePillars));
      console.log("", uniquePillars);
      let results = [];
      uniquePillars.forEach(pillar => {
        let value = 0;
        let count = 0;
        value = scores.reduce((total, currentScore) => {
          if (currentScore.pillar === pillar) {
            let calculatedScore =
              (parseFloat(this.submission[currentScore.academic]) || 0) +
              parseFloat(this.submission[currentScore.adequacy] || 0);
            calculatedScore =
              calculatedScore <= 20
                ? parseFloat(Math.round(calculatedScore * 100) / 100).toFixed(2)
                : 20;
            console.log("pillar", pillar, calculatedScore);
            return parseFloat(total) + parseFloat(calculatedScore);
          }
          return total + 0;
        }, 0);
        count = scores.reduce((total, currentScore) => {
          let moduleNumber =
          this.submission[currentScore.academic] && this.submission[currentScore.adequacy]
          if (currentScore.pillar === pillar && moduleNumber) {
            return total + 1;
          }
          return total + 0;
        }, 0);
        let final = count > 0 ? (value / count) : 0
        results.push(final);
      });
      console.log("results", results);
      // this.submission
      return {
        labels: uniquePillars,
        datasets: [
          {
            label: "Your Submission",
            data: results,
            backgroundColor: "rgba(255, 99, 132,0.2)",
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 1
          },
          {
            label: "AVG",
            data: [10, 10, 10, 10, 10],
            backgroundColor: "rgba(75, 192, 192,0.2)",
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 1
          }
        ]
      };
    }
  },
  data() {
    return {
      submission: {},
      table: [],
      naModules: [],
      impElem: [],
      allScores: [],
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
          rowsPerPage: 5,
          options: [5, 10, 20, 40]
        },
        messages: {
          noData: "No data available to show.",
          noDataAfterFiltering: "No results. Please refine your search terms."
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
          label: "Module Name",
          field: "moduleName",
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
