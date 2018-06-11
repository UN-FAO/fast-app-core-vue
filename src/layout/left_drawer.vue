<template>
  <q-scroll-area style="width: 100%; height: 100%">
    <q-list-header class="" style="padding-left: 0px; height: 50px;">
      <center>

      </center>
    </q-list-header>
    <q-list>

      <q-item-separator inset />

    </q-list>

    <q-side-link item :to="{name: 'dashboard', exact: true}" >
      <q-item-side icon="pin_drop"/>
      <q-item-main :label="$t('Home')" />
    </q-side-link>
    <q-item-separator />

    <q-item  style="cursor:pointer" @click="syncApp()" >
        <q-tooltip anchor="center right" self="center left" :offset="[10, 0]">
          <strong>{{ $t("Sync app") }}</strong>
        </q-tooltip>
      <q-item-side icon="cloud_download" left/>
      <q-item-main :label="$t('Sync Application')" />
    </q-item>
     <q-item-separator  />


      <pageLinks :pages="PAGES"></pageLinks>

    <q-side-link v-if="hasRole(['Reviewer'])" multiline highlight item :to="{path: '/settings/alldata'}" key="settings">
      <q-item-side icon="fa-cog" />
      <q-item-main :label="$t('Review Data')"/>
    </q-side-link>


    <q-side-link v-if="hasRole(['Administrator'])" multiline highlight item :to="{path: '/settings/alldata'}" key="settings">
      <q-item-side icon="fa-cog" />
      <q-item-main :label="$t('Application Settings')"/>
    </q-side-link>


    <q-side-link multiline highlight item :to="{name: 'About'}" key="about" v-if="$FAST_CONFIG.HAS_ABOUT">
      <q-item-side icon="tablet_mac" />
      <q-item-main :label="$t('About') +' '+ $FAST_CONFIG.APP_FANTACY_NAME" />
    </q-side-link>

    <q-item-separator />

    <q-item @click="handleLogout" style="cursor: pointer">
      <q-item-side icon="ion-log-out" color="red"/>
      <q-item-main :label="$t('Logout')" />
    </q-item>


    <div class="light text-italic" style="padding-left: 25px;">
      {{email()}}
    </div>
    <p>

    <div class="fixed-bottom text-left light text-italic" style="padding-left: 65px;">
      v {{$FAST_CONFIG.FAST_VERSION}}
    </div>
  </q-scroll-area>
</template>
<script>
import { Auth, FAST, PagesRepo } from 'fast-fastjs';
import {
  QScrollArea,
  QSideLink,
  QItemTile,
  QItemSide,
  QItemMain,
  QListHeader,
  QCollapsible,
  QBtn,
  QIcon,
  QTooltip,
  QList,
  QItem,
  QItemSeparator
} from 'quasar';
import pageLinks from './components/pageLinks';
import _sortBy from 'lodash/sortBy';
export default {
  components: {
    QScrollArea,
    QSideLink,
    QItemTile,
    QItemSide,
    QItemMain,
    QListHeader,
    QCollapsible,
    QBtn,
    QIcon,
    QTooltip,
    QList,
    QItem,
    QItemSeparator,
    pageLinks
  },
  asyncData: {
    PAGES: {
      get() {
        return PagesRepo.getLocal();
      },
      transform(result) {
        return _sortBy(result.pages, 'index');
      }
    }
  },
  methods: {
    closeDrawer() {
      this.$refs.leftDrawer.close();
    },
    async syncApp() {
      this.$eventHub.$emit('openLeftDrawer');
      this.$swal({
        title: this.$t('Updating...'),
        text: this.$t(
          'Wait until the App is Updated. This can take a couple minutes...'
        ),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          await FAST.sync({ interval: false, appConf: this.$appConf });
          this.$swal.close();
          this.$swal({
            title: this.$t('App Updated'),
            text: this.$t(
              'You need to reload the page to see the changes. Want to do it now?'
            ),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonClass: 'modalCancel',
            confirmButtonText: this.$t('Yes, reaload it!'),
            cancelButtonText: this.$t('No, Later')
          }).then(async () => {
            window.location.reload(true);
          });
        }
      });
    },
    async handleLogout() {
      this.$eventHub.$emit('openLeftDrawer');
      await Auth.logOut();
      this.$router.push({
        path: '/login'
      });
    },
    hasRole(roles) {
      return roles.some((role) => {
        return Auth.hasRole(role);
      });
    },
    email() {
      return Auth.email();
    }
  }
};
</script>
