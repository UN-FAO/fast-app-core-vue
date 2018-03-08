<template>
 <div class="container-fluid col-lg-offset-1 col-lg-10" >
    <div class="section-title" style="font-size: 30px;padding-top:30px">
      Welcome
    </div>
    <hr style="border-top: 1px solid #7f7f7f;">
     <div>

    <div class="row" style="margin-top:30px;">
      <div>
      <span style="margin-left:50px">As administrator, you are allowed to:</span>
      </div>
      <br>
      <ul>
        <li>
          <router-link :to='{name: "formio_form_show",params: { idForm: "userregister" }}'>Manage users</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'reference'}">Manage Reference data</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'registries'}">Manage registries</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'user', params: { userId: 123 }}">Manage validation rules</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'user', params: { userId: 123 }}">Manage statistical indicators</router-link>
        </li>
      </ul>
    </div>

  </div>
  </div>
</template>
<script>
export default {
  name: "appdashboard"
};
</script>
