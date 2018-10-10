<template>
<div class="row FormioContainer">
  <q-card class="col-xl-10 col-lg-10  col-md-12 col-sm-12 col-lg-offset-1 col-md-offset-1 col-xl-offset-1" style="position:inherit !important;">
    <q-card-title>
      <breadcrum :parent="$route.query.parent" :currentPageTitle="$t('Translations')" />

      <div v-if="!hasTranslation()">
        <div class="pull-right">
          <q-icon name="more_vert" color="grey" style="cursor:pointer;float:left" size="30px">
            <q-popover ref="popover" class="show-menu">
              <q-list link class="no-border" dense separator no-border>
                <q-item @click="$refs.popover.close(), createTranslations()">
                  <q-item-side icon="translate" />
                  <q-item-main :label="$t('Find new translations')" />
                </q-item>
                <q-item @click="$refs.popover.close(), updateValues()">
                  <q-item-side icon="refresh" />
                  <q-item-main :label="$t('Reload Translations')" />
                </q-item>
                <q-item @click="$refs.popover.close(), addLanguage()">
                  <q-item-side icon="fa-plus" />
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
          <div class="row">
            <div class="col-sm-12">
              <q-card>
                <q-card-title>
                  <span style="color:grey">{{$t('Supported Languages')}} </span>: {{numberOfLanguages}}
                </q-card-title>
                <q-list separator>
                  <q-collapsible icon="fa-language" :label="$t('Translation Status')">
                    <div v-if="translationStatus && translationStatus.en && supportedLanguages">
                      <div class="col-xs-6 col-sm-4 col-md-3" v-for="(number, code) in translationStatus" :key="code" v-if="code !== 'label'">
                        <q-field :label="getLanguageName(code)" helper=" " :labelWidth="parseInt(11)">
                          <q-knob v-model="translationStatus[code]" color="primary" line-width="3px" :min="min" :max="max" readonly>
                            {{number}}
                            <q-icon class="on-right" name="fa-percent" />
                          </q-knob>

                        </q-field>

                      </div>
                    </div>

                  </q-collapsible>
                </q-list>
              </q-card>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12 col-xs-12 col-lg-5">
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
                  </div>
                  <br><br>
                  <div v-for="language in filteredLanguages" :key="language.code">
                    <q-checkbox style="text-transform: uppercase;" v-model="languageSelection" :val="language.code" :label="language.label" />
                    </hr>
                    <br><br>
                           </div>
                </q-popover>
              </q-btn>
              <q-checkbox style="text-transform: uppercase;"  v-model="untranslated" :label="$t('not translated')" />
              <q-input v-model.lazy="searchBox" class="searchTranslation" type="text" :stack-label="$t('TRANSLATION FILTER')" :placeholder="$t('Search...')" :after="[{  icon: 'fa-search'}]" clearable />
              <q-scroll-area style="height: 500px;" no-boder>
                <q-list highlight sparse no-border>
                  <q-item v-for="label in translationsArray" v-if="shouldDisplayLabel(label)" :key="label" @click="selectLabel(label)" style="cursor:pointer">
                    <q-item-side icon="fa-language" color="primary" />
                    <q-item-main>
                      <q-item-tile label>{{label}}</q-item-tile>
                        <q-item-tile sublabel>Used <strong>{{translations[label].location.length}}</strong> time(s) in the app </q-item-tile>

                    </q-item-main>
                    <q-item-side right>
                      <q-item-tile stamp>status</q-item-tile>
                      <q-item-tile stamp>{{getCurrentTranslations(label)}} / {{numberOfLanguages}}</q-item-tile>
                      <q-item-tile icon="fa-circle" color="green" v-if="getCurrentTranslations(label) === numberOfLanguages" />
                      <q-item-tile icon="fa-circle" color="yellow" v-else-if="getCurrentTranslations(label) >= numberOfLanguages/2" />
                      <q-item-tile icon="fa-circle" color="red" v-else />
                    </q-item-side>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </div>
            <div class="col-lg-7 justify-center" v-if="translations && selectedLabel">
              <q-card>
                <q-card-title>
                  <div class="pull-right">
                    <q-icon @click="closeTranslation" name="fa-window-close" color="grey" style="cursor:pointer;float:left" size="30px" />
                  </div>
                  <span style="color:grey">Translating: </span> {{selectedLabel}}
                  <br>
                  <div class="pull-right">
                    <span v-if="saved && saved === true">
                            <q-icon name="fa-check-circle-o" color="green" style="cursor:pointer;float:left" size="30px"/>
                              <span style="color:grey; text-transform:none">{{$t('saved').toLowerCase()}}</span>
                    </span>
                    <span v-else-if="saved === false">
                            <q-icon name="fa-minus-circle" color="orange" style="cursor:pointer;float:left" size="30px"/>
                            <span style="color:orange; text-transform:none">{{$t('saving...').toLowerCase()}}</span>
                    </span>
                  </div>
                </q-card-title>
                <q-list separator>
                  <q-collapsible group="translation" opened icon="fa-language" label="Translations">
                    <div>

                      <q-input
                        inverted
                        v-model="currentTranslations[l.code]"
                        :float-label="l.label"
                        v-for="l in supportedLanguages"
                        v-if="languageSelection.includes(l.code)"
                        :key="l.code" type="textarea"
                        :color="getTextAreaColor(currentTranslations[l.code])"
                        clearable
                        @blur="forceUpdate(selectedLabel)"
                        @change="onTranslationChanged"
                      />
                    </div>
                  </q-collapsible>

                  <q-collapsible group="translation" icon="fa-info" :label="'Information: used ' + translations[selectedLabel].location.length + ' time(s)' ">
                    <div>
                      Information:{{translations[selectedLabel].location.length}}
                    </div>
                  </q-collapsible>

                  <q-collapsible group="translation" icon="fa-location-arrow" label="Context">
                    <div>
                      You can find this label in: {{translations[selectedLabel].location[0].form}}
                      <div style="overflow: scroll;overflow-x: hidden;height: 400px;" v-if="false">
                        <vueformio :form="translations[selectedLabel].location[0].form" :options="{readOnly:true}" />
                      </div>
                    </div>
                  </q-collapsible>
                </q-list>
              </q-card>

              <br>
                </div>
              <div v-else>
                Select one label to translate
              </div>
            </div>
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
import { Form as vForm } from 'vue-formio';
import { Translation, Form, FAST } from 'fast-fastjs';
import {
  QScrollArea,
  QCollapsible,
  QListHeader,
  QField,
  QKnob,
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
  QInput,
  QItemTile,
  QItemSeparator
} from 'quasar';
import Promise from 'bluebird';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import breadcrum from 'components/breadcrum';
import _get from 'lodash/get';

export default {
  components: {
    QScrollArea,
    QCollapsible,
    vueformio: vForm,
    QItemSeparator,
    QItemTile,
    QListHeader,
    QField,
    QKnob,
    breadcrum,
    QCard,
    QCardTitle,
    QCardMain,
    QBtn,
    QTooltip,
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
  data: function() {
    return {
      max: 100,
      min: 0,
      translations: null,
      supportedLanguages: null,
      groupedTranslations: null,
      currentTranslations: null,
      selectedLabel: null,
      timeoutId: null,
      translationChanged: null,
      languageNameFilters: [],
      saved: null,
      progress: 0,
      selection: [],
      languageSelection: [],
      formNameFilters: [],
      search: '',
      languageSearch: '',
      searchBox: '',
      untranslated: false,
      untranslatedArray: []
    };
  },
  async created() {
    await this.syncApp();
    this.formNameFilters = await Form.local().get();
    this.supportedLanguages = await Translation.supportedLanguages();
    this.languageNameFilters = this.supportedLanguages;
    // Pre select all the languages
    this.languageSelection = _map(this.languageNameFilters, 'code');
    this.groupedTranslations = (await Translation.local().first()).data;
    this.translations = await Form.FormLabels(this.selection);
    Object.keys(this.translations).forEach((label) => {
      if (this.getCurrentTranslations(label) === -1) {
        this.untranslatedArray.push(label);
      }
    });
    if (this.untranslatedArray.length > 0) {
      this.createTranslations();
    }
  },
  computed: {
    translationsArray() {
      let translations = this.translations;
      let tArray = [];
      if (translations) {
        Object.keys(translations).forEach((label) => {
          tArray.push(label);
        });
      }
      return tArray;
    },
    numberOfLanguages() {
      return _get(this.supportedLanguages, 'length', 0);
    },
    translationStatus() {
      let translations = this.translations;
      // let languages = _get(this.supportedLanguages, 'length', []);
      // Object.keys(this.groupedTranslations)
      if (translations) {
        let totalTranslations = Object.keys(this.translations).length;
        // Calculate total translations per language
        let result = Object.keys(translations).reduce((acc, label) => {
          Object.keys(translations[label].translations).forEach((code) => {
            if (acc[code] && acc[code] !== '') {
              acc[code] = acc[code] + 1;
            } else {
              if (acc[code] !== '') {
                acc[code] = 1;
              }
            }
          });
          return acc;
        }, {});

        Object.keys(result).forEach((code) => {
          result[code] = parseFloat(
            Math.floor(result[code] / totalTranslations * 100)
          );
        });
        return result;
      }
      return null;
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
    }
  },
  methods: {
    getLanguageName(code) {
      if (this.supportedLanguages) {
        let languange = this.supportedLanguages.filter((lang) => {
          return lang.code === code;
        });
        if (languange.length >= 1) {
          return languange[0].label;
        } else {
          return this.$t('Total');
        }
      }
    },
    selectLabel(label) {
      this.selectedLabel = label;

      // eslint-disable-next-line
      this.currentTranslations = this.translations[
        this.selectedLabel
      ].translations;
    },
    closeTranslation() {
      this.selectedLabel = null;
    },
    getCurrentTranslations(label) {
      let translations = this.translations[label].translations;
      let total = Object.keys(translations).reduce((acc, code) => {
        if (translations[code] && translations[code] !== '') {
          acc = acc + 1;
        }
        return acc;
      }, 0);
      return total - 1;
    },
    getTextAreaColor(label) {
      if (label === '' || label === undefined) {
        return 'negative';
      }
      return 'positive';
    },
    onTranslationChanged() {
      this.translationChanged = true;
    },
    forceUpdate(Label) {
      if (this.translationChanged) {
        this.autoSaveTimer(this.translations[Label].translations);
        this.$forceUpdate();
      }
      this.translationChanged = false;
    },
    autoSaveTimer(saveObject) {
      // AutoSave functionality
      // If a timer was already started, clear it.
      if (this.timeoutId) clearTimeout(this.timeoutId);
      // Set timer that will save comment when it fires.
      this.timeoutId = setTimeout(async () => {
        await this.saveTranslation(saveObject);
      }, 1000);
    },
    async saveTranslation(saveObject) {
      this.saved = false;
      await Translation.setTranslations(saveObject);
      this.saved = true;
    },
    shouldDisplayLabel(label) {
      let isInSearch =
        this.searchBox === '' ||
        label.toLowerCase().indexOf(this.searchBox.toLowerCase()) > -1;

      let hasEmptyTranslations = false;
      if (this.untranslated) {
        this.languageSelection.forEach((languageCode) => {
          if (
            !this.translations[label].translations[languageCode] ||
            this.translations[label].translations[languageCode] === ''
          ) {
            hasEmptyTranslations = true;
          }
        });
      }
      let shouldDisplay =
        this.untranslated === false ? true : hasEmptyTranslations;
      return isInSearch && shouldDisplay;
    },
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
    createTranslations() {
      let totalTranslations = this.untranslatedArray.length;
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

            return Promise.each(
              this.untranslatedArray,
              async (translation, index) => {
                if (typeof translation !== 'undefined' && translation !== '') {
                  await Translation.createTranslation(translation);
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
              }
            )
              .then(async (result) => {
                this.$swal.close();
                Toast.create.positive({
                  html: this.$t('TRANSLATIONS CREATED')
                });
              })
              .catch(async (e) => {
                this.$swal.close();
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
    async addLanguage() {
      let options = Translation.getIsoLanguages();
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
    },
    async syncApp() {
      return new Promise((resolve, reject) => {
        this.$swal({
          title: this.$t('Updating...'),
          text: this.$t(
            'Wait until the App is Updated. This can take a couple minutes...'
          ),
          showCancelButton: false,
          onOpen: async () => {
            this.$swal.showLoading();
            await FAST.sync({
              appConf: this.$appConf
            });
            this.$swal.close();
            resolve();
          }
        });
      });
    }
  }
};
</script>
