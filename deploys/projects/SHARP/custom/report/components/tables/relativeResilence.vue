<template>
<div>
 <q-data-table
      :data="data"
      :config="config"
      :columns="columns"
>
</q-data-table>
<div class="pull-right" style="color:grey">
  *Resilience score = Technical score + Adequacy score
</div>
</div>
</template>
<script>
import { QDataTable } from 'quasar';
import scoresByModule from '../scoresByModule';
export default {
  name: 'relative',
  data() {
    return {
      sub: {},
      config: {
        title: 'Resilience scores',
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        rowHeight: '70px',
        responsive: true,
        pagination: {
          rowsPerPage: 5,
          options: [5, 10, 20, 40]
        },
        messages: {
          noData: this.$t('No data available to show.'),
          noDataAfterFiltering: this.$t(
            'No results. Please refine your search terms.'
          )
        },
        // (optional) Override default labels. Useful for I18n.
        labels: {
          columns: this.$t('Columns'),
          allCols: this.$t('All Columns'),
          rows: this.$t('Rows'),
          selected: {
            singular: this.$t('item selected.'),
            plural: this.$t('items selected.')
          },
          clear: this.$t('clear'),
          search: this.$t('Search'),
          all: this.$t('All')
        }
      },
      columns: [
        {
          label: 'Module',
          field: 'module',
          sort: false,
          type: 'string',
          width: '30px',
          style: { 'text-align': 'center' }
        },
        {
          label: 'Technical score',
          field: 'academic',
          sort: false,
          type: 'string',
          width: '20px',
          style: { 'text-align': 'center' }
        },
        {
          label: 'Adequacy score',
          field: 'adequacy',
          sort: false,
          type: 'string',
          width: '15px',
          style: { 'text-align': 'center' }
        },
        {
          label: 'Resilience score*',
          field: 'score',
          sort: true,
          type: 'number',
          width: '20px',
          style: { 'text-align': 'center' }
        }
      ]
    };
  },
  components: {
    QDataTable
  },
  props: ['submission'],
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
        return {};
      }
      scores.forEach((score, index) => {
        let moduleNumber =
          submission[score.academic] && submission[score.adequacy]
            ? index + 2
            : undefined;
        let jsonData = {};
        if (moduleNumber) {
          jsonData['module'] = moduleNumber + '-' + score.abbreviation;
          jsonData['academic'] = parseFloat(submission[score.academic]) || 0;
          jsonData['adequacy'] = parseFloat(submission[score.adequacy] || 0);
          let calculatedScore =
            (parseFloat(submission[score.academic]) || 0) +
            parseFloat(submission[score.adequacy] || 0);
          jsonData['score'] =
            calculatedScore <= 20
              ? parseFloat(Math.round(calculatedScore * 100) / 100).toFixed(2)
              : 20;
          table.push(jsonData);
        }
      });

      table.sort((a, b) => {
        if (parseFloat(a.score) < parseFloat(b.score)) return -1;
        if (parseFloat(a.score) > parseFloat(b.score)) return 1;
        return 0;
      });
      return table;
    }
  }
};
</script>
