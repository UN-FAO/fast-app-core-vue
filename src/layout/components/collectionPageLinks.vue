<template>
<div>
   <q-side-link multiline highlight item :to="{name: 'newSurvey'}" key="newSurvey">
      <q-item-side color="#1d2433" icon="fa-file-text-o" />
      <q-item-main :label="$t('Start survey')"  />
    </q-side-link>


    <q-side-link multiline highlight item :to="{name: 'CollectedData'}" key="Data">
      <q-item-side icon="fa-database" />
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
} from 'quasar';
export default {
  name: 'collectionpagelinks',
  components: {
    QSideLink,
    QItemTile,
    QItemSide,
    QItemMain,
    QItemSeparator
  }
};
</script>
