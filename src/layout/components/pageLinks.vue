<template>
<div style="color:black">
   <q-side-link multiline highlight item v-if="page.SHOW_LD" :to="{name: 'pageManager', params: {pageId: page.url}}" :key="page.url" v-for="page in pages">
      <q-item-side :icon="page.icon" />
      <q-item-main :label="$t(page.title)" class="text-white"/>
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
