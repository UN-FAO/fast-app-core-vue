<template>
  <div class="row FormioContainer">

    <q-card style="background-color: white; max-height: fit-content;" class="col-lg-3  col-md-12 col-sm-12 col-xs-12" v-if="showPages">
      <q-card-main>
        <q-list separator style="border: none !important">

           <q-item class="formioPagination" @click="goToRoute('alldata')"  multiline style="text-align: left; text-transform: uppercase; min-height: 60px; border-radius: 5px;" link v-bind:class="activePage">
             <q-item-tile avatar>
               <img src="statics/customSVG/allData.svg">
              </q-item-tile>
            <q-item-main style=" margin-top: auto;  margin-bottom: auto; margin-left:10px" :label="$t('All data')" label-lines="3" />
          </q-item>



           <q-item class="formioPagination" @click="goToRoute('reviewers')"  multiline style="text-align: left; text-transform: uppercase; min-height: 60px; border-radius: 5px;" link v-bind:class="activePage">
             <q-item-tile avatar>
               <img src="statics/customSVG/reviewer.svg">
              </q-item-tile>
            <q-item-main style=" margin-top: auto;  margin-bottom: auto; margin-left:10px" :label="$t('Data reviewers')" label-lines="3" />
          </q-item>


           <q-item class="formioPagination" multiline @click="goToRoute('translations')" style="text-align: left; text-transform: uppercase; min-height: 60px; border-radius: 5px;" link v-bind:class="activePage">
              <q-item-tile icon="translate">
              </q-item-tile>
            <q-item-main  style=" margin-top: auto;  margin-bottom: auto; margin-left:20px" :label="$t('Translations')" label-lines="3" />
          </q-item>

        </q-list>
      </q-card-main>
    </q-card>

    <q-card color="white" v-bind:class="getFormClass" style="position:inherit !important;">
      <q-card-main>

        <q-btn flat @click="togglePages" icon="menu" style="color:black;"></q-btn>
        <router-view></router-view>
      </q-card-main>

    </q-card>

  </div>
</template>

<script>
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
  } from "quasar";
  export default {
    components: {
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
    },
    computed: {
      getFormClass() {
        let className = "";
        if (this.showPages) {
          className = "col-xl-8 col-lg-8  col-md-12 col-sm-12 col-xs-12";
        } else {
          className =
            "col-xl-10 col-lg-10  col-md-12 col-sm-12 col-lg-offset-1 col-md-offset-1 col-xl-offset-1";
        }
        return className;
      }
    },
    data: function() {
      return {
        showPages: true
      };
    },
    methods: {
      togglePages() {
        this.showPages = !this.showPages;
      },
      goToRoute(name) {
        this.$router.push({
          name: name
        });
      }
    }
  };
</script>
