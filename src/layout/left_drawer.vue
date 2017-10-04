<template>
<q-scroll-area style="width: 100%; height: 100%">
      <q-list-header class="bg-primary text-white">
      <center>
      <img src="statics/2000px-FAO_logo_reverse.png" style="max-height: 40px; max-width: 40px;"></img>
      FAO
      </center>
      </q-list-header>


      <q-list>

  <q-item @click="handleLogout()">
    <q-item-side icon="input" />
    <q-item-main>
      <q-item-tile label>Logout</q-item-tile>
    </q-item-main>
  </q-item>
  <q-item-separator inset />

</q-list>



      <q-side-link item :to="{name: 'dashboard', exact: true}">
        <q-item-side icon="home" />
        <q-item-main :label="$t('App.home')"/>
      </q-side-link>
      <q-item-separator />
       <q-list-header>{{ $t("App.available_forms") }}
        
          <q-btn flat  color="primary" @click="getForms()">
          <q-icon name="cloud_download" />
          <q-tooltip anchor="center right" self="center left" :offset="[10, 0]">
            <strong>{{ $t("App.sync_forms") }}</strong>
          </q-tooltip>
          </q-btn>

       </q-list-header>
      

      <q-side-link multiline highlight separator item
          v-for="(form, index) in forms"
          v-if="
            form.data.name!=='admin' &&
            form.data.name!=='translations'&&
            form.data.name!=='user' &&
            form.data.name!=='userLogin' &&
            form.data.name!=='userregister' &&
            form.data.name!=='adminLogin'"
          :to="{name: 'formio_form_submission', params: { idForm: form.data.path}}"
          :key="form.data._id">
          <q-item-side icon="assignmente" />
           <q-item-main :label="form.data.title" :sublabel="form.data.type" />
        </q-side-link>

        <div class="fixed-bottom text-center light text-italic">
          v.0.0.1

        </div>

    </q-scroll-area>
</template>
<script>
import {mapMutations, mapState, mapActions} from 'vuex'
import Auth from 'modules/Auth/api/Auth'
import LocalForm from 'database/collections/scopes/LocalForm'
import {QScrollArea, QSideLink, QItemTile, QItemSide, QItemMain, QListHeader, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator} from 'quasar'
import layoutStore from './layout-store'

export default {
  components: {
    QScrollArea, QSideLink, QItemTile, QItemSide, QItemMain, QListHeader, QCollapsible, QBtn, QIcon, QTooltip, QList, QItem, QItemSeparator
  },
  mounted: async function () {
    LocalForm.sAll(this, 'forms')
  },
  data () {
    return {
      forms: [],
      subscriptions: [],
      layoutStore
    }
  },
  computed: {
    ...mapState({
      User: state => state.authStore.authUser
    }),
    isOnline () {
      return this.$root.VueOnline
    }
  },
  methods: {
    ...mapActions(['getResources']),
    /**
       * Map layout methods for the theme
       */
    ...mapMutations(['setLayoutNeeded', 'setIsLoginPage']),
    closeDrawer () {
      this.$refs.leftDrawer.close()
    },
    getForms () {
      this.getResources({
        appName: this.$store.state.authStore.appName
      })
    },
    handleLogout () {
      this.$eventHub.$emit('openLeftDrawer')
      this.$store.dispatch('clearAuthUser')
      Auth.logOut()
      this.setLayoutNeeded(false)
      this.setIsLoginPage(true)
    }
  }
}
</script>
<style>
</style>
