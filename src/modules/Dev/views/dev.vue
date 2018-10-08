<template>
  <div></div>
</template>
<script>
import Converter from 'fast-component2excel';
import Axios from 'axios';



export default {
  async created() {
    await this.download()
  },
  methods: {
    async download() {
      const url = 'https://ixjjftxezpoomka.form.io/a';
      let json = await Axios.get(url).data;
      await Converter.convertJsonToFile(json);
    }
  }
}

</script>

