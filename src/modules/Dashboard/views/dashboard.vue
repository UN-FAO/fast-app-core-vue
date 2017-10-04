<template>
<div class="row">
  <q-card inline
          class="col-lg-5 col-lg-offset-1" style="background: white;"v-for="(form, index) in forms" :key="form.data._id" >
    <q-card-media>
    </q-card-media>
    <q-card-title>
      {{form.data.title}}
      <q-rating slot="subtitle"
                v-model="stars"
                :max="5" />
      <div slot="right"
           class="row items-center">
        <q-icon name="place" /> FAO
      </div>
    </q-card-title>
    <q-card-main>
      <p>
        <router-link :to="{ name: 'formio_form_submission', params: { idForm: form.data.path }}">Start Survey</router-link>
      </p>
      <p>
        <router-link :to="{ name: 'formio_form_show', params: { idForm: form.data.path }}">See submitions</router-link>
      </p>
    </q-card-main>
    <q-card-separator />
  </q-card>
</div>

</template>

<script>
import { QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator } from 'quasar'
import LocalForm from 'database/collections/scopes/LocalForm'

export default {
  components: {
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QFab,
    QFabAction,
    QFixedPosition,
    QPullToRefresh,
    QTabs,
    QTab,
    QTabPane,
    QCollapsible,
    QBtn,
    QIcon,
    QTooltip,
    QList,
    QItem,
    QItemSeparator
  },
  data: () => {
    return {
      forms: [],
      subscriptions: []
    }
  },
  mounted () {
    LocalForm.sAll(this, 'forms')
  }
}

</script>
