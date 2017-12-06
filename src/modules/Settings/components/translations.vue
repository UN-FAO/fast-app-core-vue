<template>
<div>

  <div class="translations-action-bar pull-right">
    <q-btn round color="primary" icon="translate" @click="createTranslations" >
      <q-tooltip>
        Create translations
    </q-tooltip>
    </q-btn>
  </div>
  <tstats :stats="translations.stats"> </tstats>


  <hottable :translations="translations"></hottable>

</div>
</template>

<script>
import LocalForm from "database/collections/scopes/LocalForm";
import Localization from "modules/Localization/Localization";
import { QBtn, QTooltip, Toast } from "quasar";
import tstats from "./stats";
import hottable from "./hottable";
import Promise from "bluebird";
export default {
  data: function() {
    return {
      translations: []
    };
  },
  async mounted() {
    this.translations = await LocalForm.getAllLabels();
  },
  components: {
    QBtn,
    QTooltip,
    tstats,
    hottable
  },
  methods: {
    createTranslations() {
      let translations = this.translations.stats.missingTranslations;
      Promise.each(translations, async function(translation) {
        if (typeof translation !== "undefined" && translation !== "") {
          await Localization.createTranslation(translation);
        }
      })
        .then(e => {
          Toast.create.positive({ html: "TRANSLATIONS CREATED" });
        })
        .catch(e => {
          console.log(e);
          Toast.create.negative({ html: "TRANSLATIONS FAILED" });
        });
    }
  }
};
</script>
