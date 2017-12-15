<template>
<div>
  <div v-if="!hasTranslation()">
  <div class="translations-action-bar pull-right">
    <q-btn round color="primary" icon="translate" @click="createTranslations" >
      <q-tooltip>
        Create translations
    </q-tooltip>
    </q-btn>

    <q-btn round color="primary" icon="refresh" @click="updateValues" >
      <q-tooltip>
        Update
    </q-tooltip>
    </q-btn>

    <q-btn round color="primary" icon="fa-plus" @click="addLanguage" >
      <q-tooltip>
        Add Language
    </q-tooltip>
    </q-btn>
  </div>
</div>
<div class="justify-center">
  <div class="loading" v-if="hasTranslation()">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
  </div>
  <div v-if="!hasTranslation()">
      <tstats :stats="translations.stats"> </tstats>

      <q-btn icon="fa-filter" ref="target" color="primary" outline>
        Forms
    <!-- Direct child of target -->
    <q-popover  ref="popover" anchor="bottom middle" max-height="300px" fit>
      <q-input
          v-model="search"
          type="text"
          stack-label="NAME FILTER"
          placeholder="search..."
          :after="[{  icon: 'fa-search'}]"
          clearable
          inverted
        />
        <div class="row pull-right">
        <q-btn ref="target" color="primary" flat @click="allFilters()">
          All
        </q-btn>
        <q-btn ref="target" color="primary" flat @click="clearFilters()">
          Clear
        </q-btn>
        <q-btn ref="target" color="primary" flat @click="filterTable()">
          Apply
        </q-btn>
      </div>
      <br><br>
      <div v-for="form in filteredForms" :key="form.data.title" >
      <q-checkbox style="text-transform: uppercase;" v-model="selection" :val="form.data.title" :label="form.data.title"/>
      </hr>
      <br><br>
      </div>
    </q-popover>
  </q-btn>

  <q-btn icon="fa-filter" ref="target" color="primary" outline>
        Languages
    <!-- Direct child of target -->
    <q-popover  ref="popover" anchor="bottom middle" max-height="300px" fit>
      <q-input
          v-model="languageSearch"
          type="text"
          stack-label="LANGUAGE FILTER"
          placeholder="search..."
          :after="[{  icon: 'fa-search'}]"
          clearable
          inverted
        />
        <div class="row pull-right">
        <q-btn ref="target" color="primary" flat @click="allLanguageFilters()">
          All
        </q-btn>
        <q-btn ref="target" color="primary" flat @click="clearLanguageFilters()">
          Clear
        </q-btn>
        <q-btn ref="target" color="primary" flat @click="filterTable()">
          Apply
        </q-btn>
      </div>
      <br><br>
      <div v-for="language in filteredLanguages" :key="language.code" >
      <q-checkbox style="text-transform: uppercase;" v-model="languageSelection" :val="language.code" :label="language.label"/>
      </hr>
      <br><br>
      </div>
    </q-popover>
  </q-btn>
  <q-input
          v-model="searchBox"
          type="text"
          stack-label=" TRANSLATION FILTER"
          placeholder="Search..."
          :after="[{  icon: 'fa-search'}]"
          clearable
        />


    <hottable :translations="translations" :labels="filteredLabels"></hottable>
  </div>
</div>
</div>
</template>

<style scoped>
.q-checkbox {
  color: black;
}
</style>
<script>
import LocalForm from "database/collections/scopes/LocalForm";
import LocalTranslation from "database/collections/scopes/LocalTranslation";
import Localization from "modules/Localization/Localization";
import { mapActions } from "vuex";
import {
  QBtn,
  QTooltip,
  Toast,
  QSpinnerGears,
  QInnerLoading,
  QCheckbox,
  QPopover,
  QInput
} from "quasar";
import tstats from "./stats";
import hottable from "./hottable";
import Promise from "bluebird";
import _forEach from "lodash/forEach";
import _isEmpty from "lodash/isEmpty";
import _map from "lodash/map";

export default {
  data: function() {
    return {
      translations: [],
      progress: 0,
      selection: [],
      languageSelection: [],
      formNameFilters: [],
      languageNameFilters: [],
      search: "",
      languageSearch: "",
      searchBox: ""
    };
  },
  async mounted() {
    this.updateValues();
    this.$eventHub.on("Translation:updated", data => {
      this.updateValues();
    });
    this.formNameFilters = await LocalForm.find();
    this.languageNameFilters = await LocalTranslation.supportedLanguages();
    this.selection = _map(this.formNameFilters, "data.title");
    this.languageSelection = _map(this.languageNameFilters, "code");
  },
  components: {
    QBtn,
    QTooltip,
    tstats,
    hottable,
    QSpinnerGears,
    QInnerLoading,
    QCheckbox,
    QPopover,
    QInput
  },
  computed: {
    filteredForms: function() {
      return this.formNameFilters.filter(formNameFilter => {
        return (
          formNameFilter.data.title
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) >= 0
        );
      });
    },
    filteredLanguages: function() {
      return this.languageNameFilters.filter(languageNameFilter => {
        return (
          languageNameFilter.label
            .toLowerCase()
            .indexOf(this.languageSearch.toLowerCase()) >= 0
        );
      });
    },
    filteredLabels: function() {
      this.searchBox.toLowerCase();
      let labels = this.translations.labels.filter(translation => {
        return translation.join(",").indexOf(this.searchBox.toLowerCase()) > -1;
      });
      return labels;
    }
  },
  methods: {
    ...mapActions(["getResources"]),
    hasTranslation() {
      return _isEmpty(this.translations);
    },
    allFilters() {
      this.selection = _map(this.formNameFilters, "data.title");
    },
    allLanguageFilters() {
      this.languageSelection = _map(this.languageNameFilters, "code");
    },
    clearLanguageFilters() {
      this.languageSelection = [];
    },
    clearFilters() {
      this.selection = [];
    },
    async filterTable() {
      this.translations = await LocalForm.getAllLabels(
        this.selection,
        this.languageSelection
      );
    },
    createTranslations() {
      let translations = this.translations.stats.missingTranslations;
      let totalTranslations = translations.length;
      if (totalTranslations > 0) {
        this.$swal({
          title: "Creating " + totalTranslations + " translations...",
          text:
            "Wait until the translations are created. This can take a couple minutes...",
          showCancelButton: false,
          onOpen: () => {
            this.$swal.showLoading();
            return Promise.each(translations, async (translation, index) => {
              if (typeof translation !== "undefined" && translation !== "") {
                await Localization.createTranslation(translation);
                this.progress = Math.floor(index / totalTranslations);
                console.log(
                  "Total",
                  totalTranslations,
                  "Current",
                  index,
                  "Por",
                  index / totalTranslations * 100
                );
                this.$swal.title = this.progress;
              }
            })
              .then(async result => {
                this.$swal.close();
                this.updateValues();
                Toast.create.positive({ html: "TRANSLATIONS CREATED" });
              })
              .catch(async e => {
                this.$swal.close();
                this.updateValues();
                console.log(e);
                Toast.create.negative({ html: "TRANSLATIONS FAILED" });
              });
          },
          allowOutsideClick: false
        });
      } else {
        Toast.create.positive({ html: "NO TRANSLATIONS TO CREATE" });
      }
    },
    async updateValues() {
      await this.getResources({
        appName: this.$store.state.authStore.appName
      });
      await Localization.getTranslations();
      this.translations = await LocalForm.getAllLabels();
    },
    async addLanguage() {
      let options = LocalTranslation.getIsoLanguages();
      let customOptions = {};
      _forEach(options, option => {
        customOptions[option.code] = option.label;
      });

      const language = await this.$swal({
        title: "Select the language",
        input: "select",
        inputOptions: customOptions,
        inputPlaceholder: "Select a language",
        showCancelButton: true,
        inputValidator: value => {
          return new Promise(resolve => {
            if (value === "") {
              resolve("You need to select a language");
            }
            resolve();
          });
        }
      });

      if (language) {
        this.$swal("New language created: " + customOptions[language]);
        this.translations.columns.push(language);
        _forEach(this.translations.labels, label => {
          label.push(undefined);
        });
        this.$eventHub.emit("Translation:languageAdded", {
          language: customOptions[language]
        });
      }
    }
  }
};
</script>
