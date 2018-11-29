<template>
  <div>

    {{numberOfLanguages}}
    <span style="color:grey">{{$t('Supported Languages')}}</span>
    
    <q-input
      v-model.lazy="languageSearch"
      type="text"
      :stack-label="$t('NAME FILTER')"
      :placeholder="$t('search...')"
      :after="[{  icon: 'fa-search'}]"
      clearable
    />
    <div class="row">
      <div class="col-md-12">
        <span class="pull-right">
          <div class="button-group">
            <q-btn color="primary" @click="importFromExcel()">{{ $t('Import') }}</q-btn>
            <q-btn color="secondary" @click="exportToExcel()">{{ $t('Export') }}</q-btn>
          </div>
        </span>
      </div>
    </div>
    <q-list separator no-border link="">
      <language-item
        :language="language"
        v-for="(language, code) in filteredLanguages"
        :key="code"
        @click.native="$emit('selected', {language})"
      />
    </q-list>
  </div>
</template>

<style>
.button-group {
  margin: 0 auto;
}
</style>


<script>
import LanguageItem from "./LanguageItem";
import { Utilities } from "fast-fastjs";
import { QInput, QList, QBtn, QBtnGroup } from "quasar";
import ExcelExport from './ExportTranslationToExcel';
import ExcelImport from './ImportTranslationFromExcel';
export default {
  name: "LanguageSelector",
  components: {
    LanguageItem,
    QInput,
    QList,
    QBtn,
    QBtnGroup
  },
  data() {
    return {
      languageSearch: ""
    };
  },
  props: {
    languages: {
      required: true
    }
  },
  methods: {
    async exportToExcel() {
      await ExcelExport();
    },
    async importFromExcel() {
      const file = await this.$swal({
        title: this.$t('Select your Excel file'),
        input: 'file',
        inputAttributes: {
          accept: '.xlsx',
          'aria-label': this.$t('Upload your Excel File')
        }
      });

      if (file) {
        await ExcelImport(file);
      }
    }
  },
  watch: {
    languages: data => {}
  },
  computed: {
    numberOfLanguages() {
      return Utilities.get(() => Object.keys(this.languages).length - 1, 0);
    },
    filteredLanguages() {
      let languages = {};
      Object.keys(this.languages).forEach(code => {
        const name = this.languages[code].name;
        if (
          name.toLowerCase().indexOf(this.languageSearch) > -1 &&
          code !== "label"
        ) {
          languages[code] = this.languages[code];
        }
      });
      return languages;
    }
  }
};
</script>
<style>
input.col.q-input-target.text-left {
  border-bottom: #00000021 1px solid;
}
</style>

