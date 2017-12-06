<template>
    <div id="hot-preview">
    <HotTable :root="root" :ref="root" :settings="hotSettings"></HotTable>
  </div>
</template>
<script>
import HotTable from "vue-handsontable-official";
export default {
  components: {
    HotTable
  },
  name: "hottable",
  props: {
    translations: {
      required: true
    }
  },
  async mounted() {
    this.$refs.hotTable.data = this.translations.labels;
    this.$refs.hotTable.colHeaders = this.translations.columns;
  },
  watch: {
    translations: function(trans) {
      this.$refs.hotTable.data = trans.labels;
      this.$refs.hotTable.colHeaders = trans.columns;
    }
  },
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
  }
};
</script>
<style>
#hot-preview {
  padding-top: 30px;
}
#hotTable {
  overflow: hidden;
  color: black !important;
}
</style>
