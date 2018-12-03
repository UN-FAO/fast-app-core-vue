<template>
<div>
 <q-data-table
      :data="data"
      :config="config"
      :columns="columns"
>
</q-data-table>
<div class="pull-right" style="color:grey">
  {{this.$t('*Compound score = (technical score + adequacy score + importance score)')}}
</div>
</div>

</template>
<script>
import { QDataTable } from 'quasar';
import scoresByModule from '../scoresByModule';
export default {
  name: 'priorities',
  data() {
    return {
      sub: {},
      config: {
        title: this.$t('SHARP+ ranking'),
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
          label: this.$t('Rank'),
          field: 'rank',
          type: 'string',
          width: '12%',
          style: { 'text-align': 'center' }
        },
        {
          label: this.$t('Module'),
          field: 'module',
          type: 'string',
          width: '60%',
          style: { 'text-align': 'center' }
        },
        {
          label: this.$t('Compound score*'),
          field: 'score',
          type: 'number',
          width: '30%',
          sort: true,
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
      let i = 0;
      scores.forEach((score, index) => {
        let moduleNumber =
          submission[score.academic] &&
          submission[score.adequacy] &&
          submission[score.importance]
            ? index + 2
            : undefined;
        let jsonData = {};
        if (moduleNumber) {
          jsonData['module'] = this.$t(score.abbreviation);
          let calculatedScore =
            (parseFloat(submission[score.academic]) || 0) +
            (parseFloat(submission[score.adequacy]) || 0) +
            (parseFloat(submission[score.importance]) || 0);
          jsonData['score'] =
            calculatedScore <= 30
              ? parseFloat(Math.round(calculatedScore * 100) / 100).toFixed(2)
              : 30;
          jsonData['rank'] = i + 1;
          i++;
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
