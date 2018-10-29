<template>
  <div>
    <div class="line"></div>
    <div class="background-box content-centered">
      <h3>Edit Boolean Field</h3>
    </div>

    <div class="field-edit">
      <p>Title</p>
      <input type="text" placeholder="Title" v-model="title">

      <p>JSON Field Name</p>
      <input type="text" placeholder="Field Name" v-model="field">

      <p>Default value</p>
      <select>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>

      <p>Points awarded if true</p>
      <input type="number" placeholder="True Points" v-model-number="tPoints">

      <p>Points awarded if false</p>
      <input type="number" placeholder="False Points" v-model-number="fPoints">
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  name: "TemplateEditBoolean",
  props: {
    type: String,
    title: String
  }
};
</script>