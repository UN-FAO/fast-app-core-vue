<template>
<q-btn ref="target" flat="true">
    <q-icon name="language" v-bind:class="isInsideApp ? 'color-primary' : 'color-white' " />
  <!-- Direct child of target -->
  <q-popover ref="popover">
    <q-list item-separator link>
      <q-item v-bind:class="{ active: isActive(lenguage.code)}"  @click="setLanguage({code: lenguage.code, direction: lenguage.direction}), $refs.popover.close()" v-for="lenguage in lenguages" :key="lenguage.code">
      {{lenguage.label}}
      </q-item>

       <q-item-separator />
      <q-item  @click="getTranslations(), $refs.popover.close()">
          <q-icon name="fa-language" /> Sync
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
  QChip,
  QFixedPosition,
  QItemSeparator
} from "quasar";
import Localization from "../Localization";
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
    QCardMain,
    QChip,
    QFixedPosition
  },
  data: function() {
    return {
      lenguage: localStorage.getItem("defaultLenguage")
        ? localStorage.getItem("defaultLenguage")
        : "en",
      lenguages: [
        { code: "en", direction: "ltr", label: "English" },
        { code: "es", direction: "ltr", label: "Español" },
        { code: "fr", direction: "ltr", label: "Francais" }
      ]
    };
  },
  computed: {
    isInsideApp() {
        return (
        this.$route.name !== "login" &&
        this.$route.name !== "register" &&
        this.$route.name !== "login_redirect"
      )
    }
  },
  methods: {
    async getTranslations() {
      await Localization.getTranslations();
      this.$swal({
        title: this.$t('Localizations Synced'),
        text: this.$t("You need to reload the page to see them. Want to do it now?"),
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
        localStorage.setItem("defaultLenguage", lenguage.code);
        this.$eventHub.$emit("lenguageSelection", lenguage);
       this.$swal({
        title: this.$t("Language Changed"),
        text: this.$t("The language was changed."),
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK"
      })
    }
  }
};
</script>
