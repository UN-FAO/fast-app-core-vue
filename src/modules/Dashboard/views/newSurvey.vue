<template>
<div class="container-fluid">
  <div class="row" style=" background:#f3f3f5">
    <div>
      <!--<q-card color="white" style="bottom: unset; margin-top: 30px;background-color: white" class="col-lg-6 col-lg-offset-2 col-md-6 col-md-offset-2 centered relative-position shadow-2">-->
      <q-card color="white" style="bottom: unset; margin-top: 30px;background-color: white" class="col-lg-8 col-md-11 centered relative-position shadow-2">
        <q-card-main>
          <q-transition appear enter="fadeIn" leave="fadeOut">


            <div class="row">

             <div class="form-group has-feedback formio-component formio-component-radio" v-if="typeof forms !== 'undefined'">
                <h1 class="_control-label-title">New Survey</h1>
                <h3 class="control-label" style="font-size: 2.5vh; font-weight: 300;">{{ $t("Please select the version that you want to use") }}: </h3>
                <div class="input-group" v-for="(form, index) in forms" :key="index" v-if="form.data.tags.indexOf('visible') > -1 || APP_ENV === 'dev' ">
                  <div class="radio">
                    <label class="control-label" for="S0-info-headOfHousehold-you">
                      <input name="selectedSurvey" type="radio" class="" lang="en" :value="form.data.title">
                      <span @click="goTo({name: 'formio_form_submission', params: { idForm: form.data.path}})">{{form.data.title}}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </q-transition>
        </q-card-main>
        <q-inner-loading v-if="typeof forms === 'undefined'">
          <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
        </q-inner-loading>
      </q-card>
    </div>

  </div>
    </div>
</template>


<style>
    input[type="radio"]+span, input[type="checkbox"]+span  {background-color: rgb(169, 223, 249);}
    label.control-label {color:#2d2d2d;}

</style>





<script>
import {
  QIcon,
  QBtn,
  QList,
  QItem,
  QItemSide,
  QItemTile,
  QItemMain,
  QCollapsible,
  QSpinnerAudio
} from "quasar";
import Form from 'database/models/Form'
import _orderBy from "lodash/orderBy";
import _forEach from "lodash/forEach";
import _sortBy from "lodash/sortBy";
import { APP_ENV } from "config/env";
export default {
  name: "card",
  mounted: async function() {
    let forms = await Form.local().sAll();
    this.forms = _orderBy(forms, "data.title", "asc");
    let visible = this.forms.filter(o => {
      return o.data.tags.indexOf("visible") > -1;
    });
    if (visible.length === 1 && this.APP_ENV !== 'dev') {
      this.goTo({
        name: "formio_form_submission",
        params: { idForm: visible[0].data.path }
      });
    }
  },
  components: {
    QIcon,
    QBtn,
    QList,
    QItem,
    QItemSide,
    QItemTile,
    QItemMain,
    QCollapsible,
    QSpinnerAudio
  },
  data: () => {
    return {
      forms: undefined,
      loading: true,
      APP_ENV: APP_ENV
    };
  },
  methods: {
    goTo(route) {
      this.$router.push(route);
    }
  },
  computed: {
    // a computed getter
    groupedSurveys: function() {
      let grouped = [];
      if (this.forms.length === 0) {
        return [];
      } else {
        _forEach(this.forms, function(form) {
          if (form.data.tags.indexOf("visible") > -1) {
            let module = form.data.title.split(".")[0];
            form.module = module;
            if (grouped[module]) {
              grouped[module].push(form);
            } else {
              grouped[module] = [];
              grouped[module].push(form);
            }
          }
        });
        _forEach(grouped, (group, index) => {
          grouped[index] = _sortBy(group, "data.title");
        });
        return grouped;
      }
    }
  }
};
</script>
