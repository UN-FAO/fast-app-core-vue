<template>
  <div
    class="container-fluid col-lg-offset-1 col-lg-10"
    v-bind:key="$route.path"
    style="padding-bottom:50px"
  >
    <div class="section-title pageTitle">{{$t(pageName)}}</div>
    <hr style="border-top: 1px solid lightgray;">
    <actioncards :page="newForms" v-bind:key="$route.path"></actioncards>
  </div>
</template>
<style>
</style>

<script>
import actioncards from "../../Pagemanager/components/actionCards";
import { Form, Auth } from "fast-fastjs";
import createSubmission from "components/createSubmission";

export default {
  components: {
    actioncards
  },
  asyncData: {
    newForms: {
      async get() {
        let action = this.$route.name === "CollectedData" ? "list" : "create";
        let result = await Form.cardFormattedForms(action);
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
      if (action.path) {
        let name =
          action.view === "list"
            ? "formio_form_show"
            : "formio_form_submission";
        if (name === "formio_form_submission") {
          this.goToCreateView(action.path);
        } else {
          let to = {
            name: name,
            params: { idForm: action.path }
          };
          this.$router.push(to);
        }
      }
    },
    // TODO Function is duplicated on the SHOW view, we must
    // refactor this
    async goToCreateView(formPath) {
      const route = await createSubmission.withData({
        email: Auth.email(),
        appUrl: this.$FAST_CONFIG.APP_URL,
        path: formPath,
        parent: this.$route.query.parent,
        data: {}
      });

      this.$router.push(route);
    }
  },
  data() {
    return {
      pageName:
        this.$route.name === "CollectedData" ? "Collected Data" : "New Survey"
    };
  }
};
</script>
