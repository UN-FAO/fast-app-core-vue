<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" v-bind:key="$route.path" style="padding-bottom:50px" >
    <div class="section-title pageTitle">
      {{$t('Collected data')}}
    </div>
    <hr style="border-top: 1px solid lightgray;">

    <actioncards :page="newForms" v-bind:key="$route.path"></actioncards>

  </div>

</template>
<style>

</style>

<script>
import actioncards from "../components/actionCards";
import Form from "libraries/fastjs/database/models/Form";
export default {
  components: {
    actioncards
  },
   asyncData: {
    newForms: {
      async get() {
        let result = await Form.local().cardFormattedForms('list');
         if (result.innerCards.length === 1) {
          this.redirectTo(result.innerCards[0].innerCardsActions[0], "submission");
        }
        return result
      },
      transform(result) {
        return result;
      }
    }
  },
  methods: {
    redirectTo(action) {
      if (action.innerCardsActionsForm) {
        let name =
          action.innerCardsActionsAction === "list"
            ? "formio_form_show"
            : "formio_form_submission";
        let to = {
          name: name,
          params: { idForm: action.innerCardsActionsForm.path }
        };
        this.$router.push(to);
      }
    }
  }
};
</script>
