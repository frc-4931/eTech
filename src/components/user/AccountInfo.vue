<template>
  <div class="grid-perminant">
    <p class="background-box location-span">
      Hey {{ user.username != null ? user.username : "ERROR" }}
    </p>
  </div>
</template>

<script>
export default {
  name: "AccountInfo",
  props: { user: Object }
};
</script>