<template>
    <div id="hot-preview">
    <HotTable :root="root" :ref="root" :settings="hotSettings"></HotTable>
  </div>
</template>
<script>
import HotTable from "vue-handsontable-official";
import Localization from "modules/Localization/Localization";
import { Toast } from "quasar";
import _indexOf from "lodash/indexOf";
import _forEach from "lodash/forEach";

export default {
  components: {
    HotTable,
    Toast
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
  methods: {
    async updateTranslation(label, translations) {
      await Localization.setTranslations(label, translations);
      Toast.create.positive({ html: "TRANSLATION UPDATED" });
      this.$eventHub.emit("Translation:updated", {
        changed: label,
        translations: translations
      });
    }
  },
  watch: {
    translations: function(trans) {
      this.$refs.hotTable.data = trans.labels;
      this.$refs.hotTable.colHeaders = trans.columns;
    }
  },
  data: function() {
    let self = this;
    return {
      root: "hotTable",
      hotSettings: {
        data: [],
        colHeaders: [],
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
        manualRowResize: false,
        manualColumnResize: true,
        manualRowMove: false,
        manualColumnMove: false,
        contextMenu: false,
        filters: true,
        dropdownMenu: true,
        cells: function(row, col, prop) {
          var cellProperties = {};
          if (
            col === 0 ||
            col === _indexOf(self.$refs.hotTable.colHeaders, "label")
          ) {
            cellProperties.readOnly = true;
          } else {
            cellProperties.readOnly = false;
          }

          return cellProperties;
        },
        modifyColWidth: function(width, col) {
          if (col === 1) {
            return 1;
          }
          if (width > 400) {
            return 200;
          }
          if (width < 100 && col !== 1) {
            return 200;
          }
        },
        afterChange: async function(changes, source) {
          if (changes && this.getData()) {
            let changedRow = this.getData()[changes[0][0]];
            // let changedColumn = self.$refs.hotTable.colHeaders[changes[0][1]]
            let changedLabel = changedRow[0];
            // let changedFrom = changes[0][2];
            // let changedTo = changes[0][3];
            if (source === "edit" && changedLabel) {
              let translations = {};
              _forEach(self.translations.columns, languageCode => {
                let index = _indexOf(
                  self.$refs.hotTable.colHeaders,
                  languageCode
                );
                if (changedRow[index] === "") {
                  translations[languageCode] = undefined;
                } else {
                  translations[languageCode] = changedRow[index];
                }
              });
              delete translations["Form Label"];
              await self.updateTranslation(changedLabel, translations);
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
  width: 100%;
}
#hotTable {
  overflow: hidden;
  color: black !important;
  width: 100%;
}

#hot-container{
  width: 100%;
}
</style>
