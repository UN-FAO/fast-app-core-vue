
    <q-tabs slot="navigation" v-if="!layoutStore.hideTabs">
      <q-route-tab slot="title" icon="play_circle_outline" to="/showcase/layout/play-with-layout" replace label="Play with Layout" />
      <q-route-tab slot="title" icon="view_array" to="/showcase/layout/drawer-panels" replace label="Drawer Panels" />
      <q-route-tab slot="title" icon="pin_drop" to="/showcase/layout/fixed-positioning" replace label="Fixed Positioning" />
      <q-route-tab slot="title" icon="play_for_work" to="/showcase/layout/floating-action-button" replace label="Floating Action Button" />
    </q-tabs>