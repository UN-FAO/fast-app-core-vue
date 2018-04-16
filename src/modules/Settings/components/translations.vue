<template>
  <div>
    <div v-if="!hasTranslation()">
      <div class="translations-action-bar pull-right">
        <q-btn round color="primary" icon="translate" @click="createTranslations">
          <q-tooltip>
            {{$t('Create translations')}}
          </q-tooltip>
        </q-btn>
        <q-btn round color="primary" icon="refresh" @click="updateValues">
          <q-tooltip>
            {{$t('Reload Translations')}}
          </q-tooltip>
        </q-btn>

        <q-btn round color="primary" icon="fa-plus" @click="addLanguage">
          <q-tooltip>
            {{$t('Add Language')}}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="justify-center">
      <div class="loading" v-if="hasTranslation()">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </div>

        <div class="section-title pageTitle" style="margin:auto">
          {{ $t("Translations") }}
        </div>

        <div style="width:100%;color:grey">
         <hr>
        </div>


      <div v-if="!hasTranslation()">
        <tstats :stats="translations.stats"> </tstats>
        <div class="col-lg-12">
          <q-btn icon="fa-filter" ref="target" color="primary" outline>
            {{$t('Forms')}}
            <!-- Direct child of target -->
            <q-popover ref="popover" anchor="bottom middle" max-height="300px" fit>
              <q-input v-model="search" type="text" :stack-label="$t('NAME FILTER')" :placeholder="$t('search...')" :after="[{  icon: 'fa-search'}]" clearable inverted />
              <div class="row pull-right">
                <q-btn ref="target" color="primary" flat @click="allFilters()">
                  {{$t('All')}}
                </q-btn>
                <q-btn ref="target" color="primary" flat @click="clearFilters()">
                  {{$t('Clear')}}
                </q-btn>
                <q-btn ref="target" color="primary" flat @click="filterTable()">
                  {{$t('Apply')}}
                </q-btn>
              </div>
              <br><br>
              <div v-for="form in filteredForms" :key="form.data.title">
                <q-checkbox style="text-transform: uppercase;" v-model="selection" :val="form.data.title" :label="form.data.title" />
                </hr>
                <br><br>
              </div>
            </q-popover>
          </q-btn>

          <q-btn icon="fa-filter" ref="target" color="primary" outline>
            {{$t('Languages')}}
            <q-popover ref="popover" anchor="bottom middle" max-height="300px" fit>
              <q-input v-model="languageSearch" type="text" :stack-label="$t('NAME FILTER')" :placeholder="$t('search...')" :after="[{  icon: 'fa-search'}]" clearable inverted />
              <div class="row pull-right">
                <q-btn ref="target" color="primary" flat @click="allLanguageFilters()">
                  {{$t('All')}}
                </q-btn>
                <q-btn ref="target" color="primary" flat @click="clearLanguageFilters()">
                  {{$t('Clear')}}
                </q-btn>
                <q-btn ref="target" color="primary" flat @click="filterTable()">
                  {{$t('Apply')}}
                </q-btn>
              </div>
              <br><br>
              <div v-for="language in filteredLanguages" :key="language.code">
                <q-checkbox style="text-transform: uppercase;" v-model="languageSelection" :val="language.code" :label="language.label" />
                </hr>
                <br><br>
              </div>
            </q-popover>
          </q-btn>

          <q-checkbox style="text-transform: uppercase;" v-model="untranslated" :label="$t('not translated')" />
          <q-input v-model="searchBox" type="text" :stack-label="$t('TRANSLATION FILTER')" :placeholder="$t('Search...')" :after="[{  icon: 'fa-search'}]" clearable />

        </div>
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
import Form from "libraries/fastjs/database/models/Form";
import FormLabels from "libraries/fastjs/repositories/Form/Labels";
import Translation from "libraries/fastjs/database/models/Translation";
import Localization from "libraries/fastjs/repositories/Localization/Localization";
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
import FAST from "libraries/fastjs/start";

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
      searchBox: "",
      untranslated: false
    };
  },
  async mounted() {
    this.updateValues();
    this.$eventHub.on("Translation:updated", data => {
      // this.updateValues();
    });

    this.$eventHub.on("Translation:missing", data => {
      this.createTranslations();
    });

    this.formNameFilters = await Form.local().find();
    this.languageNameFilters = await Translation.local().supportedLanguages();
    this.selection = _map(this.formNameFilters, "data.title");
    this.selection.push("Application");
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
      // application
      let forms = this.formNameFilters.filter(formNameFilter => {
        return (
          formNameFilter.data.title
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) >= 0
        );
      });
      let app = {
        data: {
          title: "Application"
        }
      };
      forms.push(app);
      return forms;
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
        if (this.untranslated) {
          let undefinedElements = 0;
          _forEach(translation, trans => {
            if (typeof trans === "undefined" || trans === "") {
              undefinedElements = undefinedElements + 1;
            }
          });
          return (
            translation.join(",").indexOf(this.searchBox.toLowerCase()) > -1 &&
            undefinedElements >= 1
          );
        }
        return (
          translation
            .join(",")
            .toLowerCase()
            .indexOf(this.searchBox.toLowerCase()) > -1
        );
      });
      return labels;
    }
  },
  methods: {
    ...mapActions(["getResources"]),
    async removeDuplicated() {},
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
      this.translations = await FormLabels.get(
        this.selection,
        this.languageSelection
      );
    },
    createTranslations() {
      let translations = this.translations.stats.missingTranslations;
      let totalTranslations = translations.length;
      if (totalTranslations > 0) {
        this.$swal({
          title:
            this.$t("Creating") +
            " " +
            totalTranslations +
            " " +
            this.$t("translations..."),
          text: this.$t(
            "Wait until the translations are created. This can take a couple minutes..."
          ),
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
                Toast.create.positive({
                  html: this.$t("TRANSLATIONS CREATED")
                });
              })
              .catch(async e => {
                this.$swal.close();
                this.updateValues();
                console.log(e);
                Toast.create.negative({
                  html: this.$t("TRANSLATIONS FAILED")
                });
              });
          },
          allowOutsideClick: false
        });
      } else {
        Toast.create.positive({
          html: this.$t("NO TRANSLATIONS TO CREATE")
        });
      }
    },
    async updateValues() {
      this.$swal({
        title: "Updating...",
        text: this.$t(
          "Wait until the App is Updated. This can take a couple minutes..."
        ),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          await FAST.sync({ Vue: this, interval: false });
          this.translations = await FormLabels.get(
            this.selection,
            this.languageSelection
          );
          this.$swal.close();
        }
      });
    },
    async addLanguage() {
      let options = Translation.local().getIsoLanguages();
      let customOptions = {};
      _forEach(options, option => {
        customOptions[option.code] = option.label;
      });

      const language = await this.$swal({
        title: this.$t("Select the language"),
        input: "select",
        inputOptions: customOptions,
        inputPlaceholder: this.$t("Select a language"),
        showCancelButton: true,
        inputValidator: value => {
          return new Promise(resolve => {
            if (value === "") {
              resolve(this.$t("You need to select a language"));
            }
            resolve();
          });
        }
      });

      if (language) {
        this.$swal(this.$t("New language created: ") + customOptions[language]);
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
