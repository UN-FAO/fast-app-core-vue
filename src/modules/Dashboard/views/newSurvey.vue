<template>

<div class="row">
<q-card class="col-lg-8 col-lg-offset-2 shadow-2" style="margin-top: 30px; background: white;">
  <q-collapsible class="col-lg-12" :label="'Module ' + indexForms" v-for="(forms, indexForms) in groupedSurveys" :key="indexForms" v-if="indexForms !== 0">
 
<q-card class="col-lg-12 col-md-12 shadow-2" style="margin-top: 30px; margin-left: 30px" v-for="(form, index) in forms" :key="index">
  <q-card-title>
    <h3>
   {{form.data.title}}
 </h3>
    <q-rating slot="subtitle" v-model="stars" :max="5" />
  </q-card-title>
  <q-card-separator />
  <q-card-actions>
    <q-btn flat round small @click="goTo({name: 'formio_form_show', params: { idForm: form.data.path}})"><q-icon name="fa-database" />DATA</q-btn>
    
    <q-btn flat round small @click="goTo({name: 'formio_form_submission', params: { idForm: form.data.path}})"><q-icon name="fa-plus-square-o" />START</q-btn>
  </q-card-actions>
</q-card>
 </q-collapsible>
</q-card>

</div>

</template>

<script>
import {QIcon, QBtn, QList, QItem, QItemSide, QItemTile, QItemMain, QCollapsible} from 'quasar'
import LocalForm from 'database/collections/scopes/LocalForm'
import _ from 'lodash'
export default {
  name: 'card',
  mounted: async function () {
    LocalForm.sAll(this, 'forms')
  },
  components: {
    QIcon, QBtn, QList, QItem, QItemSide, QItemTile, QItemMain, QCollapsible
  },
  data: () => {
    return {
      forms: [],
      subscriptions: []
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
