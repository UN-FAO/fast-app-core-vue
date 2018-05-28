<template>
<q-btn ref="target" flat="true" v-if="show" class="absolute-right">
    <q-icon name="language" v-bind:class="isInsideApp ? 'color-white' : 'color-white' " />
  <!-- Direct child of target -->
  <q-popover ref="popover">
    <q-list item-separator link>
      <q-item
        v-bind:class="{ active: isActive(lenguage.code)}"
        @click="setLanguage({code: lenguage.code, direction: lenguage.direction}), $refs.popover.close()"
        v-for="lenguage in lenguages"
        :key="lenguage.code"
      >
      {{lenguage.label}}
      </q-item>

    </q-list>
  </q-popover>
</q-btn>
</template>
<style scoped>
.active {
  background: #0e6da5;
  color: white;
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
  QIcon,
  QRadio,
  QCard,
  QCardTitle,
  QCardMain,
  QItemSeparator
} from "quasar";
import {Localization, Translation, Moment} from 'fast-fastjs'

export default {
  name: "localization",
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
    QCardMain
  },
  async mounted() {
    this.lenguages = await Translation.local().supportedLanguages();
    this.rerender();

    this.$eventHub.on("Translation:languageAdded", async data => {
      this.lenguages = await Translation.local().supportedLanguages();
      this.rerender();
    });

    this.$eventHub.on("Translation:updated", async data => {
      this.lenguages = await Translation.local().supportedLanguages();
      this.rerender();
    });
  },
  data: function() {
    return {
      lenguage: localStorage.getItem("defaultLenguage")
        ? localStorage.getItem("defaultLenguage")
        : "en",
      languages: [],
      show: true
    };
  },
  computed: {
    isInsideApp() {
      return (
        this.$route.name !== "login" &&
        this.$route.name !== "register" &&
        this.$route.name !== "login_redirect" &&
        this.$route.name !== "adminLogin"
      );
    }
  },
  methods: {
    rerender() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    async getTranslations() {
      await Localization.getTranslations();
      this.$swal({
        title: this.$t("Localizations Synced"),
        text: this.$t(
          "You need to reload the page to see them. Want to do it now?"
        ),
        type: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: this.$t("Yes, reaload it!"),
        cancelButtonText: this.$t("No, Later")
      }).then(async () => {
        window.location.reload(true);
      });
    },
    isActive(code) {
      return !!(this.lenguage === code);
    },
    setLanguage(lenguage) {
      this.$i18n.locale = lenguage.code;
      this.lenguage = lenguage.code;
      Moment.changeLanguage(lenguage.code)
      localStorage.setItem("defaultLenguage", lenguage.code);
      this.$eventHub.$emit("lenguageSelection", lenguage);
      this.$swal({
        title: this.$t("Language Changed"),
        text: this.$t("The language was changed."),
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK"
      });
    }
  }
};
</script>
