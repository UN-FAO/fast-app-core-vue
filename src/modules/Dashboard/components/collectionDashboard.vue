<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10">
    <div class="section-title pageTitle">
      {{ $t("Home") }}
    </div>
    <hr style="border-top: 1px solid lightgray;">

    <div class="row">
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:auto;">
        <q-card style="background:white;">
          <q-card-title>
            <h4>
              {{ $t("Welcome to the APP for the Survey on Social Acceptability of Aquaculture") }}(*)

            </h4>
            <span slot="subtitle"> {{ $t("Please note that") }}: </span>
          </q-card-title>
          <q-card-main>
            <q-list class="no-border">

              <q-item>
                <q-item-main label>
                  {{ $t("This online application offers the possibility of saving a draft of the questionnaire at any time you want and completing it afterwards. This option is available clicking the") }}
                  <q-icon name="fa-floppy-o" color="primary" /> {{ $t("icon visible on the top right corner during the process") }}
                </q-item-main>
              </q-item>
              <q-item>
                <q-item-side icon="help" />
                <q-item-main label>
                  {{ $t("You can find a glossary of aquaculture terms") }}
                  <a href="http://www.fao.org/faoterm/en/?defaultCollId=14" target="_blank">{{ $t("here") }}</a>.
                </q-item-main>
              </q-item>
            </q-list>
          </q-card-main>
        </q-card>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:auto;">
        <q-card color="white" class="text-black cardRibbon" style="cursor: pointer;" @click="$router.push({name: 'newSurvey'})">
          <q-card-title>
            <q-item>
              <q-item-side avatar="statics/customSVG/startSurvey.svg" />
              <q-item-main>
                <q-item-tile label>{{ $t("Start survey") }}</q-item-tile>

              </q-item-main>
            </q-item>
            <q-card-separator style="background:lightgrey;" />
            <span slot="subtitle" class="pull-left text-grey">
                    {{ $t('Select this option to start the survey') }}
                    <br>
                  </span>
          </q-card-title>
        </q-card>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:auto;">
        <q-card color="white" class="text-black cardRibbon" style="cursor: pointer;" @click="$router.push({name: 'CollectedData'})">
          <q-card-title>
            <q-item>
              <q-item-side avatar="statics/customSVG/collectedData.svg" />
              <q-item-main>
                <q-item-tile label>{{ $t("Collected Data") }}</q-item-tile>

              </q-item-main>
            </q-item>
            <q-card-separator style="background:lightgrey;" />
            <span slot="subtitle" class="pull-left text-grey">
                    {{ $t('Select this option to check submitted surveys') }}
                    <br>
                  </span>
          </q-card-title>
        </q-card>
      </div>
    </div>

    <div class="row" v-if="$FAST_CONFIG.HAS_ABOUT">
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:auto;">
        <q-card color="white" class="text-black cardRibbon" style="cursor: pointer;" @click="$router.push({name: 'About'})">
          <q-card-title>
            <q-item>
              <q-item-side avatar="statics/customSVG/about.svg" />
              <q-item-main>
                <q-item-tile label>{{$t('About') +' '+ $FAST_CONFIG.APP_FANTACY_NAME}}</q-item-tile>

              </q-item-main>
            </q-item>
            <q-card-separator style="background:lightgrey;" />
            <span slot="subtitle" class="pull-left text-grey">

                    <br>
                  </span>
          </q-card-title>
        </q-card>
      </div>
    </div>



    <div class="row">
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:auto;">
        <q-card style="background:white;">
          <q-card-main>
            <q-list class="no-border">
              <q-item>
                <q-item-side/>
                <q-item-main label>
                  <h6> (*){{ $t('The survey is carried out within the project "Mediterranean Aquaculture Integrated Development (MedAID)" supported by the European Union in the frame of Horizon 2020, grant agreement number 727315.') }}
                  </h6>
                </q-item-main>
              </q-item>
            </q-list>
          </q-card-main>
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
  QItemSeparator,
} from 'quasar';
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
    QItemSeparator,
  },
  name: 'collectiondashboard',
};
</script>
