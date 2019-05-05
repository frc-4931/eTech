<template>
  <div>
    <div class="line"></div>

    <Error v-if="isError">All Fields Are Required!</Error>
    <div v-else class="background-box content-centered">
      <h3>Edit Dropdown Field</h3>
    </div>

    <div class="field-edit small-margin">
      <p class="background-box">Title</p>
      <div class="background-box-input">
        <input type="text" placeholder="Title" v-model.trim="data.title" />
      </div>

      <p class="background-box">Default Value</p>
      <div class="background-box-input">
        <select v-model="data.default">
          <option v-for="option in options" :key="option" :value="option">{{
            option
          }}</option>
        </select>
      </div>
    </div>

    <p class="background-box content-centered field-title">
      Add Dropdown Option
    </p>

    <div class="field-edit small-margin">
      <p class="background-box">Option Name</p>
      <div class="background-box-input">
        <input
          type="text"
          v-model.trim="currentOptionName"
          placeholder="Option Name"
        />
      </div>
      <p class="background-box">Option Points</p>
      <div class="background-box-input">
        <input
          type="number"
          v-model.number="currentPoints"
          placeholder="Option Points"
        />
      </div>
    </div>

    <p
      @click="addOption()"
      class="background-box background-box-hover content-centered field-add"
    >
      Add
    </p>

    <div class="background-box content-centered field-title">
      <p>Dropdown Options</p>
    </div>

    <div class="small-margin">
      <div
        v-for="(option, index) in options"
        :key="option"
        class="dropdown-options small-margin-sub"
      >
        <div class="background-box-input">
          <input
            type="text"
            v-model.trim="options[index]"
            placeholder="Option Name"
          />
        </div>

        <div class="background-box-input">
          <input
            type="number"
            v-model.number="points[index]"
            placeholder="Option Points"
          />
        </div>

        <p
          @click="deleteOption(index)"
          class="background-box background-box-hover content-centered"
        >
          Delete
        </p>
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
      if (this.currentPoints === "" || this.currentOptionName === "") return;

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

<style>
.field-title {
  margin-top: 10px;
  margin-bottom: 0px;
}
.field-add {
  margin-top: 0px;
  margin-bottom: 20px;
}
.dropdown-options {
  display: grid;
  grid-template-columns: 2fr repeat(2, 1fr);
}
</style>
