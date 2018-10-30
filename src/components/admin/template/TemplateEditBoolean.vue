<template>
  <div>
    <div class="line"></div>

    <Error v-if="isError">All Fields Are Required!</Error>
    <div v-else class="background-box content-centered">
      <h3>Edit Boolean Field</h3>
    </div>

    <div class="field-edit">
      <p class="background-box">Title</p>
      <div class="background-box-input">
        <input type="text" placeholder="Title" v-model.trim="data.title">
      </div>

      <p class="background-box">Default value</p>
      <div class="background-box-input">
        <select v-model="data.default">
          <option :value="true">True</option>
          <option :value="false">False</option>
        </select>
      </div>

      <p class="background-box">Points - True</p>
      <div class="background-box-input">
        <input type="number" placeholder="True Points" v-model.number="truePoints">
      </div>

      <p class="background-box">Points - False</p>
      <div class="background-box-input">
        <input type="number" placeholder="False Points" v-model.number="falsePoints">
      </div>
    </div>

    <div class="grid-perminant content-centered">

      <div @click="deleteField()" class="location-left-small background-box background-box-hover">
        <p>Delete</p>
      </div>
      <div @click="moveUp()" class="location-centered-small background-box background-box-hover">
        <p>Move Up</p>
      </div>
      <div @click="moveDown()" class="location-right-small background-box background-box-hover">
        <p>Move Down</p>
      </div>

      <div class="location-span">
        <div @click="save()" class="background-box background-box-hover">
          <p>Save</p>
        </div>
        <div @click="close()" class="background-box background-box-hover">
          <p>Close</p>
        </div>
      </div>

    </div>

    <div class="line"></div>
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