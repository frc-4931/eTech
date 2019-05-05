<template>
  <div>
    <div class="line"></div>

    <Error v-if="isError">All Fields Are Required!</Error>
    <div v-else class="background-box content-centered">
      <h3>Edit Number Incremential Field</h3>
    </div>

    <div class="field-edit small-margin">
      <p class="background-box">Title</p>
      <div class="background-box-input">
        <input type="text" placeholder="Title" v-model.trim="data.title" />
      </div>

      <p class="background-box">Default Value</p>
      <div class="background-box-input">
        <input
          type="number"
          placeholder="Default Number"
          v-model.number="data.default"
        />
      </div>

      <p class="background-box">Points Per Value</p>
      <div class="background-box-input">
        <input
          type="number"
          placeholder="Points Per 1 Entered"
          v-model.number="data.points"
        />
      </div>

      <p class="background-box">Minimum</p>
      <div class="background-box-input">
        <input type="number" placeholder="Minimum" v-model.number="data.min" />
      </div>
    </div>
    <div class="grid-perminant content-centered small-margin">
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

    <div class="line" />
  </div>
</template>

<script>
import Error from "@/components/Error.vue";

export default {
  name: "TemplateEditNumberInc",
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
      if (this.allOptionsValid()) {
        this.isError = false;
        this.$emit("save", this.data);
      } else {
        this.isError = true;
      }

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
    },
    allOptionsValid() {
      if (
        this.data.default === "" ||
        this.data.points === "" ||
        this.data.min === "" ||
        this.data.title == "" ||
        this.data.field == ""
      ) {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {
    Object.assign(this.data, this.indata);
  }
};
</script>