<template>
<div>
  <br>
 <p class="caption"><strong style="font-weight: 400;font-size: 1.8vh;">Select domain: </strong>

    <q-radio v-model="option" val="Agronomic" label="Agronomic" style="color:black" />
  <q-radio v-model="option" val="Economic" label="Economic" style="color:black"/>
  <q-radio v-model="option" val="Environment" label="Environment" style="color:black" />
  <q-radio v-model="option" val="Social" label="Social" style="color:black" />
 </p>


  <div class="reponsiveRadar">
    <radar :chartData="data" :options="reportOptions"/>
  </div>

</div>
</template>
<script>
import scoresByModule from "../scoresByModule";
import radar from "./radar";
import { QRadio, QBtnToggle } from "quasar";
export default {
  name: "radarModules",
  data() {
    return {
      option: "Agronomic"
    };
  },
  components: {
    radar,
    QRadio,
    QBtnToggle
  },
  props: ["submission"],
  watch: {
    submission: function(val) {}
  },
  computed: {
    data() {
      if (!this.submission) {
        return {};
      }
      let pillar = this.option;
      let scores = scoresByModule.get();
      let results = [];
      let modules = [];
      let min = [];
      let middle = [];
      let max = [];
      if (!scores) {
        return {};
      }
      scores.forEach((score, index) => {
        if (score.pillar === pillar) {
          modules.push(
            2 + index + " - " + score.moduleName.substr(0, 14) + "\u2026"
          );
          let calculatedScore =
            (parseFloat(this.submission[score.academic]) || 0) +
            parseFloat(this.submission[score.adequacy] || 0);
          calculatedScore =
            calculatedScore <= 20
              ? parseFloat(Math.round(calculatedScore * 100) / 100).toFixed(2)
              : 20;
          results.push(parseFloat(calculatedScore));
          min.push(7);
          middle.push(12);
          max.push(20);
        }
      }, 0);
      modules = Array.from(new Set(modules));
      // this.submission
      return {
        labels: modules,
        datasets: [
          {
            label: "Respondent's Score",
            data: results,
            backgroundColor: "rgba(54, 162, 235, 0)",
            borderColor: "rgba(0, 0, 0, 0.6)",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "rgba(0, 0, 0, 0.6)",
            pointBorderColor: "rgba(0, 0, 0, 0.6)"
          },
              {
            label: "Low Resilience",
            data: min,
            backgroundColor: "rgba(242, 31, 31, 0.4)",
            borderColor: "rgba(242, 31, 31, 0)",
            borderWidth: 0,
            pointRadius: 0,
            pointBackgroundColor: "rgb(255, 99, 132)"
          },
            {
            label: "Mid Resilience",
            data: middle,
            backgroundColor: "rgba(255, 255, 51, 0.65)",
            borderColor: "rgba(255, 255, 51, 0)",
            borderWidth: 0,
            pointRadius: 0,
            pointBackgroundColor: "rgb(255, 99, 132)"
          },
          {
            label: "High Resilience",
            data: max,
            backgroundColor: "rgba(128, 255, 128, 0.2)",
            borderColor: "rgba(128, 255, 128, 0.2)",
            borderWidth: 0,
            pointRadius: 0,
            pointBackgroundColor: "rgb(255, 99, 132)"
          }
        ]
      };
    },
    reportOptions() {
      return {
        title: {
          display: false,
          text: ""
        },
        legend: {
          position: "bottom"
        },
        scale: {
          pointLabels: {
            fontSize: 12
          },
          ticks: {
            beginAtZero: true,
            max: 20
          }
        }
      };
    }
  }
};
</script>
