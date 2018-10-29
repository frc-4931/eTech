<template>
  <div>
    <div class="line"></div>
    <div class="background-box content-centered">
      <h3>Edit Dropdown Field</h3>
    </div>

    <div class="field-edit">
      <p class="background-box">Title</p>
      <div class="background-box-input">
        <input type="text" placeholder="Title" v-model="title">
      </div>
      <p class="background-box">JSON Field Name</p>
      <div class="background-box-input">
        <input type="text" placeholder="Field Name" v-model="field">
      </div>
    </div>
    <div class="background-box content-centered">
      <p>Add New Dropdown</p>
    </div>

    <div class="field-edit">
      <div class="background-box-input">
        <input type="text" placeholder="Downdown Name">
      </div>
      <div class="background-box-input">
        <input type="number" placeholder="Downdown Points">
      </div>
    </div>

    <div class="background-box background-box-hover content-centered">
      <p>Create</p>
    </div>

    <p>TODO: Add list of dropdown items using field-edit to have the 2 side grid with remove option</p>

    <div class="grid-perminant content-centered">
      <div class="location-span background-box background-box-hover">
        <p>Save</p>
      </div>
      <div class="location-left-small background-box background-box-hover">
        <p>Delete</p>
      </div>
      <div class="location-centered-small background-box background-box-hover">
        <p>Move Up</p>
      </div>
      <div class="location-right-small background-box background-box-hover">
        <p>Move Down</p>
      </div>
    </div>

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