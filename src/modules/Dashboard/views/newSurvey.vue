<template>

<div class="row">
<q-card class="col-lg-5 col-md-5 shadow-2" style="margin-top: 30px; margin-left: 30px" v-for="(form, index) in forms" :key="form.data._id" v-if="form.data.tags.indexOf('visible') > -1" >
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
</div>

</template>

<script>
import {QIcon, QBtn, QList, QItem, QItemSide, QItemTile, QItemMain} from 'quasar'
import LocalForm from 'database/collections/scopes/LocalForm'
export default {
  name: 'card',
  mounted: async function () {
    LocalForm.sAll(this, 'forms')
  },
  components: {
    QIcon, QBtn, QList, QItem, QItemSide, QItemTile, QItemMain
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
  }
}

</script>
