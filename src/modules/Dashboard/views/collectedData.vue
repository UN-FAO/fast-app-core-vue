<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" v-bind:key="$route.path" style="padding-bottom:50px" >
    <div class="section-title pageTitle">
      Collected data
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
        return result
      },
      transform(result) {
        return result;
      }
    }
  }
};
</script>
