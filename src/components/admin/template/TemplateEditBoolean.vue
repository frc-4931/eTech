<template>
  <div>
    <div class="line"></div>

    <Error v-if="isError">All Fields Are Required!</Error>
    <h3 v-else class="background-box content-centered">Edit Boolean Field</h3>

    <div class="field-edit small-margin">
      <p class="background-box">Title</p>
      <div class="background-box-input">
        <input type="text" placeholder="Title" v-model.trim="data.title" />
      </div>

      <p class="background-box">Default Value</p>
      <div class="background-box-input">
        <select v-model="data.default">
          <option :value="true">True</option>
          <option :value="false">False</option>
        </select>
      </div>

      <p class="background-box">Points - True</p>
      <div class="background-box-input">
        <input
          type="number"
          placeholder="True Points"
          v-model.number="truePoints"
        />
      </div>

      <p class="background-box">Points - False</p>
      <div class="background-box-input">
        <input
          type="number"
          placeholder="False Points"
          v-model.number="falsePoints"
        />
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

    <div class="line" />
  </div>
</template>

<script>
import Error from "@/components/Error.vue";

export default {
  name: "TemplateEditBoolean",
  components: { Error },
  props: {
    indata: Object
  },
  data: function() {
    return {
      data: {},
      truePoints: 0,
      falsePoints: 0,
      isError: false
    };
  },
  methods: {
    allOptionsValid() {
      if (
        !(this.data.default === true || this.data.default === false) ||
        this.truePoints === "" ||
        this.falsePoints === "" ||
        this.data.title == "" ||
        this.data.field == ""
      ) {
        return false;
      } else {
        return true;
      }
    },
    close() {
      this.$emit("close");
    },
    save() {
      if (this.allOptionsValid()) {
        var points = [this.truePoints, this.falsePoints];
        this.data.points = points;
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
    }
  },
  created() {
    Object.assign(this.data, this.indata);
    this.truePoints = this.data.points[0];
    this.falsePoints = this.data.points[1];
  }
};
</script>