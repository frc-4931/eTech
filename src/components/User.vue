<template>
  <div class="background-box content-centered">
    <div>
      <p>{{ userdata.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "User",
  props: {
    userdata: Object
  }
};
</script>

<style>
</style>
