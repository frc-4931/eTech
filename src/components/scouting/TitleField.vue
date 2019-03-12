<template>
  <div class="pit-scout-div">
    <div
      style="margin-top: 20px; margin-bottom: 5px;"
      class="background-box content-centered"
    >
      <h2>{{ data.title }}</h2>
    </div>
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