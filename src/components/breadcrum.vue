<template>
      <div class="appBreadcrumb">
       <span
                style="color: #0574a9;cursor:pointer"
                @click="$router.push({name: 'dashboard', exact: true})"
                class="appBreadcrumb"
              >
              {{
                $t('Home')
              }}
              </span>

                <span
                style="color: #0574a9;cursor:pointer"
                @click="breadCrumClick"
                 class="appBreadcrumb"
                >
                {{ breadCrumTitle }}
                </span>

                <span
                  style="color: #0574a9;cursor:pointer"
                   class="appBreadcrumb"
                >
                  {{ ' /' }} <span @click="backToShow" v-if="isSubmission">{{isSubmission ? currentPageTitle: ''}}</span>
                </span>
                <span style="color:#b5bbbd">
                {{!isSubmission ? currentPageTitle : '' }} {{isSubmission ? "/" + this.$t('SUBMISSION'): ''}}
                </span>
    </div>
</template>
<script>
export default {
  name: 'breadcrum',
  props: {
    parent: {
      required: true
    },
    currentPageTitle: {
      required: false
    },
    isSubmission: {
      required: false
    }
  },
  watch: {
    parent: function(data) {},
    currentPageTitle: function(data) {},
    isSubmission: function(data) {}
  },
  computed: {
    breadCrumTitle() {
      let title =
        this.parent && JSON.parse(atob(this.parent)).title !== undefined
          ? '/ ' + JSON.parse(window.atob(this.parent)).title
          : '';
      return title;
    }
  },
  methods: {
    backToShow() {
      let to =
        '/forms/' +
        this.$route.params.idForm +
        '?parent=' +
        this.$route.query.parent
      this.$router.push(to);
    },
    breadCrumClick() {
      this.$router.push({
        name: 'pageManager',
        params: { pageId: JSON.parse(window.atob(this.parent)).url }
      });
    }
  }
};
</script>
