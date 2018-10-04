<template>
  <div></div>
</template>
<script>
import Converter from 'fast-component2excel';
import Axios from 'axios';

const url = 'https://ixjjftxezpoomka.form.io/a';
Axios.get(url).then(response => {
  const json = response.data;
  Converter.convertJsonToFile(json, null);
});

</script>

