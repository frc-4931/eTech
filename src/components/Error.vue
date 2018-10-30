<template>
  <div class="error background-box content-centered">
    <h2>Error</h2>
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: "Error"
};
</script>