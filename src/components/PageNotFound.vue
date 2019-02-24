<template>
  <div class="grid content-centered">
    <h1 class="location-span background-box">404 Error - Page not found</h1>
    <div class="background-box location-centered-small">
      <p>The page you're trying to view does not exist.</p>
      <router-link :to="{name: 'home'}">Click here to go to home.</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "PageNotFound"
};
</script>