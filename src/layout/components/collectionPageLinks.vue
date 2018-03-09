<template>
<div style="color:black">
   <q-side-link multiline highlight item :to="{name: 'newSurvey'}" :key="newSurvey">
      <q-item-side avatar="/statics/customSVG/startSurveyWhite.svg" />
      <q-item-main :label="$t('Start survey')" class="text-white" />
    </q-side-link>


    <q-side-link multiline highlight item :to="{name: 'CollectedData'}" :key="Data">
      <q-item-side avatar="/statics/customSVG/collectedDataWhite.svg" />
      <q-item-main :label="$t('Collected Data')"  class="text-white"/>
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
  name: "collectionpagelinks",
  components: {
  QSideLink,
  QItemTile,
  QItemSide,
  QItemMain,
  QItemSeparator
  }
};
</script>
