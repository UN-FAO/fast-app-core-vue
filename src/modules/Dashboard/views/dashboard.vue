<style lang='css'>
  .desc {
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .pl {
    padding-left: 20px;
  }
</style>

<template>
<div class="layout-padding">
<router-link :to="{ name: '' }">

<div class="card" max-width="10%" style="">
  
  <div class="card-title bg-primary text-white">
    Data Collection Dashboard
  </div>
  <div class="card-content card-force-top-padding">  
  </div>
</div>
</router-link>






</div>
</template>


<script>
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)

export default {

}
</script>
