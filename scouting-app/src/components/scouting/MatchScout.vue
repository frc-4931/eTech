<template>
<div>
  <!-- Title Field -->
  <TitleField title="Autonomous"></TitleField>

  <!-- Drop Down Field -->
  <DropdownField title="Dropdowns yay!!!" :options="options" value="Option 2"></DropdownField>

  <!-- Booleon Field -->
  <BooleanField title="Bools yay" :value="true"></BooleanField>

  <!-- Number field -->
  <NumberField title="New num" :value="5" @valuechange="valueChangeNum"></NumberField>

  <!-- Number field inc -->
  <NumberFieldInc title="How many blocks?" :min="0" :max="10" :value="value" @valuechange="valueChange" ></NumberFieldInc>

  <!-- Second panel -->
  <TitleField title="TeleOp"></TitleField>
  <DropdownField title="Dropdowns yay!!!" :options="options" value="Option 2"></DropdownField>
  <BooleanField title="Bools yay" :value="true"></BooleanField>
  <NumberField title="New num" :value="5" @valuechange="valueChangeNum"></NumberField>
  <NumberFieldInc title="How many blocks?" :min="0" :max="10" :value="value" @valuechange="valueChange" ></NumberFieldInc>

  <div class="location-centered-small background-box background-box-hover content-centered">
    <h3>Save</h3>
  </div>
  <div class="line"></div>
</div>
</template>

<script>
export default {};
</script>

<style>
</style>
