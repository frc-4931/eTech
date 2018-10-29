<template>
  <div class="grid template-item content-centered">
    <h3 class="background-box location-centered-small template-title">Boolean Field</h3>

    <div class="background-box background-box-hover template-options">
      <p>Options</p>
    </div>

    <div class="background-box location-left-tiny">
      <p>Title</p>
      <input type="text" placeholder="Title" v-model="title">
    </div>

    <div class="background-box">
      <p>JSON Field Title</p>
      <input type="text" placeholder="JSON Field" v-model="field">
    </div>

    <div class="background-box grid-perminant">
      <p>Default Value</p>
      <label class="location-left">
        <input class="radio-button" type="radio" name="radio1">
        True
      </label>

      <label class="location-right">
        <input class="radio-button" type="radio" name="radio1">
        False
      </label>
    </div>

    <div class="background-box">
      <p>True Points</p>
      <input type="number" placeholder="True Points" v-model.number="tPoints">
    </div>

    <div class="background-box">
      <p>False Points</p>
      <input type="number" placeholder="False Points" v-model.number="fPoints">
    </div>
  </div>
</template>

<script>
export default {
  name: "TemplateBooleanField",
  data: function() {
    return {
      title: "",
      field: "",
      tPoints: 1,
      fPoints: 0
    };
  }
};
</script>