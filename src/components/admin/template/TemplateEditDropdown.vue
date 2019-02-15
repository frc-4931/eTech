<template>
  <div>
    <div class="line"></div>

    <Error v-if="isError">All Fields Are Required!</Error>
    <div
      v-else
      class="background-box content-centered"
    >
      <h3>Edit Dropdown Field</h3>
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

      <p class="background-box">Default Value</p>
      <div class="background-box-input">
        <select v-model="data.default">
          <option
            v-for="option in options"
            :key="option"
            :value="option"
          >{{option}}</option>
        </select>
      </div>
    </div>

    <div class="background-box content-centered">
      <p>Add Dropdown Option</p>
    </div>

    <div class="field-edit">
      <div class="background-box-input">
        <input
          type="text"
          v-model.trim="currentOptionName"
          placeholder="Option Name"
        >
      </div>
      <div class="background-box-input">
        <input
          type="number"
          v-model.number="currentPoints"
          placeholder="Option Points"
        >
      </div>
    </div>

    <div
      @click="addOption()"
      style="margin-top: 0px; margin-bottom: 20px;"
      class="background-box background-box-hover content-centered"
    >
      <p>Add</p>
    </div>

    <div class="background-box content-centered">
      <p>Dropdown Options</p>
    </div>

    <div
      v-for="(option, index) in options"
      :key="option"
      class="field-edit"
    >
      <div class="background-box-input">
        <input
          type="text"
          v-model.trim="options[index]"
          placeholder="Option Name"
        >
      </div>

      <div class="field-edit">
        <div class="background-box-input">
          <input
            type="number"
            min="-999"
            v-model.number="points[index]"
            placeholder="Option Points"
          >
        </div>
        <div
          @click="deleteOption(index)"
          class="background-box background-box-hover content-centered"
        >
          <p>Delete</p>
        </div>
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
  name: "TemplateEditDropdown",
  components: { Error },
  props: {
    indata: Object
  },
  data: function() {
    return {
      data: {},
      options: [],
      points: [],
      currentPoints: "",
      currentOptionName: "",
      isError: false
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      if (this.allOptionsValid()) {
        this.data.options = this.options;
        this.data.points = this.points;
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
        this.data.default == "" ||
        this.options.length < 1 ||
        this.points.length < 1 ||
        this.data.title == "" ||
        this.data.field == ""
      ) {
        return false;
      } else {
        for (var i of this.options) {
          if (i == "") return false;
        }
        for (var j of this.points) {
          if (j === "") return false;
        }
        return true;
      }
    },
    addOption() {
      if (this.currentPoints == "" || this.currentOptionName === "") return;

      this.options.push(this.currentOptionName);
      this.points.push(this.currentPoints);
      this.currentPoints = "";
      this.currentOptionName = "";

      if (this.options.indexOf(this.data.default) === -1) {
        this.data.default = this.options[0];
      }
    },
    deleteOption(index) {
      this.options.splice(index, 1);
      this.points.splice(index, 1);

      if (this.options.indexOf(this.data.default) === -1) {
        this.data.default = this.options[0];
      }
    }
  },
  created() {
    Object.assign(this.data, this.indata);
    this.options = this.data.options.slice();
    this.points = this.data.points.slice();
  }
};
</script>