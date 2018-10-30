<template>
  <div v-if="data.type == 'TitleField'" @click="clicked()" style="margin-top: 20px" class="background-box background-box-hover content-centered">
    <div>
      <h2>{{data.title}}</h2>
    </div>
  </div>

  <div v-else @click="clicked()" class="background-box background-box-hover grid-perminant">
    <div class="location-left">
      <p>{{data.title}}</p>
    </div>
    <div class="location-right ">
      <p>{{data.type.replace("Field", (""))}}</p>
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
  },
  methods: {
    clicked() {
      this.$emit("clicked");
    }
  },
  created() {}
};
</script>