<template>
  <div>
    <div class="line"></div>

    <Error v-if="isError">All Fields Are Required!</Error>
    <h3 v-else class="background-box content-centered">Edit Title Field</h3>

    <div class="field-edit small-margin">
      <p class="background-box">Title</p>
      <div class="background-box-input">
        <input type="text" placeholder="Title" v-model.trim="data.title" />
      </div>
    </div>

    <div class="grid-perminant content-centered small-margin">
      <p
        @click="deleteField()"
        class="location-left-small background-box background-box-hover"
      >
        Delete
      </p>

      <p
        @click="moveUp()"
        class="location-centered-small background-box background-box-hover"
      >
        Move Up
      </p>

      <p
        @click="moveDown()"
        class="location-right-small background-box background-box-hover"
      >
        Move Down
      </p>
    </div>

    <div class="grid-perminant content-centered small-margin">
      <p
        @click="save()"
        class="background-box background-box-hover location-span"
      >
        Save
      </p>

      <p
        @click="close()"
        class="background-box background-box-hover location-span"
      >
        Cancel
      </p>
    </div>

    <div class="line"></div>
  </div>
</template>

<script>
import Error from "@/components/Error.vue";

export default {
  name: "TemplateEditTitle",
  components: { Error },
  props: {
    indata: Object
  },
  data: function() {
    return {
      data: {},
      isError: false
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save", this.data);
      this.close();
    },
    moveUp() {
      this.$emit("move-up");
    },
    moveDown() {
      this.$emit("move-down");
    },
    deleteField() {
      this.$emit("delete");
    }
  },
  created() {
    Object.assign(this.data, this.indata);
  }
};
</script>