<template>
<div>

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
  <tstats :stats="translations.stats"> </tstats>


  <hottable :translations="translations"></hottable>

</div>
</template>

<script>
import LocalForm from "database/collections/scopes/LocalForm";
import LocalTranslation from "database/collections/scopes/LocalTranslation";
import Localization from "modules/Localization/Localization";
import { mapActions } from "vuex";
import { QBtn, QTooltip, Toast } from "quasar";
import tstats from "./stats";
import hottable from "./hottable";
import Promise from "bluebird";
import _forEach from "lodash/forEach";

export default {
  data: function() {
    return {
      translations: [],
      progress: 0
    };
  },
  async mounted() {
    this.updateValues();
  },
  components: {
    QBtn,
    QTooltip,
    tstats,
    hottable
  },
  methods: {
    ...mapActions(["getResources"]),
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

      console.log("customOptions", customOptions);
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
            resolve()
          });
        }
      });

      if (language) {
        this.$swal("New language created: " + customOptions[language]);
        this.translations.columns.push(language);
        _forEach(this.translations.labels, label => {
          label.push(undefined);
        });
      }
    }
  }
};
</script>
