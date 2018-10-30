<template>
  <div style="margin-top: 20px; margin-bottom: 0px;" class="background-box content-centered">
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