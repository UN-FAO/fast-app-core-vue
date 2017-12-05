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
        colHeaders: ["English Label", "Spanish Label", "French Label"],
        stretchH: "all",
        autoWrapRow: true,
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
        contextMenu: true,
        filters: true,
        dropdownMenu: true,
        cells: function(row, col, prop) {
          var cellProperties = {};

          if (col === 0) {
            cellProperties.readOnly = true;
          } else {
            cellProperties.readOnly = false;
          }

          return cellProperties;
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
    console.log(this.$refs.hotTable);
    let labels = await this.getLabels();
    this.$refs.hotTable.data = labels;
  },
  components: {
    HotTable
  },
  methods: {
    async getLabels() {
      let labels = await LocalForm.getAllLabels();
      return labels;
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
