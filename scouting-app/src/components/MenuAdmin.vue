<template>
<div id="menu-admin">
  <p>Menu Admin Page</p>
</div>
</template>

<script>
export default {
  name: "MenuAdim",
  prop: {
    pages: Object
  },
  methods: {
    backButton() {
      this.pages.toMenuMain();
    }
  }
};
</script>

<style>
</style>
