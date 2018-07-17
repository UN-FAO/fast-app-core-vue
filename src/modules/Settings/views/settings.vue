<template>
  <div class="row FormioContainer">
    <q-card class="col-xl-10 col-lg-10  col-md-12 col-sm-12 col-lg-offset-1 col-md-offset-1 col-xl-offset-1" style="position:inherit !important;">
      <q-card-title>
             <breadcrum
                :parent="$route.query.parent"
                :currentPageTitle="formTitle"
              />
      </q-card-title>
      <q-card-main>

        <q-btn flat @click="togglePages" icon="menu" style="color:black;"></q-btn>
        <router-view></router-view>
      </q-card-main>

    </q-card>

  </div>
</template>

<script>
import breadcrum from 'components/breadcrum';
import {
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QFab,
  QFabAction,
  QFixedPosition,
  QTabs,
  QTab,
  QTabPane,
  QCollapsible,
  QBtn,
  QIcon,
  QTooltip,
  QList,
  QItemTile,
  QItem,
  QItemSeparator,
  Loading,
  QItemMain,
  QTransition,
  QInnerLoading
} from 'quasar';
export default {
  components: {
    breadcrum,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QFab,
    QFabAction,
    QFixedPosition,
    QTabs,
    QTab,
    QTabPane,
    QCollapsible,
    QBtn,
    QIcon,
    QTooltip,
    QList,
    QItem,
    QItemTile,
    QItemSeparator,
    Loading,
    QItemMain,
    QTransition,
    QInnerLoading
  }
};
</script>
