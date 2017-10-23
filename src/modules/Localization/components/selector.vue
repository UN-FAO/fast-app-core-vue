<template>
<q-btn ref="target" flat="true">
    <q-icon name="language" />
  <!-- Direct child of target -->
  <q-popover ref="popover">
    <q-list item-separator link>
      <q-item v-bind:class="{ active: isActive(lenguage.code)}"  @click="setLanguage({code: lenguage.code, direction: lenguage.direction}), $refs.popover.close()" v-for="lenguage in lenguages" :key="lenguage.code">
      {{lenguage.label}}
      </q-item>
    </q-list>
  </q-popover>
</q-btn>
</template>
<style scoped>
  .active {
    background: #0e6da5;
    color: white;
  }
</style>

<script>
import {
  Toast,
  QBtn,
  QPopover,
  QList,
  QItem,
  QItemMain,
  QIcon,
  QRadio,
  QCard,
  QCardTitle,
  QCardMain,
  QChip,
  QFixedPosition
} from 'quasar'
export default {
  name: 'localization',
  components: {
    Toast,
    QBtn,
    QPopover,
    QList,
    QItem,
    QItemMain,
    QIcon,
    QRadio,
    QCard,
    QCardTitle,
    QCardMain,
    QChip,
    QFixedPosition
  },
   data: function () {
    return {
      lenguage: localStorage.getItem('defaultLenguage') ? localStorage.getItem('defaultLenguage') : 'en',
      lenguages: [{code: 'en', direction: 'ltr', label: 'English'},
                  {code: 'es', direction: 'ltr', label: 'Español'},
                  {code: 'fr', direction: 'ltr', label: 'Francais'}
                ]
    }
  },
  methods: {
    isActive (code) {
      return !!(this.lenguage === code)
    },
    setLanguage (lenguage) {
      this.$i18n.locale = lenguage.code
      this.lenguage = lenguage.code
      localStorage.setItem('defaultLenguage', lenguage.code)
      this.$eventHub.$emit('lenguageSelection', lenguage)
    }
  }
}
</script>