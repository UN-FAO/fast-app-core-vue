<template>
  <div style="color:black">

    <q-fixed-position corner="top-right" :offset="[18, 18]">
            <q-fab color="red" icon="add" direction="down" push>

                <q-btn v-if="actions.includes('create')" color="primary" round @click="emitEvent('FAST:GO:CREATE')"> <i class="material-icons edit" style="font-size: 1.7em;">add</i>
                    <q-tooltip>{{$t('New Submission')}}</q-tooltip>
                </q-btn>

                <q-btn v-if="actions.includes('export')" color="positive" round small @click="emitEvent('FAST:EXPORT', 'csv')"> <i class="material-icons edit" style="font-size: 1.3em;">file_download</i><span style="font-size: 0.6em;">CSV</span>
                    <q-tooltip>{{$t('Export CSV')}}</q-tooltip>
                </q-btn>
                <q-btn v-if="actions.includes('export')" color="positive" round small @click="emitEvent('FAST:EXPORT', 'json')"> <i class="material-icons edit" style="font-size: 1.3em;">file_download</i><span style="font-size: 0.6em;">JSON</span>
                    <q-tooltip>{{$t('Export Json')}}</q-tooltip>
                </q-btn>

                <q-fab-action  v-if="actions.includes('import')" color="secondary" @click="emitEvent('FAST:IMPORT', 'json')" icon="fa-upload">
                    <q-tooltip>
                        {{$t('Import Submissions')}}
                    </q-tooltip>
                </q-fab-action>

            </q-fab>
        </q-fixed-position>
  </div>
</template>

<script>
import { QFixedPosition, QFab, QBtn, QTooltip, QFabAction } from "quasar";
export default {
  components: {
    QFixedPosition,
    QFab,
    QBtn,
    QTooltip,
    QFabAction
  },
  name: "button-menu",
  props: {
    render: {
      required: true
    },
    actions: {
      required: true
    }
  },
  watch: {
    actions: function(data) {},
    render: function(data) {}
  },
  methods: {
    emitEvent(event, params) {
      this.$eventHub.emit(event, params);
    }
  }
};
</script>




