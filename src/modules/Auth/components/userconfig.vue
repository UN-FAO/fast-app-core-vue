<template>
<q-btn ref="target" flat round small>
    <q-icon name="fa-user" style="font-size: 24px;" />
  <!-- Direct child of target -->
  <q-popover ref="popover">
    <q-list item-separator link class="userconfig">
      <q-item class="profileTitle">{{this.$t('Account')}}</q-item>

      <q-item style="background:white;">
        <q-item-side icon="fa-user" color="grey-6" />
        <q-item-main>
          <q-item-tile label>{{this.$t('Profile')}}</q-item-tile>
        </q-item-main>
        <!-- <q-item-side right icon="info" /> -->
      </q-item>

      <q-item style="background:white;" @click="changeLanguage()">
        <q-item-side icon="language" color="grey-6" />
        <q-item-main>
          <q-item-tile label>{{this.$t('Language')}}</q-item-tile>
          <q-item-tile sublabel>{{currentLanguage}}</q-item-tile>
        </q-item-main>
        <!-- <q-item-side right icon="info" /> -->
      </q-item>

    </q-list>
  </q-popover>
</q-btn>
</template>
<style>
.userconfig {
  padding: 0px;
  background: #e4e7ea;
}
.profileTitle {
  background: #e4e7ea;
  color: #73818f;
  padding: 0px 16px;
  min-height: 0px !important;
}
</style>
<script>
import {
  Toast,
  QBtn,
  QPopover,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile,
  QItemTitle,
  QIcon,
  QRadio,
  QCard,
  QCardTitle,
  QCardMain,
  QItemSeparator
} from 'quasar';
import { Translation, Moment } from 'fast-fastjs';
export default {
  name: 'userconfig',
  components: {
    QItemSeparator,
    Toast,
    QBtn,
    QPopover,
    QList,
    QItem,
    QItemMain,
    QIcon,
    QRadio,
    QCard,
    QCardTitle,
    QCardMain,
    QItemSide,
    QItemTitle,
    QItemTile
  },
  data: function() {
    return {
      lenguage: localStorage.getItem('defaultLenguage')
        ? localStorage.getItem('defaultLenguage')
        : 'en',
      languages: [],
      show: true
    };
  },
  async beforeMount() {
    this.languages = await Translation.local().supportedLanguages();
  },
  computed: {
    isInsideApp() {
      return (
        this.$route.name !== 'login' &&
        this.$route.name !== 'register' &&
        this.$route.name !== 'login_redirect'
      );
    },
    currentLanguage() {
      let language = this.languages.find((lang) => {
        return lang.code === this.lenguage;
      });
      if (language && language.label) {
        return language.label;
      }
      return '';
    }
  },
  methods: {
    async changeLanguage() {
      let options = await Translation.local().supportedLanguages();

      let customOptions = {};

      options.forEach((option) => {
        customOptions[option.code] = option.label;
      });

      const language = await this.$swal({
        title: this.$t('Select language'),
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
        let selectedLanguage = options.find((lang) => {
          return lang.code === language;
        });

        this.setLanguage(selectedLanguage);
      }
    },
    setLanguage(language) {
      this.$i18n.locale = language.code;
      this.lenguage = language.code;
      Moment.changeLanguage(language.code);
      localStorage.setItem('defaultLenguage', language.code);
      this.$eventHub.$emit('FAST:LANGUAGE:CHANGED', language);
      this.$swal({
        title: this.$t('Language Changed'),
        text: this.$t('The language was changed.'),
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }
  }
};
</script>
