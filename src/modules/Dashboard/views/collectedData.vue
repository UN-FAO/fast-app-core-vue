<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" v-bind:key="$route.path" style="padding-bottom:50px" >
    <div class="section-title" style="font-size: 30px;padding-top:30px;text-align:center;color: grey;">
      Collected data
    </div>
    <hr style="border-top: 1px solid lightgray;">

    <actioncards :page="newForms" v-bind:key="$route.path"></actioncards>

  </div>

</template>
<style>

</style>

<script>
import {
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QCardMedia,
  QItemSide,
  QFab,
  QFabAction,
  QFixedPosition,
  QPullToRefresh,
  QTabs,
  QTab,
  QTabPane,
  QCollapsible,
  QBtn,
  QIcon,
  QTooltip,
  QList,
  QItem,
  QItemSeparator
} from "quasar";
import actioncards from "../components/actionCards";
import Form from "database/models/Form";
export default {
  components: {
    actioncards,
    QCard,
    QCardMedia,
    QItemSide,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QFab,
    QFabAction,
    QFixedPosition,
    QPullToRefresh,
    QTabs,
    QTab,
    QTabPane,
    QCollapsible,
    QBtn,
    QIcon,
    QTooltip,
    QList,
    QItem,
    QItemSeparator
  },
  data: () => {
    return {
      forms: undefined,
      loading: true
    };
  },
   asyncData: {
    newForms: {
      async get() {
        let result = await Form.local().cardFormattedForms('list');
        return result
      },
      transform(result) {
        return result;
      }
    }
  },
  mounted: async function() {
    let forms = await Form.local().sAll();
    let visible = forms.filter(o => {
      return o.data.tags.indexOf("visible") > -1;
    });
    if (visible.length === 1 && this.$FAST_CONFIG.APP_ENV !== "dev") {
      this.goTo({
        name: "formio_form_show",
        params: { idForm: visible[0].data.path }
      });
    }
  }
};
</script>
