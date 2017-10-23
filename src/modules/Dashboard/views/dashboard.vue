<template>
<div>

<div class="row">
  <q-card  class="col-lg-5 col-lg-offset-1" flat>
 
  <q-card-main>
      <q-icon name="fa-plus-square-o fa-5x" />
      <h1>Modules</h1>
       <q-list style="border: none; padding: 0;">
      <q-collapsible>
        <div>
         <table style="display: block; height:200px; overflow-y: scroll;">
        <tr v-for="(form, index) in orderedForms" :key="form.data._id" v-if="form.data.tags.indexOf('visible') > -1" >
          <td class="col-lg-1"><q-icon name="fa-file-o" /></td>
          <td class="col-lg-10">
          <router-link :to="{name: 'formio_form_submission', params: { idForm: form.data.path}}"><h3>{{form.data.title.toUpperCase()}}</h3></router-link>
        </td>
        </tr>
      </table>
        </div>
      </q-collapsible>
    </q-list>
       
  </q-card-main>
</q-card>

<q-card  class="col-lg-5" flat>
 
  <q-card-main>
     <q-icon name="fa-database fa-5x" />
      <h1>Data Collected</h1>

      <q-list style="border: none; padding: 0;">
      <q-collapsible>
        <div>
           <table style="display: block; height:200px; overflow-y: scroll;">

        <tr>
          <td class="col-lg-1"><q-icon name="fa-database" /></td>
          <td>
          <router-link :to="{name: 'formio_form_show', params: { idForm: '*'}}"><h3>ALL DATA</h3></router-link>
          </td>

        </tr>
        <tr v-for="(form, index) in orderedForms" :key="form.data._id" v-if="form.data.tags.indexOf('visible') > -1">
          <td class="col-lg-1"><q-icon name="fa-database" /></td>
          <td class="col-lg-10">
          <router-link :to="{name: 'formio_form_show', params: { idForm: form.data.path}}"><h3>{{form.data.title.toUpperCase()}}</h3></router-link>
        </td>
        </tr>
      </table>
        </div>
      </q-collapsible>
    </q-list>
  </q-card-main>
</q-card>

</div>



<div class="row">
  <q-card  class="col-lg-5 col-lg-offset-1" flat>

  <q-card-main>
      <q-icon name="fa-cog fa-5x" />
      <h1>Application Settings</h1>
       <q-btn @click="toggleFlip(3)" round color="grey" flat >
      </q-btn>
  </q-card-main>
</q-card>

<q-card  class="col-lg-5" flat>
  <q-card-main>
     <q-icon name="fa-mobile fa-5x" />
      <h1>About PAT</h1>
  </q-card-main>
</q-card>

</div>

</div>

</template>
<style scoped>

table {  
    color: #333;
    font-family: Helvetica, Arial, sans-serif;
    width: 100%; 
    border-collapse: 
    collapse; border-spacing: 0; 
}

td, th {  
    border: 1px solid transparent; /* No more visible border */
    height: 30px; 
    transition: all 0.3s;  /* Simple transition for hover effect */
}

th {  
    background: #DFDFDF;  /* Darken header a bit */
    font-weight: bold;
}

td {  
    background: #FAFAFA;
    text-align: center;
}

/* Cells in even rows (2,4,6...) are one color */        
tr:nth-child(even) td { background: #F1F1F1; }   

/* Cells in odd rows (1,3,5...) are another (excludes header cells)  */        
tr:nth-child(odd) td { background: #FEFEFE; }  

tr:nth-child(even){background-color: #f2f2f2}


</style>
<script>
import {QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator, Loading} from 'quasar'
import LocalForm from 'database/collections/scopes/LocalForm'
import _ from 'lodash'
export default {
  name: 'card',
  mounted: async function () {
    LocalForm.sAll(this, 'forms')
  },
  components: {
    QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator, Loading
  },
  data: () => {
    return {
      flipped0: 'card',
      flipped1: 'card',
      flipped2: 'card',
      flipped3: 'card',
      forms: [],
      subscriptions: []
    }
  },
  methods: {
    toggleFlip (n) {
      if (this['flipped' + n] === 'card')
      {
        this['flipped' + n] = 'card flipped'
      } else {
        this['flipped' + n] = 'card'
      }
    }
  },
  computed: {
    // a computed getter
    orderedForms: function () {
      let ordered = []
      if (this.forms.length === 0) {
        return []
      } else {
        ordered = _.sortBy(this.forms, 'data.title')
        return ordered
      }
    }
  }
}

</script>
