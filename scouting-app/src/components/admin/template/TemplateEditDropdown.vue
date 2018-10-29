<template>
  <div>
    <div class="line"></div>
    <div class="background-box content-centered">
      <h3>Edit Dropdown Field</h3>
    </div>

    <div class="field-edit">
      <p>Title</p>
      <input type="text" placeholder="Title" v-model="title">

      <p>JSON Field Name</p>
      <input type="text" placeholder="Field Name" v-model="field">
    </div>

    <div class="background-box content-centered">
      <p>Add new dropdown</p>
    </div>

    <div class="field-edit">
      <input type="text" placeholder="Downdown Name">
      <input type="number" placeholder="Downdown Points">
    </div>

    <div class="background-box background-box-hover content-centered">
      <p>Create</p>
    </div>

    <p>TODO: Add list of dropdown items using field-edit to have the 2 side grid with remove option</p>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  name: "TemplateEditDropdown",
  props: {
    type: String,
    title: String
  }
};
</script>