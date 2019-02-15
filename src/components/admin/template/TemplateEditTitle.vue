<template>
  <div>
    <div class="line"></div>

    <Error v-if="isError">All Fields Are Required!</Error>
    <div
      v-else
      class="background-box content-centered"
    >
      <h3>Edit Title Field</h3>
    </div>

    <div class="field-edit">
      <p class="background-box">Title</p>
      <div class="background-box-input">
        <input
          type="text"
          placeholder="Title"
          v-model.trim="data.title"
        >
      </div>

    </div>

    <div class="grid-perminant content-centered">
      <div
        @click="deleteField()"
        class="location-left-small background-box background-box-hover"
      >
        <p>Delete</p>
      </div>
      <div
        @click="moveUp()"
        class="location-centered-small background-box background-box-hover"
      >
        <p>Move Up</p>
      </div>
      <div
        @click="moveDown()"
        class="location-right-small background-box background-box-hover"
      >
        <p>Move Down</p>
      </div>

      <div class="location-span">
        <div
          @click="save()"
          class="background-box background-box-hover"
        >
          <p>Save</p>
        </div>
        <div
          @click="close()"
          class="background-box background-box-hover"
        >
          <p>Cancel</p>
        </div>
      </div>

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