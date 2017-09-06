<template>
<q-btn ref="target" flat="true">
    <q-icon name="language" />
  <!-- Direct child of target -->
  <q-popover ref="popover">
    <q-list item-separator link>
      <q-item @click="setLanguage({code: 'en', direction: 'ltr'}), $refs.popover.close()">
      en
      </q-item>
      <q-item @click="setLanguage({code: 'ja', direction: 'ltr'}), $refs.popover.close()">
        日本人
      </q-item>
      <q-item @click="setLanguage({code: 'ar', direction: 'rtl'}), $refs.popover.close()">
        عربى
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
      this.$eventHub.$emit('lenguageSelection', lenguage.direction)
      this.$swal(
        'Changed!',
        'The language has been changed',
        'success'
      )
      /*
      this.$swal({
        title: 'Are you sure?',
        text: 'If you change the lenguage all the unsaved changes will be removed!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
      }).then(() => {
        this.$i18n.locale = lenguage.code
        this.$eventHub.$emit('lenguageSelection', lenguage.direction)
        this.$swal(
          'Changed!',
          'The language has been changed',
          'success'
        )
      })
      */
    }
  }
}
</script>