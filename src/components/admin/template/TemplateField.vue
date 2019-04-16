<template>
  <h2
    v-if="data.type == 'TitleField'"
    @click="clicked()"
    class="background-box background-box-hover content-centered"
    style="margin-top: 20px;"
  >
    {{ data.title }}
  </h2>

  <div
    v-else
    @click="clicked()"
    class="background-box background-box-hover grid-perminant"
  >
    <p class="location-left">{{ data.title }}</p>
    <p class="location-right content-right">
      {{ data.type.replace("Field", "") }}
    </p>
  </div>
</template>

<script>
export default {
  name: "TemplateField",
  props: {
    data: Object
  },
  methods: {
    clicked() {
      this.$emit("clicked");
    }
  }
};
</script>