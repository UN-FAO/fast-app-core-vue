<template>

<div class="col-lg-offset-2 col-md-offset-2 col-sm-offset-2 ">
  <div class="row">
  <q-card class="col-lg-8 col-md-8 col-sm-12 shadow-2" style="margin-top: 30px; margin-left: 43px;">
    <q-card-title>
        <h3 style="text-transform: uppercase;">All Collected Data
          <div>
              <q-btn flat big class="pull-right" round @click="goTo({name: 'formio_form_show', params: { idForm: '*'}})"><q-icon name="fa-database"/></q-btn>
        
          </div>
        </h3>
    </q-card-title>
   
</q-card>
</div>
<div class="row" v-if="forms.length === 0">
  <q-card flat class="col-lg-8 col-md-8 col-sm-12" style="margin-top: 30px; margin-left: 43px; align-items: center;justify-content: center;display: flex;">
    <q-card-title>
              <q-spinner-audio color="primary" :size="50"/>
              <h4>Loading Forms...</h4>
    </q-card-title>
</q-card>  
</div>
<div class="row">
<q-card class="col-lg-4 col-md-4 col-sm-12 shadow-2" style="margin-top: 30px; margin-left: 30px;" v-for="(form, index) in forms" :key="index" v-if="form.data.tags.indexOf('visible') > -1">
    <q-card-title>
        <h3 style="text-transform: uppercase;">{{form.data.title}}
          <div>
            <q-btn flat round   big class="pull-right" @click="goTo({name: 'formio_form_submission', params: { idForm: form.data.path}})"><q-icon name="ion-plus-circled" color="green"/></q-btn>
              <q-btn flat class="pull-right" round @click="goTo({name: 'formio_form_show', params: { idForm: form.data.path}})"><q-icon name="fa-database"/></q-btn>
        
          </div>
        </h3>
       

    </q-card-title>
   
</q-card>

</div>

</div>

</template>

<script>
import {QIcon, QBtn, QList, QItem, QItemSide, QItemTile, QItemMain, QCollapsible,
QSpinnerAudio} from 'quasar'
import LocalForm from 'database/collections/scopes/LocalForm'
import _ from 'lodash'
export default {
  name: 'card',
  mounted: async function () {
    this.forms = await LocalForm.sAll()
  },
  components: {
    QIcon, QBtn, QList, QItem, QItemSide, QItemTile, QItemMain, QCollapsible, QSpinnerAudio
  },
  data: () => {
    return {
      forms: []
    }
  },
  methods: {
    goTo(route) {
      this.$router.push(route)
    }
  },
  computed: {
    // a computed getter
    groupedSurveys: function () {
      let grouped = []
      if (this.forms.length === 0) {
        return []
      } else {
        _.forEach(this.forms, function (form) {
          if (form.data.tags.indexOf('visible') > -1) {
            let module = form.data.title.split('.')[0]
            form.module = module
            if (grouped[module]) {
              grouped[module].push(form)
            } else {
              grouped[module] = []
              grouped[module].push(form)
            }
          }
        })
        _.forEach(grouped, (group, index) => {
          grouped[index] = _.sortBy(group, 'data.title')
        })
        return grouped
      }
    }
  }
}

</script>
