<template>
  <div class="background-box grid-perminant">
    <div class="location-left">
      <p>{{this.data.type}}</p>
    </div>
    <div class="location-right">
      <p>{{data.title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TemplateField",
  data: function() {
    return {
      data: [{ type: "BooleanField", title: "Blocks (Allience Scale):" }]
    };
  }
};
</script>