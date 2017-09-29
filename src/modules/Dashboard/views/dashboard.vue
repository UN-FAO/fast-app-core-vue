<style lang="css">
.desc {
  margin-top: 20px;
  margin-bottom: 40px;
}

.pl {
  padding-left: 20px;
}
</style>

<template>
<div class="row">
  <q-card inline
          class="col-lg-5 col-lg-offset-1" style="background: white;">
    <q-card-media>
    </q-card-media>
    <q-card-title>
      MDC Welcome Survey
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
        <router-link :to="{ name: 'formio_form_submission', params: { idForm: 'welcome' }}">Go to Survey</router-link>
      </p>
      <p>
        <router-link :to="{ name: 'formio_form_show', params: { idForm: 'welcome' }}">See submitions</router-link>
      </p>
    </q-card-main>
    <q-card-separator />
  </q-card>
</div>

</template>

<script>
import { QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QTabs, QTab, QTabPane, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator } from 'quasar'
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
  }

}

</script>
