<template>
 <div class="container-fluid col-lg-offset-1 col-lg-10" >
    <div class="section-title" style="font-size: 30px;padding-top:30px">
      Welcome
    </div>
    <hr style="border-top: 1px solid #7f7f7f;">
     <div>

    <div class="row" style="margin-top:30px;" v-if="hasRole(['Administrator'])">
      <div>
      <span style="margin-left:50px">As administrator, you are allowed to:</span>
      </div>
      <br>
      <ul>
        <li>
          <router-link :to='{name: "formio_form_show",params: { idForm: "user" }}'>Manage users</router-link>
        </li>
        <li>
          <router-link :to='{name: "pageManager",params: { pageId: "reference-data" }}'>Manage Reference data</router-link>
        </li>
        <li>
          <router-link :to='{name: "pageManager",params: { pageId: "registries" }}'>Manage registries</router-link>
        </li>
        <li>
          <router-link :to='{name: "formio_form_show",params: { idForm: "script" }}'>Manage statistical indicators</router-link>
        </li>
      </ul>
    </div>

  </div>
  </div>
</template>
<script>
import { Auth } from 'fast-fastjs';
export default {
  name: 'appdashboard',
  methods: {
    hasRole(roles) {
      return roles.some((role) => {
        return Auth.hasRole(role);
      });
    }
  }
};
</script>
