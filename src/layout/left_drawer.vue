<template>
<q-scroll-area style="width: 100%; height: 100%">
      <q-list-header class="bg-primary text-white">
      <center>
      <img src="statics/2000px-FAO_logo_reverse.png" style="max-height: 40px; max-width: 40px;"></img>
      FAO
      </center>
      </q-list-header>
      <q-list>

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
          :to="{name: 'newSurvey'}"
          :key="newSurvey">
          <q-item-side icon="fa-plus-square-o" />
          <q-item-main label="Start a new Module" />
        </q-side-link>


        <q-side-link multiline highlight separator item
          :to="{name: 'formio_form_show', params: { idForm: '*'}}"
          :key="Data">
          <q-item-side icon="fa-database" />
          <q-item-main label="Collected Data"  />
        </q-side-link>

         <q-side-link multiline highlight separator item
          :to="{name: 'b', params: { idForm: 'idform'}}"
          :key="Setting">
          <q-item-side icon="fa-cog" />
          <q-item-main label="Application Settings"  />
        </q-side-link>


         <q-side-link multiline highlight separator item
          :to="{name: 'c', params: { idForm: 'idform'}}"
          :key="about">
          <q-item-side icon="fa-mobile" />
          <q-item-main label="About PAT"  />
        </q-side-link>


         <q-side-link multiline highlight separator item
          :to="{name: 'd', params: { idForm: 'idform'}}"
          :key="lenguage">
          <q-item-side icon="language" />
          <q-item-main label="Language Settings"  />
        </q-side-link>

        <q-item-separator />
        <!--
         <q-side-link multiline highlight separator item
          :to="{name: 'e', params: { idForm: 'idform'}}"
          :key="mysurvey">
          <q-item-side icon="fa-list" />
          <q-item-main label="My Survey"  />
        </q-side-link>
        
        <q-side-link multiline highlight separator item
          :to="{name: 'f', params: { idForm: 'idform'}}"
          :key="mysummary">
          <q-item-side icon="fa-line-chart" />
          <q-item-main label="My Summary"  />
        </q-side-link>
   
        <q-side-link multiline highlight separator item
          :to="{name: 'g', params: { idForm: 'idform'}}"
          :key="editprofile">
          <q-item-side icon="fa-pencil" />
          <q-item-main label="Edit your profile"  />
        </q-side-link>
          -->
        <q-item @click="handleLogout" style="cursor: pointer">
          <q-item-side icon="ion-log-out" />
          <q-item-main label="Logout"  />
        </q-item>

        <div class="fixed-bottom text-center light text-italic">
          v.0.1.0
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
