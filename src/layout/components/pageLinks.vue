<template>
<div style="color:black">
   <q-side-link multiline highlight item v-if="page.SHOW_LD" :to="{name: 'pageManager', params: {pageId: page.pagesPageUrl}}" :key="page.pagesPageUrl" v-for="page in pages">
      <q-item-side :icon="page.pageIcon" />
      <q-item-main :label="$t(page.pageTitle)" class="text-white"/>
    </q-side-link>
</div>
</template>
<script>
import {
  QSideLink,
  QItemTile,
  QItemSide,
  QItemMain,
  QItemSeparator
} from "quasar";
export default {
  name: "pagelinks",
  props: ["pages"],
  watch: {
    pages: function(val) {}
  },
  components: {
  QSideLink,
  QItemTile,
  QItemSide,
  QItemMain,
  QItemSeparator
  }
};
</script>
