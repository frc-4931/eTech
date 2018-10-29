<template>
  <div id="menu-template-editor">
    <div class="grid">
      <div class="location-left-tiny background-box background-box-hover content-centered" @click="pages.toMenuAdmin()">
        <h3>Back</h3>
      </div>

      <div class="location-centered background-box content-centered">
        <h2>Template Editor</h2>
      </div>

      <div class="location-centered-small content-centered">
        <div class="background-box">
          <h3>Select Template to Edit:</h3>
        </div>

        <div class="background-box">
          <select id="select-template">
            <option value="pit">Pitscout</option>
            <option value="match">Match Scout</option>
          </select>
        </div>
      </div>

      <div class="location-centered-small background-box background-box-hover content-centered">
        <h3>Create new field</h3>
      </div>

      <div class="location-centered-small">
        <div class="grid-perminant background-box">
          <div class="location-left">
            <h3>Type:</h3>
          </div>
          <div class="location-right">
            <h3>Name:</h3>
          </div>
        </div>

        <p>TODO: List of TemplateFields</p>

        <TemplateEditBoolean></TemplateEditBoolean>
        <TemplateEditNumber></TemplateEditNumber>
        <TemplateEditNumberInc></TemplateEditNumberInc>
        <TemplateEditDropdown></TemplateEditDropdown>
      </div>
    </div>
  </div>
</template>

<script>
import TemplateField from "./admin/template/TemplateField.vue";

import TemplateEditBoolean from "./admin/template/TemplateEditBoolean.vue";
import TemplateEditDropdown from "./admin/template/TemplateEditDropdown.vue";
import TemplateEditNumber from "./admin/template/TemplateEditNumber.vue";
import TemplateEditNumberInc from "./admin/template/TemplateEditNumberInc.vue";

export default {
  name: "MenuTemplateEditor",
  props: {
    pages: Object
  },
  components: {
    TemplateField,
    TemplateEditBoolean,
    TemplateEditDropdown,
    TemplateEditNumber,
    TemplateEditNumberInc
  },
  data: function() {
    return {
      fields: [
        {
          type: "BooleanField",
          title: "Cross Center Line:",
          field: "auto_centerline",
          default: false,
          points: [3, 0]
        }
      ]
    };
  }
};
</script>

<style>
.field-edit {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.field-edit > * {
  background-color: #37474f;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.6);
  padding: 10px;
  margin: 5px 10px;
  width: auto;
}
</style>
