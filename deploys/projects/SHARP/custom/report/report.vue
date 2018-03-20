<template>
<div>
  <div class="row customReport">
    <q-card color="white"  class="col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-lg-10 col-md-10 col-sm-12 col-xs-12">
      <q-card-title>
        Relative resilience by domain
      </q-card-title>
        <q-card-main>
          <div style="color:black; text-align: right;" class="pull-right">
            Relative resilience = (Technical + Adequacy)
            </div>
                <div>
                    <radarGroups :submission="submission"> </radarGroups>
                </div>
        </q-card-main>
    </q-card>
    <q-card color="white" class="col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-lg-10 col-md-10 col-sm-12 col-xs-12">
        <q-card-title>
        Relative resilience by Module
      </q-card-title>
        <q-card-main>
               <radarModules :submission="submission"> </radarModules>
        </q-card-main>
    </q-card>
  </div>
    <div class="row">
    <q-card color="white" class="col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-lg-10 col-md-10 col-sm-12 col-xs-12">
        <q-card-title>
            Detailed Resilience report
        </q-card-title>
        <q-card-separator />
        <q-card-main>

                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top:30px">
                    <relative :submission="submission" />
                </div>
                 <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top:30px">
                    <priorities :submission="submission"></priorities>
                </div>


                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top:30px">
                    <importance :submission="submission"></importance>
                </div>

                 <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-top:30px">
                    <naquestions :submission="submission"></naquestions>
                </div>
        </q-card-main>
    </q-card>
    </div>
</div>
</template>

<script>
import { QCard, QCardTitle, QCardSeparator, QCardMain } from "quasar";
import relative from "./components/tables/relativeResilence";
import radarGroups from "./components/radars/radarGroups";
import radarModules from "./components/radars/radarModules";
import naquestions from "./components/tables/naQuestions";
import importance from "./components/tables/importanceLevels";
import priorities from "./components/tables/priorities";
export default {
  name: "report",
  props: ["submission"],
  watch: {
    submission: function(val) {}
  },
  components: {
    importance,
    naquestions,
    relative,
    radarGroups,
    radarModules,
    priorities,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain
  }
};
</script>
<style SCOPED>
.customReport .q-card-title {
  color: white;
  background: #0574a9;
  padding-top: 10px !important;
  height: 50px;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
  font-size: x-large;
}
.customReport .q-card-primary.q-card-container.row.no-wrap {
  padding: 0px;
}
.customReport .q-card {
  margin-top: 30px;
  padding: 0px !important;
}
</style>
