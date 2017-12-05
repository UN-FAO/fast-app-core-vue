<template>
   <div id="hot-preview">
    <HotTable :root="root" :ref="root" :settings="hotSettings"></HotTable>
  </div>
</template>

<script>
import HotTable from "vue-handsontable-official";
import LocalForm from "database/collections/scopes/LocalForm";
export default {
  data: function() {
    return {
      root: "hotTable",
      hotSettings: {
        data: [],
        colHeaders: [],
        stretchH: "all",
        autoWrapRow: false,
        rowHeaders: true,
        columnSorting: true,
        sortIndicator: true,
        autoColumnSize: {
          samplingRatio: 23
        },
        height: 800,
        renderAllRows: false,
        manualRowResize: true,
        manualColumnResize: true,
        manualRowMove: true,
        manualColumnMove: true,
        contextMenu: false,
        filters: true,
        dropdownMenu: true,
        cells: function(row, col, prop) {
          /*
          var cellProperties = {};

          if (col === 0) {
            cellProperties.readOnly = true;
          } else {
            cellProperties.readOnly = false;
          }

          return cellProperties;
          */
        },
        modifyColWidth: function(width, col) {
          if (width > 200) {
            return 150;
          }
        },
        afterChange: function(changes, source) {
          if (changes && this.getData()) {
            let changedRow = this.getData()[changes[0][0]];
            let changedLabel = changedRow[0];
            let changedFrom = changes[0][2];
            let changedTo = changes[0][3];
            if (source === "edit" && changedLabel) {
              console.log(changedLabel);
              console.log(changedFrom, changedTo);
            }
          }
        }
      }
    };
  },
  async mounted() {
    let translations = await this.getLabels();
    console.log(translations.columns);
    this.$refs.hotTable.data = translations.labels;
    this.$refs.hotTable.colHeaders = translations.columns;
  },
  components: {
    HotTable
  },
  methods: {
    async getLabels() {
      let translations = await LocalForm.getAllLabels();
      return translations;
    }
  }
};
</script>
<style>
#hotTable {
  overflow: hidden;
  color: black !important;
}
</style>
