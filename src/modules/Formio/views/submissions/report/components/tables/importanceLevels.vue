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
import { QDataTable } from 'quasar';
import scoresByModule from '../scoresByModule';
import _chunk from 'lodash/chunk';
export default {
  name: 'importance',
  data() {
    return {
      config: {
        title: this.$t("Respondent's perceived priorities"),
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
          label: this.$t('Priority level'),
          field: 'module',
          sort: false,
          type: 'string',
          width: '20px',
          style: { 'text-align': 'center' }
        },
        {
          label: this.$t('Module'),
          field: 'score',
          sort: false,
          type: 'string',
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
        return {};
      }

      scores.forEach((score, index) => {
        score.importanceElements.forEach((element) => {
          let module = index + 2 + ' - ' + this.$t(score.abbreviation);
          switch (submission[element]) {
            case 'notAtAll':
              levels.notAtAll.push(module);
              break;
            case 'aLittle':
              levels.aLittle.push(module);
              break;
            case 'average':
              levels.average.push(module);
              break;
            case 'aLot':
              levels.aLot.push(module);
              break;
            case 'very':
              levels.very.push(module);
              break;
          }
        });
      });

      table.push({
        module: this.$t('Very high priority'),
        score: this.formatImportanceModules(
          levels.very.filter(function(item, pos, a) {
            return a.indexOf(item) === pos;
          })
        )
      });

      table.push({
        module: this.$t('High priority'),
        score: this.formatImportanceModules(
          levels.aLot.filter(function(item, pos, a) {
            return a.indexOf(item) === pos;
          })
        )
      });

      table.push({
        module: this.$t('Medium priority'),
        score: this.formatImportanceModules(
          levels.average.filter(function(item, pos, a) {
            return a.indexOf(item) === pos;
          })
        )
      });

      table.push({
        module: this.$t('Low priority'),
        score: this.formatImportanceModules(
          levels.aLittle.filter(function(item, pos, a) {
            return a.indexOf(item) === pos;
          })
        )
      });

      table.push({
        module: this.$t('Not a priority'),
        score: this.formatImportanceModules(
          levels.notAtAll.filter(function(item, pos, a) {
            return a.indexOf(item) === pos;
          })
        )
      });

      return table;
    }
  },
  methods: {
    formatImportanceModules(modulesArray) {
      let chunks = _chunk(modulesArray, 1);
      let modules = '';
      if (!chunks) {
        return [];
      }
      chunks.forEach((chunk) => {
        modules = modules + chunk.join(' - ') + '</br>';
      });
      return modules;
    }
  }
};
</script>
