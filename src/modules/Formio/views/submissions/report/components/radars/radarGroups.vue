<template>
  <div class="reponsiveRadar">
    <radar :chartData="data" :options="reportOptions"/>
  </div>
</template>
<script>
import scoresByModule from '../scoresByModule';
import radar from './radar';
import _map from 'lodash/map';
export default {
  name: 'radarGroups',
  components: {
    radar
  },
  props: ['submission'],
  watch: {
    submission: function(val) {}
  },
  computed: {
    data() {
      if (!this.submission) {
        return [{}];
      }
      let scores = scoresByModule.get();
      let uniquePillars = _map(scores, 'pillar');
      uniquePillars = Array.from(new Set(uniquePillars));
      if (!uniquePillars) {
        return [{}];
      }

      uniquePillars = uniquePillars.map((name) => {
        name = this.$t(name);
        return name;
      });
      let results = [];
      uniquePillars.forEach((pillar) => {
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
            return parseFloat(total) + parseFloat(calculatedScore);
          }
          return total + 0;
        }, 0);

        count = scores.reduce((total, currentScore) => {
          let moduleNumber =
            this.submission[currentScore.academic] &&
            this.submission[currentScore.adequacy];
          if (currentScore.pillar === pillar && moduleNumber) {
            return total + 1;
          }
          return total + 0;
        }, 0);
        let final = count > 0 ? value / count : 0;
        final =
          final <= 20
            ? parseFloat(Math.round(final * 100) / 100).toFixed(2)
            : 20;
        results.push(final);
      });
      // this.submission
      return {
        labels: uniquePillars,
        datasets: [
          {
            label: this.$t("Respondent's Score"),
            data: results,
            backgroundColor: 'rgba(54, 162, 235, 0)',
            borderColor: 'rgba(0, 0, 0, 0.6)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(0, 0, 0, 0.6)',
            pointBorderColor: 'rgba(0, 0, 0, 0.6)'
          },
          {
            label: this.$t('Low Resilience'),
            data: [7, 7, 7, 7, 7],
            backgroundColor: 'rgba(242, 31, 31, 0.4)',
            borderColor: 'rgba(242, 31, 31, 0)',
            borderWidth: 0,
            pointRadius: 0,
            pointBackgroundColor: 'rgb(255, 99, 132)'
          },
          {
            label: this.$t('Mid Resilience'),
            data: [12, 12, 12, 12, 12],
            backgroundColor: 'rgba(255, 255, 51, 0.65)',
            borderColor: 'rgba(255, 255, 51, 0)',
            borderWidth: 0,
            pointRadius: 0,
            pointBackgroundColor: 'rgb(255, 99, 132)'
          },
          {
            label: this.$t('High Resilience'),
            data: [20, 20, 20, 20, 20],
            backgroundColor: 'rgba(128, 255, 128, 0.2)',
            borderColor: 'rgba(128, 255, 128, 0.2)',
            borderWidth: 0,
            pointRadius: 0,
            pointBackgroundColor: 'rgb(255, 99, 132)'
          }
        ]
      };
    },
    reportOptions() {
      return {
        title: {
          display: false,
          text: ''
        },
        legend: {
          position: 'bottom'
        },
        scale: {
          pointLabels: {
            fontSize: 15
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
