<template>
  <div class="row">

    <div style="color:black">
    Languages: {{ totalSupportedLanguages }}
    <span>

    </span>
  </div>

<q-list no-border>
  <q-item v-for="language in languages" v-bind:key="language">
    <q-item-side />
    <q-item-main>
      <q-item-tile label color="black">{{getLanguageName(language)}}</q-item-tile>
    </q-item-main>
    <q-item-side right>
      {{(stats.translations[language].translated * 100).toFixed(
          1
        ) + ' %'}}
    </q-item-side>
  </q-item>
</q-list>

  </div>
</template>

<script>
import { QList, QItem, QItemSide, QItemMain, QItemTile } from 'quasar';
import Translation from 'libraries/fastjs/database/models/Translation';
export default {
  name: 'tstats',
  components: {
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile
  },
  data() {
    return {
      IsoLanguages: Translation.local().getIsoLanguages()
    };
  },
  props: {
    stats: {
      required: true
    }
  },
  watch: {
    stats: function(stats) {
      this.stats = stats;
    }
  },
  computed: {
    totalSupportedLanguages() {
      return Object.keys(this.stats.translations).length - 1;
    },
    languages() {
      let lang = Object.keys(this.stats.translations);
      lang.shift();
      return lang
    },
    totalTranslations() {
      if (this.stats && this.stats.totalTranslations) {
        return this.stats.totalTranslations;
      }
      return 0;
    },
    englishPorcentage() {
      if (this.stats && this.stats.translations && this.stats.translations.en) {
        let porcentage = (this.stats.translations.en.translated * 100).toFixed(
          1
        );
        if (porcentage < 100) {
          this.$eventHub.emit('Translation:missing');
        }
        return porcentage;
      }
      return 0;
    },
    frenchPorcentage() {
      if (this.stats && this.stats.translations && this.stats.translations.fr) {
        return (this.stats.translations.fr.translated * 100).toFixed(1);
      }
      return 0;
    }
  },
  methods: {
    getLanguageName(languageCode) {
      let lang = this.IsoLanguages.filter((lang) => {
        return lang.code === languageCode;
      });
      if (lang.length === 0) {
        return 'Labels';
      }
      return lang[0].label;
    }
  }
};
</script>


