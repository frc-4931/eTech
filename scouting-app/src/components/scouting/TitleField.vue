<template>
  <div style="margin-top: 10px;" class="background-box content-centered">
    <h2>{{ data.title }}</h2>
  </div>
</template>

<script>
export default {
  name: "TitleField",
  props: {
    data: Object
  }
};
</script>

<style>
</style>
