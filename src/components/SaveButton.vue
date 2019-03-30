<template>
  <div
    class="background-box content-centered"
    v-bind:class="unsavedChanges ? 'background-box-hover' : 'background-box-disabled'"
    @click="onClick()"
  >
    <h3 v-show="unsavedChanges">Save changes</h3>
    <h3 v-show="!unsavedChanges">Save</h3>
  </div>
</template>

<script>
export default {
  name: "SaveButton",
  props: {
    unsavedChanges: Boolean,
    saveCallback: Function
  },
  methods: {
    onClick: function() {
      if (this.unsavedChanges) this.saveCallback();
    }
  }
};
</script>