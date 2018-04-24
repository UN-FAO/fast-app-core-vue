<template>
<div>
   <q-side-link multiline highlight item :to="{name: 'newSurvey'}" :key="newSurvey">
      <q-item-side color="#1d2433" avatar="statics/customSVG/startSurvey.svg" />
      <q-item-main :label="$t('Start survey')"  />
    </q-side-link>


    <q-side-link multiline highlight item :to="{name: 'CollectedData'}" :key="Data">
      <q-item-side avatar="statics/customSVG/collectedData.svg" />
      <q-item-main :label="$t('Collected Data')"  />
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
