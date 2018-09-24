<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" v-bind:key="$route.path" style="padding-bottom:50px" >
    <div class="section-title pageTitle">
      {{$t(pageName)}}
    </div>
    <hr style="border-top: 1px solid lightgray;">

    <actioncards :page="newForms" v-bind:key="$route.path"></actioncards>

  </div>

</template>
<style>
</style>

<script>
import actioncards from '../../Pagemanager/components/actionCards';
import { Form, OfflinePlugin } from 'fast-fastjs';
import Formio from 'formiojs/Formio';
export default {
  components: {
    actioncards
  },
  asyncData: {
    newForms: {
      async get() {
        let action = this.$route.name === 'CollectedData' ? 'list' : 'create';
        let result = await Form.local().cardFormattedForms(action);
        if (result.cards.length === 1) {
          this.redirectTo(result.cards[0].actions[0]);
        }
        return result;
      },
      transform(result) {
        return JSON.stringify(result);
      }
    }
  },
  methods: {
    redirectTo(action) {
      if (action.formPath) {
        let name =
          action.view === 'list'
            ? 'formio_form_show'
            : 'formio_form_submission';
        if (name === 'formio_form_submission') {
          this.goToCreateView(action.formPath);
        } else {
          let to = {
            name: name,
            params: { idForm: action.formPath }
          };
          this.$router.push(to);
        }
      }
    },
    goToCreateView(formID) {
      let url = this.$FAST_CONFIG.APP_URL + '/' + formID;

      let formSubmission = {
        data: {},
        redirect: 'Update',
        draft: true,
        trigger: 'createLocalDraft'
      };
      let formio = new Formio(url);

      Formio.deregisterPlugin('offline');
      // Register the plugin for offline mode
      Formio.registerPlugin(
        OfflinePlugin.getPlugin({
          formio: formio
        }),
        'offline'
      );

      formio.saveSubmission(formSubmission).then((created) => {
        this.$router.push({
          name: 'formio_submission_update',
          params: {
            idForm: formio.formId,
            idSubmission: created._id
          },
          query: {
            parent: this.$route.query.parent
          }
        });
      });
    }
  },
  data() {
    return {
      pageName:
        this.$route.name === 'CollectedData' ? 'Collected Data' : 'New Survey'
    };
  }
};
</script>
