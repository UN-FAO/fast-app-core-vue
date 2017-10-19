<template>
<div>
<div class="row">

<section class="container col-lg-5 col-md-6">
  <div ref="card" :class="flipped0">
    <div class="front">
     
        <q-icon name="fa-plus-square-o fa-5x" />
  
      <h1>Modules</h1>
       <q-btn @click="toggleFlip(0)" round color="grey" flat >
        <q-icon name="fa-plus-square" />
      </q-btn>
      
    </div>
    <div class="back">

        <q-btn @click="toggleFlip(0)" style="z-index: 1;" round color="grey"  flat>
          <q-icon name="fa-times" />
        </q-btn>
     
      <div class="row centered">
         <h3>Modules</h3>
      <table style="display: block; height:200px; overflow-y: scroll;">
        <tr v-for="(form, index) in orderedForms" :key="form.data._id" v-if="form.data.tags.indexOf('visible') > -1" >
          <td class="col-lg-1"><q-icon name="fa-file-o" /></td>
          <td class="col-lg-10">
          <router-link :to="{name: 'formio_form_submission', params: { idForm: form.data.path}}"><h3>{{form.data.title.toUpperCase()}}</h3></router-link>
        </td>
        </tr>
      </table>
       </div>
    </div>
  </div>

</section>

<section class="container col-lg-5 col-md-6">
  <div ref="card" :class="flipped1">
    <div class="front">
      <q-icon name="fa-database fa-5x" />
      <h1>Data Collected</h1>
       <q-btn @click="toggleFlip(1)" round color="grey" flat >
        <q-icon name="fa-plus-square" />
      </q-btn>
      
    </div>
    <div class="back">
      <q-btn @click="toggleFlip(1)" style="z-index: 1;" round color="grey"  flat>
        <q-icon name="fa-times" />
      </q-btn>
      <h1></h1>
      <div class="row centered">
         <h3>Data</h3>
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
       
    </div>
  </div>
</section>
</div>

<div class="row">

<section class="container col-lg-5 col-md-6">
  <div ref="card" :class="flipped2">
    <div class="front">
      <q-icon name="fa-cog fa-5x" />
      <h1>Application Settings</h1>
       <q-btn @click="toggleFlip(2)" round color="grey" flat >
        <q-icon name="fa-plus-square" />
      </q-btn>
      
    </div>
    <div class="back">
      <q-btn @click="toggleFlip(2)" round color="grey"  flat>
        <q-icon name="fa-times" />
      </q-btn>
      <h1>Survey list</h1>
       
    </div>
  </div>

</section>

<section class="container col-lg-5 col-md-6">
  <div ref="card" :class="flipped3">
    <div class="front">
      <q-icon name="fa-mobile fa-5x" />
      <h1>About PAT</h1>
       <q-btn @click="toggleFlip(3)" round color="grey" flat >
        <q-icon name="fa-plus-square" />
      </q-btn>
      
    </div>
    <div class="back">
      <q-btn @click="toggleFlip(3)" round color="grey"  flat>
        <q-icon name="fa-times" />
      </q-btn>
      <h1>Survey list</h1>
       
    </div>
  </div>
</section>
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

.container {
  margin-top: 30px;
    min-height: 260px;
    position: relative;
    -webkit-perspective: 800px;
    -moz-perspective: 800px;
    -o-perspective: 800px;
    perspective: 800px;
}
.card {
    width: 100%;
    height: 100%;
    -webkit-transition: -webkit-transform 0.5s;
    -moz-transition: -moz-transform 0.5s;
    -o-transition: -o-transform 0.5s;
    transition: transform 0.5s;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -o-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform-origin: 50% 50%;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}
.card div {
    display: grid;
    height: 100%;
    width: 100%;
    text-align: center;
    font-weight: bold;
    position: absolute;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    backface-visibility: hidden;
}
.card .front {
  background: white;
}
.card .back {
   background: white;
    -webkit-transform: rotateY( 180deg );
    -moz-transform: rotateY( 180deg );
    -o-transform: rotateY( 180deg );
    transform: rotateY( 180deg );
}
.card.flipped {
    -webkit-transform: rotateY( 180deg );
    -moz-transform: rotateY( 180deg );
    -o-transform: rotateY( 180deg );
    transform: rotateY( 180deg );
}
</style>
<script>
import {QIcon, QBtn, QList, QItem, QItemSide, QItemTile} from 'quasar'
import LocalForm from 'database/collections/scopes/LocalForm'
import _ from 'lodash'
export default {
  name: 'card',
  mounted: async function () {
    LocalForm.sAll(this, 'forms')
  },
  components: {
    QIcon, QBtn, QList, QItem, QItemSide, QItemTile
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
