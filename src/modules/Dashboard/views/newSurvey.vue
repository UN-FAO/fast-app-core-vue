<template>

  <div class="row" style="margin-top: 30px;">
    <div>
      <q-card color="white" style="bottom: unset; background-color: white" class="col-lg-6 col-lg-offset-2 col-md-6 col-md-offset-2 centered relative-position shadow-2">
        <q-card-main>
          <q-transition appear enter="fadeIn" leave="fadeOut">


            <div class="row">

              <div class="form-group has-feedback formio-component formio-component-radio" v-if="typeof forms !== 'undefined'">
                <h3 class="control-label" style="color: #525f7f; font-weight: 300;">Please select the version that you want to use: </h3>
                <div class="input-group" v-for="(form, index) in forms" :key="index" v-if="form.data.tags.indexOf('visible') > -1">
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
</template>
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
  import LocalForm from "database/collections/scopes/LocalForm";
  import _ from "lodash";
  export default {
    name: "card",
    mounted: async function () {
      let forms = await LocalForm.sAll();
      this.forms = _.orderBy(forms, "data.title", "asc");
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
        loading: true
      };
    },
    methods: {
      goTo(route) {
        this.$router.push(route);
      }
    },
    computed: {
      // a computed getter
      groupedSurveys: function () {
        let grouped = [];
        if (this.forms.length === 0) {
          return [];
        } else {
          _.forEach(this.forms, function (form) {
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
          _.forEach(grouped, (group, index) => {
            grouped[index] = _.sortBy(group, "data.title");
          });
          return grouped;
        }
      }
    }
  };

</script>
