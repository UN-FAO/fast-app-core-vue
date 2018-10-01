<template>
  <div></div>
</template>
<script>
import Converter from 'fast-component2excel';
import form from '../form.json';

Converter.convertJsonToFile(form, null);
</script>

