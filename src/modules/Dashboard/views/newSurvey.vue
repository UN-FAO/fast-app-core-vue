<template>

<div class="row">
    
<q-card class="col-lg-4 col-md-4 shadow-2" style="margin-top: 30px; margin-left: 30px;">
    <q-card-title>
        <h3>Title of the Survey</h3>
        <q-rating slot="subtitle" v-model="stars" :max="5" />
    </q-card-title>
    <q-card-separator />
    <q-card-actions right>
        <q-btn flat round small><q-icon name="fa-database" />DATA</q-btn>
        <q-btn flat round small><q-icon name="fa-plus-square-o" />START</q-btn>
    </q-card-actions>
</q-card>

<q-card class="col-lg-4 col-md-4 shadow-2" style="margin-top: 30px; margin-left: 30px;">
    <q-card-title>
        <h3>Title of the Survey</h3>
        <q-rating slot="subtitle" v-model="stars" :max="5" />
    </q-card-title>
    <q-card-separator />
    <q-card-actions>
        <q-btn flat round small><q-icon name="fa-database" />DATA</q-btn>
        <q-btn flat round small><q-icon name="fa-plus-square-o" />START</q-btn>
    </q-card-actions>
</q-card>
    
<q-card class="col-lg-4 col-md-4 shadow-2" style="margin-top: 30px; margin-left: 30px;">
    <q-card-title>
        <h3>Title of the Survey</h3>
        <q-rating slot="subtitle" v-model="stars" :max="5" />
    </q-card-title>
    <q-card-separator />
    <q-card-actions>
        <q-btn flat round small><q-icon name="fa-database" />DATA</q-btn>
        <q-btn flat round small><q-icon name="fa-plus-square-o" />START</q-btn>
    </q-card-actions>
</q-card>
    
<q-card class="col-lg-4 col-md-4 shadow-2" style="margin-top: 30px; margin-left: 30px;">
    <q-card-title>
        <h3>Title of the Survey</h3>
        <q-rating slot="subtitle" v-model="stars" :max="5" />
    </q-card-title>
    <q-card-separator />
    <q-card-actions>
        <q-btn flat round small><q-icon name="fa-database" />DATA</q-btn>
        <q-btn flat round small><q-icon name="fa-plus-square-o" />START</q-btn>
    </q-card-actions>
</q-card>
    
<q-card class="col-lg-4 col-md-4 shadow-2" style="margin-top: 30px; margin-left: 30px;">
    <q-card-title>
        <h3>Title of the Survey</h3>
        <q-rating slot="subtitle" v-model="stars" :max="5" />
    </q-card-title>
    <q-card-separator />
    <q-card-actions>
        <q-btn flat round small><q-icon name="fa-database" />DATA</q-btn>
        <q-btn flat round small><q-icon name="fa-plus-square-o" />START</q-btn>
    </q-card-actions>
</q-card>
    
<q-card class="col-lg-4 col-md-4 shadow-2" style="margin-top: 30px; margin-left: 30px;">
    <q-card-title>
        <h3>Title of the Survey</h3>
        <q-rating slot="subtitle" v-model="stars" :max="5" />
    </q-card-title>
    <q-card-separator />
    <q-card-actions>
        <q-btn flat round small><q-icon name="fa-database" />DATA</q-btn>
        <q-btn flat round small><q-icon name="fa-plus-square-o" />START</q-btn>
    </q-card-actions>
</q-card>
    
<q-card class="col-lg-4 col-md-4 shadow-2" style="margin-top: 30px; margin-left: 30px;">
    <q-card-title>
        <h3>Title of the Survey</h3>
        <q-rating slot="subtitle" v-model="stars" :max="5" />
    </q-card-title>
    <q-card-separator />
    <q-card-actions>
        <q-btn flat round small><q-icon name="fa-database" />DATA</q-btn>
        <q-btn flat round small><q-icon name="fa-plus-square-o" />START</q-btn>
    </q-card-actions>
</q-card>
    
<q-card class="col-lg-4 col-md-4 shadow-2" style="margin-top: 30px; margin-left: 30px;">
    <q-card-title>
        <h3>Title of the Survey</h3>
        <q-rating slot="subtitle" v-model="stars" :max="5" />
    </q-card-title>
    <q-card-separator />
    <q-card-actions>
        <q-btn flat round small><q-icon name="fa-database" />DATA</q-btn>
        <q-btn flat round small><q-icon name="fa-plus-square-o" />START</q-btn>
    </q-card-actions>
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
