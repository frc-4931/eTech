<template>
  <div id="menu-template-editor">
    <div class="grid">
      <div class="location-centered">
        <TemplateBooleanField></TemplateBooleanField>
        <TemplateTitleField></TemplateTitleField>
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
  }
};
</script>

<style>
.template-item div input {
  padding: 0px 5px;
}
</style>
