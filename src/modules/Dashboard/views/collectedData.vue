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
import { Form } from 'fast-fastjs';
export default {
  components: {
    actioncards
  },
  asyncData: {
    newForms: {
      async get() {
        let action = this.$route.name === 'CollectedData' ? 'list' : 'create'
        let result = await Form.local().cardFormattedForms(action);
        if (result.cards.length === 1) {
          this.redirectTo(result.cards[0].actions[0], 'submission');
        }
        return result;
      },
      transform(result) {
        return result;
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
        let to = {
          name: name,
          params: { idForm: action.formPath }
        };
        this.$router.push(to);
      }
    }
  },
  data () {
    return {
      pageName: this.$route.name === 'CollectedData' ? 'Collected Data' : 'New Survey'
    }
  }
};
</script>
