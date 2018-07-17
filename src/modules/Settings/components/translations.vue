<template>
   <div class="row FormioContainer">
      <q-card class="col-xl-10 col-lg-10  col-md-12 col-sm-12 col-lg-offset-1 col-md-offset-1 col-xl-offset-1" style="position:inherit !important;">
         <q-card-title>
            <breadcrum
               :parent="$route.query.parent"
               :currentPageTitle="$t('Translations')"
               />

                <div v-if="!hasTranslation()">
                  <div class="pull-right">
                     <q-icon name="more_vert" color="grey" style="cursor:pointer;float:left" size="30px">
                        <q-popover ref="popover" class="show-menu">
                           <q-list link class="no-border" dense separator no-border>
                              <q-item @click="$refs.popover.close(), createTranslations()">
                                 <q-item-side icon="translate"  />
                                 <q-item-main :label="$t('Find new translations')" />
                              </q-item>
                              <q-item @click="$refs.popover.close(), updateValues()">
                                 <q-item-side icon="refresh"  />
                                 <q-item-main :label="$t('Reload Translations')" />
                              </q-item>
                              <q-item @click="$refs.popover.close(), addLanguage()">
                                 <q-item-side icon="fa-plus"  />
                                 <q-item-main :label="$t('Add Language')" />
                              </q-item>
                           </q-list>
                        </q-popover>
                     </q-icon>
                  </div>
               </div>
         </q-card-title>
         <q-card-main>

            <div>

               <div class="justify-center">
                  <div v-if="!hasTranslation()" class="relative-position">
                     <q-inner-loading :visible="true">
                        <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
                     </q-inner-loading>
                  </div>
                  <tstats :stats="translations.stats" v-if="translations && translations.stats"> </tstats>
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

   </q-card-main>
   </q-card>
   </div>
</template>

<style scoped>
.q-checkbox {
  color: black;
}
</style>

<script>
import { Translation, Form, FormLabels, Localization, FAST } from 'fast-fastjs';
import {
  QCard,
  QCardTitle,
  QCardMain,
  QBtn,
  QTooltip,
  QPopover,
  QIcon,
  QList,
  QItem,
  QItemSide,
  QItemMain,
  Toast,
  QSpinnerAudio,
  QInnerLoading,
  QCheckbox,
  QInput
} from 'quasar';
import tstats from './stats';
import hottable from './hottable';
import Promise from 'bluebird';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import breadcrum from 'components/breadcrum';

export default {
  data: function() {
    return {
      translations: [],
      progress: 0,
      selection: [],
      languageSelection: [],
      formNameFilters: [],
      languageNameFilters: [],
      search: '',
      languageSearch: '',
      searchBox: '',
      untranslated: false
    };
  },
  async mounted() {
    this.updateValues();
    this.$eventHub.on('Translation:updated', (data) => {
      // this.updateValues();
    });

    this.$eventHub.on('Translation:missing', (data) => {
      this.createTranslations();
    });

    this.formNameFilters = await Form.local().find();
    this.languageNameFilters = await Translation.local().supportedLanguages();
    this.selection = _map(this.formNameFilters, 'data.title');
    this.selection.push('Application');
    this.languageSelection = _map(this.languageNameFilters, 'code');
  },
  components: {
    breadcrum,
    QCard,
    QCardTitle,
    QCardMain,
    QBtn,
    QTooltip,
    tstats,
    hottable,
    QSpinnerAudio,
    QInnerLoading,
    QCheckbox,
    QPopover,
    QInput,
    QIcon,
    QList,
    QItem,
    QItemSide,
    QItemMain
  },
  computed: {
    filteredForms: function() {
      if (!this.formNameFilters) {
        return [];
      }
      // application
      let forms = this.formNameFilters.filter((formNameFilter) => {
        return (
          formNameFilter.data.title
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) >= 0
        );
      });
      let app = {
        data: {
          title: 'Application'
        }
      };
      forms.push(app);
      return forms;
    },
    filteredLanguages: function() {
      if (!this.formNameFilters) {
        return [];
      }
      return this.languageNameFilters.filter((languageNameFilter) => {
        return (
          languageNameFilter.label
            .toLowerCase()
            .indexOf(this.languageSearch.toLowerCase()) >= 0
        );
      });
    },
    filteredLabels: function() {
      if (!this.translations.labels) {
        return [];
      }
      this.searchBox.toLowerCase();
      let labels = this.translations.labels.filter((translation) => {
        if (this.untranslated) {
          let undefinedElements = 0;
          _forEach(translation, (trans) => {
            if (typeof trans === 'undefined' || trans === '') {
              undefinedElements = undefinedElements + 1;
            }
          });
          return (
            translation.join(',').indexOf(this.searchBox.toLowerCase()) > -1 &&
            undefinedElements >= 1
          );
        }
        return (
          translation
            .join(',')
            .toLowerCase()
            .indexOf(this.searchBox.toLowerCase()) > -1
        );
      });
      return labels;
    }
  },
  methods: {
    async removeDuplicated() {},
    hasTranslation() {
      return _isEmpty(this.translations);
    },
    allFilters() {
      this.selection = _map(this.formNameFilters, 'data.title');
    },
    allLanguageFilters() {
      this.languageSelection = _map(this.languageNameFilters, 'code');
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
            this.$t('Creating') +
            ' ' +
            totalTranslations +
            ' ' +
            this.$t('translations...'),
          text: this.$t(
            'Wait until the translations are created. This can take a couple minutes...'
          ),
          showCancelButton: false,
          onOpen: () => {
            this.$swal.showLoading();

            return Promise.each(translations, async (translation, index) => {
              if (typeof translation !== 'undefined' && translation !== '') {
                await Localization.createTranslation(translation);
                this.progress = Math.floor(index / totalTranslations);
                console.log(
                  'Total',
                  totalTranslations,
                  'Current',
                  index,
                  'Por',
                  index / totalTranslations * 100
                );
                this.$swal.title = this.progress;
              }
            })
              .then(async (result) => {
                this.$swal.close();
                this.updateValues();
                Toast.create.positive({
                  html: this.$t('TRANSLATIONS CREATED')
                });
              })
              .catch(async (e) => {
                this.$swal.close();
                this.updateValues();
                console.log(e);
                Toast.create.negative({
                  html: this.$t('TRANSLATIONS FAILED')
                });
              });
          },
          allowOutsideClick: false
        });
      } else {
        Toast.create.positive({
          html: this.$t('NO TRANSLATIONS TO CREATE')
        });
      }
    },
    async updateValues() {
      this.$swal({
        title: 'Updating...',
        text: this.$t(
          'Wait until the App is Updated. This can take a couple minutes...'
        ),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          await FAST.sync({ interval: false, appConf: this.$appConf });
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
      _forEach(options, (option) => {
        customOptions[option.code] = option.label;
      });

      const language = await this.$swal({
        title: this.$t('Select the language'),
        input: 'select',
        inputOptions: customOptions,
        inputPlaceholder: this.$t('Select a language'),
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value === '') {
              resolve(this.$t('You need to select a language'));
            }
            resolve();
          });
        }
      });

      if (language) {
        this.$swal(this.$t('New language created: ') + customOptions[language]);
        this.translations.columns.push(language);
        _forEach(this.translations.labels, (label) => {
          label.push(undefined);
        });
        this.$eventHub.emit('Translation:languageAdded', {
          language: customOptions[language]
        });
      }
    }
  }
};
</script>
