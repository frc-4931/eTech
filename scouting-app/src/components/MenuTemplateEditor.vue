<template>
  <div id="menu-template-editor">
    <div class="grid">
      <div v-for="(field, idx) in fields" :key="field" class="location-centered">
        <component v-bind:is="field" :key="field + idx"></component>
      </div>
    </div>
  </div>
</template>

<script>
import TemplateBooleanField from "./admin/template/TemplateBooleanField.vue";
import TemplateTitleField from "./admin/template/TemplateTitleField.vue";

export default {
  name: "MenuTemplateEditor",
  props: {
    pages: Object
  },
  components: {
    TemplateBooleanField,
    TemplateTitleField
  },
  data: function() {
    return {
      fields: []
    };
  },
  created: function() {
    this.fields.push("TemplateBooleanField");
    this.fields.push("TemplateTitleField");
    this.fields.push("TemplateBooleanField");
  }
};
</script>

<style>
.template-item div input {
  padding: 0px 5px;
}
.template-title,
.template-options {
  margin-bottom: 0px !important;
  grid-column: 6/7;
}
</style>
