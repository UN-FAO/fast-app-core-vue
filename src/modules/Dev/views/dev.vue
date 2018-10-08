<template>
  <div></div>
</template>
<script>
import Converter from 'fast-component2excel';
import Axios from 'axios';

export default {
  async created() {
    console.log('created');
    const json = await this.download();
    await Converter.convertJsonToFile(json);
  },
  methods: {
    async download() {
      console.log('download');
      const url = 'https://ixjjftxezpoomka.form.io/a';
      let json = await Axios.get(url);
      return json.data;
    }
  }
}

</script>

