<template>

<div class="row">
<div class="col-lg-5 col-lg-offset-3" style="margin-top: 30px">
<q-card>
  <q-list>
    <q-item>
      <q-item-side>
        <q-item-tile color="primary" icon="local bar" />
      </q-item-side>
      <q-item-main>
        <q-item-tile label><h2>Bar XYZz</h2></q-item-tile>
      </q-item-main>
    </q-item>
    <q-item>
      <q-item-side>
        <q-item-tile color="red" icon="local gas station" />
      </q-item-side>
      <q-item-main>
        <q-item-tile label>Gas Station</q-item-tile>
      </q-item-main>
    </q-item>
    <q-item>
      <q-item-side>
        <q-item-tile color="amber" icon="local movies" />
      </q-item-side>
      <q-item-main>
        <q-item-tile label>Cinema XYZ</q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
</q-card>
</div>
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
  }
}

</script>
