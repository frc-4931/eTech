<template>
  <div class="background-box grid-perminant">
    <div class="location-left">
      <p>{{data.type}}</p>
    </div>
    <div class="location-right">
      <p>{{data.title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TemplateField",
  props: {
    data: Object
  },
  data: function() {
    return {
      //data: [{ type: "BooleanField", title: "Blocks (Allience Scale):" }]
    };
  }
};
</script>