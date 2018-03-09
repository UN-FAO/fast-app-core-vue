<template>
<div class="container-fluid col-lg-offset-1 col-lg-10">
  <div class="section-title pageTitle">
     {{ $t("Home") }}
    </div>
    <hr style="border-top: 1px solid lightgray;">

    <hr style="1px solid #cec7c7">
      <div class="row">
    <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:auto;" >
      <q-card color="white" class="text-black cardRibbon"  style="cursor: pointer;" @click="$router.push({name: 'newSurvey'})">
      <q-card-title>
        <q-item>
          <q-item-side avatar="/statics/customSVG/startSurvey.svg" />
          <q-item-main>
            <q-item-tile label>{{ $t("Start survey") }}</q-item-tile>

          </q-item-main>
        </q-item>
              <q-card-separator style="background:lightgrey;"/>
        <span slot="subtitle" class="pull-left text-grey">
          Subtitlt
          <br>
        </span>
      </q-card-title>
    </q-card>
    </div>
     </div>

  <div class="row">
    <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:auto;" >
       <q-card color="white" class="text-black cardRibbon" @click="$router.push({name: 'CollectedData'})">
      <q-card-title >
        <q-item>
          <q-item-side avatar="/statics/customSVG/collectedData.svg" />
          <q-item-main>
            <q-item-tile label>{{ $t("Collected Data") }}</q-item-tile>

          </q-item-main>
        </q-item>
              <q-card-separator style="background:lightgrey;"/>
        <span slot="subtitle" class="pull-left text-grey">
          Subtitlt
          <br>
        </span>
      </q-card-title>
    </q-card>
    </div>
     </div>

  <div class="row">
    <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:auto;" >
      <q-card color="white" class="text-black cardRibbon" @click="$router.push({name: 'About'})">
      <q-card-title>
        <q-item>
          <q-item-side avatar="/statics/customSVG/about.svg" />
          <q-item-main>
            <q-item-tile label>{{$t('About') +' '+ $FAST_CONFIG.APP_FANTACY_NAME}}</q-item-tile>

          </q-item-main>
        </q-item>
              <q-card-separator style="background:lightgrey;"/>
        <span slot="subtitle" class="pull-left text-grey">
          Subtitlt
          <br>
        </span>
      </q-card-title>
    </q-card>
    </div>
     </div>


</div>
</template>
<script>
import {
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
} from "quasar";
export default {
  components: {
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
  name: "collectiondashboard"
};
</script>
