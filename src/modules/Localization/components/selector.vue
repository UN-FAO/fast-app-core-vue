<template>
<q-btn ref="target" flat="true">
    <q-icon name="language" />
  <!-- Direct child of target -->
  <q-popover ref="popover">
    <q-list item-separator link>
      <q-item @click="setLanguage({code: 'en', direction: 'ltr'}), $refs.popover.close()">
      en
      </q-item>
      <q-item @click="setLanguage({code: 'fr', direction: 'ltr'}), $refs.popover.close()">
        fr
      </q-item>
      <q-item @click="setLanguage({code: 'es', direction: 'rtl'}), $refs.popover.close()">
       es
      </q-item>
    </q-list>
  </q-popover>
</q-btn>
</template>

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
  methods: {
    setLanguage (lenguage) {
      this.$i18n.locale = lenguage.code
      this.$eventHub.$emit('lenguageSelection', lenguage)
    }
  }
}
</script>