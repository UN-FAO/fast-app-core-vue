<template>
  <q-item>
    <q-item-side>
      <q-knob
        size="70px"
        v-model="language.completed"
        color="primary"
        line-width="3px"
        :min="0"
        :max="100"
        readonly
      >
        {{language.completed}}
        <q-icon class="on-right" name="fa-percent"/>
      </q-knob>
    </q-item-side>
    <q-item-main :label="language.name"></q-item-main>
    <q-item-side right icon="more_vert">
      <q-popover ref="popover">
        <q-list link>
          <q-item @click="exportToExcel()">
            <q-item-main :label="$t('Export to Excel')" />
          </q-item>
        </q-list>
      </q-popover>
    </q-item-side>
  </q-item>
</template>

<script>
import { QItem, QItemSide, QItemMain, QItemTile, QKnob, QIcon, QList, QPopover } from "quasar";
import ExcelExport from './ExportTranslationToExcel';

export default {
  name: "LanguageItem",
  components: {
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QKnob,
    QList,
    QPopover,
    QIcon
  },
  props: {
    language: {
      required: true
    }
  },
  methods: {
    async exportToExcel() {
      await ExcelExport(this.language);
      this.$refs.popover.close();
    }
  },
  watch: {
    language: data => {}
  }
};
</script>
