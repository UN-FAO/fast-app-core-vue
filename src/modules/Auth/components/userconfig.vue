<template>
<q-btn ref="target" flat round small>
    <q-icon name="fa-user" style="font-size: 24px;" />
  <!-- Direct child of target -->
  <q-popover ref="popover">
    <q-list item-separator link class="userconfig">
      <q-item class="profileTitle" v-if="this.$isInsideApp(this.$route)">{{this.$t('Account')}}</q-item>

      <q-item class="profileItem" @click="editProfile()" v-if="this.$isInsideApp(this.$route)">
        <q-item-side icon="fa-user" color="grey-6" />
        <q-item-main>
          <q-item-tile label>{{this.$t('Profile')}}</q-item-tile>
          <q-item-tile sublabel>{{email()}}</q-item-tile>

        </q-item-main>
        <!-- <q-item-side right icon="info" /> -->
      </q-item>

      <q-item class="profileItem"  @click="changeLanguage()">
        <q-item-side icon="language" color="grey-6" />
        <q-item-main>
          <q-item-tile label>{{this.$t('Language')}}</q-item-tile>
          <q-item-tile sublabel>{{currentLanguage}}</q-item-tile>
        </q-item-main>
        <!-- <q-item-side right icon="info" /> -->
      </q-item>

      <q-item-separator style="background:lightgray;" v-if="this.$isInsideApp(this.$route)" />

      <q-item class="profileItem" @click="handleLogout"  v-if="this.$isInsideApp(this.$route)">
        <q-item-side icon="ion-log-out" color="red"/>
        <q-item-main :label="$t('Logout')" />
      </q-item>
        <!-- <q-item-side right icon="info" /> -->
      </q-item>

    </q-list>
  </q-popover>
</q-btn>
</template>
<style>
.userconfig {
  padding: 0px;
  background: white;
}
.profileTitle {
  background: #e4e7ea;
  color: #73818f;
  padding: 0px 16px;
  min-height: 0px !important;
}
.profileItem:hover {
  background: white;
}
.profileItem:hover {
  background: rgba(189, 189, 189, 0.5);
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
import { Translation, Moment, Auth, Form } from 'fast-fastjs';
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
    async getUserFormId() {
      let formId = Auth.user().form;
      let localForm = await Form.local().get(formId)
      return localForm.path
    },
    async editProfile() {
      let idForm = await this.getUserFormId();
      this.$refs.popover.toggle();
      this.$router.push({
        name: 'profile',
        params: {
          idForm: idForm,
          idSubmission: Auth.user()._id
        },
        query: {
          parent: this.$route.query.parent
        }
      });
    },
    email() {
      return Auth.email();
    },
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
    async handleLogout() {
      this.$eventHub.$emit('openLeftDrawer');
      await Auth.logOut();
      this.$refs.popover.toggle();
      this.$router.push({
        path: '/login'
      });
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
