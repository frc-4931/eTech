<template>
  <div
    v-if="isAdmin"
    id="menu-template-editor"
  >
    <div class="grid">

      <div class="mobile-view field-edit done-button-container">
        <div
          @click="goBack()"
          class="mobile-view background-box background-box-hover content-centered"
        >
          <h3>Back</h3>
        </div>

        <div
          @click="saveTemplate(curTemplate)"
          class="mobile-view field-button background-box background-box-hover content-centered"
        >
          <h3>Save</h3>
        </div>
      </div>

      <div
        @click="goBack()"
        class="desktop-view location-left-tiny background-box background-box-hover content-centered"
      >
        <h3>Back</h3>
      </div>

      <Error
        v-if="isError"
        class="mobile-none-margin-top location-centered background-box content-centered"
      >{{errorMessage}}</Error>
      <Message
        v-else-if="isMessage"
        class="mobile-none-margin-top location-centered background-box content-centered"
      >{{generalMessage}}</Message>
      <div
        v-else
        class="mobile-none-margin-top location-centered background-box content-centered"
      >
        <h2>Template Editor</h2>
      </div>

      <div
        @click="saveTemplate(curTemplate)"
        class="desktop-view location-right-tiny background-box background-box-hover content-centered"
      >
        <h3>Save</h3>
      </div>

      <div class="location-centered-small content-centered">
        <h3 class="background-box">Select Template to Edit:</h3>

        <div class="background-box-input">
          <select
            v-model="curTemplate"
            @change="loadTemplate(curTemplate)"
            id="select-template"
            class="content-input-large"
          >
            <option
              value="none"
              disabled
            >Select a Scouting Template</option>
            <option value="TEMPLATE_PITSCOUT">Pit Scout</option>
            <option value="TEMPLATE_MATCHSCOUT">Match Scout</option>
          </select>
        </div>
      </div>

      <div class="location-centered-small">
        <!-- beautify ignore:start -->
        <component v-for="(field, index) in fields"
          :key="field.field || field.title"
          :id="field.field || field.title.replace(/[^a-zA-Z]/g, '')"
          :is="fieldIs(field)"
          :indata="field"
          :data="field"
          @clicked="openField(field)"
          @save="saveField(index, ...arguments)"
          @close="closeField()"
          @delete="deleteField(index)"
          @move-up="moveUp(index)"
          @move-down="moveDown(index)">
        </component>
        <!-- beautify ignore:end -->

        <div class="line" />

        <div
          v-if="curOpen == 'field_add'"
          id="template-field-add"
        >
          <h3 class="background-box content-centered">Creating New Field</h3>

          <div class="field-edit">
            <p class="background-box">Display Name</p>
            <div class="background-box-input">
              <input
                type="text"
                v-model.trim="newFieldTitle"
                placeholder="Display Name"
              >
            </div>
          </div>
          <div class="field-edit">
            <p class="background-box">Type</p>
            <div class="background-box-input">
              <select v-model="newFieldType">
                <option value="TitleField">Title</option>
                <option value="BooleanField">Boolean</option>
                <option value="DropdownField">Dropdown</option>
                <option value="NumberField">Number</option>
                <option value="NumberFieldInc">Number Incremential</option>
              </select>
            </div>

          </div>

          <div
            @click="createField()"
            class="background-box background-box-hover content-centered"
          >
            <p>Create</p>
          </div>
          <div
            @click="closeField()"
            class="background-box background-box-hover content-centered"
          >
            <p>Cancel</p>
          </div>
        </div>

        <div
          v-else-if="curTemplate != 'none'"
          @click="openFieldAdd()"
          style="margin-top: 30px;"
          class="location-centered-small background-box background-box-hover content-centered"
        >
          <h3>Create new field</h3>
        </div>

      </div>
    </div>
  </div>
  <Error v-else>You must be logged in as an admin to view this page!</Error>
</template>

<script>
import TemplateField from "./admin/template/TemplateField.vue";

import TemplateEditTitle from "./admin/template/TemplateEditTitle.vue";
import TemplateEditBoolean from "./admin/template/TemplateEditBoolean.vue";
import TemplateEditDropdown from "./admin/template/TemplateEditDropdown.vue";
import TemplateEditNumber from "./admin/template/TemplateEditNumber.vue";
import TemplateEditNumberInc from "./admin/template/TemplateEditNumberInc.vue";

import Error from "@/components/Error.vue";
import Message from "@/components/Message.vue";

import { scroller } from "vue-scrollto/src/scrollTo";

export default {
  name: "MenuTemplateEditor",
  props: {
    localdb: Object,
    remotedb: Object
  },
  components: {
    TemplateEditTitle,
    TemplateField,
    TemplateEditBoolean,
    TemplateEditDropdown,
    TemplateEditNumber,
    TemplateEditNumberInc,
    Error,
    Message
  },
  data: function() {
    return {
      fields: [],
      curOpen: "none",
      newFieldTitle: "",
      newFieldType: "TitleField",
      isError: false,
      isMessage: false,
      errorMessage: "An error has occurred!",
      generalMessage: "",
      curTemplate: "none",
      scrollTo: scroller(),
      isAdmin: false
    };
  },
  methods: {
    fieldIs(field) {
      var fieldID = field.field || field.title;
      if (this.curOpen == fieldID) {
        return "TemplateEdit" + field.type.replace("Field", "");
      } else {
        return "TemplateField";
      }
    },
    fieldExists(fieldID) {
      for (var i of this.fields) {
        if (i.field == fieldID) {
          return true;
        }
      }
      return false;
    },
    createField() {
      if (this.newFieldTitle == "") return;
      var field = {
        title: this.newFieldTitle,
        type: this.newFieldType
      };

      var date = new Date();
      var d = date.getSeconds() + "_" + date.getMilliseconds();

      if (this.newFieldType == "TitleField") {
        this.fields.push(field);
        this.closeField();
      } else if (this.newFieldType == "BooleanField") {
        field.field =
          this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_boolean";
        field.default = false;
        field.points = [0, 0];

        while (this.fieldExists(field.field)) {
          d = date.getSeconds() + "_" + date.getMilliseconds();
          field.field =
            this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_boolean";
        }

        this.fields.push(field);
        this.closeField();
      } else if (this.newFieldType == "DropdownField") {
        field.field =
          this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_dropdown";
        field.options = [];
        field.points = [];
        field.default = "";

        while (this.fieldExists(field.field)) {
          d = date.getSeconds() + "_" + date.getMilliseconds();
          field.field =
            this.newFieldTitle.replace(/[^a-zA-Z]/g, "") +
            "_" +
            d +
            "_dropdown";
        }

        this.fields.push(field);
        this.closeField();
      } else if (this.newFieldType == "NumberField") {
        field.field =
          this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_number";
        field.default = 0;
        field.points = 0;
        field.min = 0;

        while (this.fieldExists(field.field)) {
          d = date.getSeconds() + "_" + date.getMilliseconds();
          field.field =
            this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_number";
        }

        this.fields.push(field);
        this.closeField();
      } else if (this.newFieldType == "NumberFieldInc") {
        field.field =
          this.newFieldTitle.replace(/[^a-zA-Z]/g, "") + "_" + d + "_numnerinc";
        field.points = 0;
        field.default = 0;
        field.min = 0;

        while (this.fieldExists(field.field)) {
          d = date.getSeconds() + "_" + date.getMilliseconds();
          field.field =
            this.newFieldTitle.replace(/[^a-zA-Z]/g, "") +
            "_" +
            d +
            "_numnerinc";
        }

        this.fields.push(field);
        this.closeField();
      }
    },
    openFieldAdd() {
      var dThis = this;
      this.newFieldTitle = "";
      this.newFieldType = "TitleField";
      this.curOpen = "field_add";

      this.$nextTick().then(function() {
        dThis.scrollTo("#template-field-add", 500, { offset: -10 });
      });
    },
    openField(field) {
      var dThis = this;
      this.curOpen = field.field || field.title;
      var scrollEl = field.field || field.title.replace(/[^a-zA-Z]/g, "");
      this.$nextTick().then(function() {
        dThis.scrollTo("#" + scrollEl, 500, { offset: -10 });
      });
    },
    saveField(index, fieldData) {
      this.$set(this.fields, index, Object.assign({}, fieldData));
    },
    closeField() {
      this.curOpen = "none";
    },
    deleteField(index) {
      var confirmDelete = confirm(
        "You are about to delete '" + this.fields[index].title + "'"
      );
      if (confirmDelete) this.fields.splice(index, 1);
    },
    moveUp(index) {
      if (index > 0) this.arrayMove(this.fields, index, index - 1);
    },
    moveDown(index) {
      if (index < this.fields.length - 1)
        this.arrayMove(this.fields, index, index + 1);
    },
    loadTemplate(template) {
      var dThis = this;
      this.isError = false;
      this.isMessage = false;
      this.fields = [];
      if (template == "none") return;
      this.localdb
        .get(template)
        .then(function(doc) {
          dThis.fields = doc.fields;
        })
        .catch(function(err) {
          if (err.status == 404) {
            dThis.isError = true;
            dThis.errorMessage =
              "Failed to load template... creating a blank template. If there is an existing template saving will overwrite it!";
          }
        });
    },
    saveTemplate(template) {
      var dThis = this;

      if (this.curTemplate === "none") {
        this.isError = true;
        this.errorMessage = "No template is open.";
        return;
      }

      if (this.fields.length < 1) {
        this.isError = true;
        this.errorMessage = "You must have at least one field!";
        return;
      }

      for (var i of this.fields) {
        if (
          i.type === "DropdownField" &&
          (i.options.length < 1 || i.points.length < 1)
        ) {
          var errorMessage = "Dropdown field '" + i.title + "' has no options.";
          this.isError = true;
          this.errorMessage = errorMessage;

          return;
        }
      }

      this.isError = false;
      this.isMessage = false;

      this.localdb
        .get(template)
        .then(function(doc) {
          doc.fields = dThis.fields;
          dThis.localdb.put(doc).then(function() {
            dThis.isMessage = true;
            dThis.generalMessage = "Push successful!";
          });
        })
        .catch(function(err) {
          if (err.status == 404) {
            var forcePush = confirm(
              "Failed to retrive an existing template.\nPush anyway?\n\nWarning: Pushing will overwrite any existing template!"
            );
            if (forcePush) {
              var doc = { _id: template, fields: dThis.fields };
              dThis.localdb.put(doc).then(function() {
                dThis.isMessage = true;
                dThis.generalMessage = "Push successful!";
              });
            }
          }
        });
    },
    arrayMove(arr, oldIndex, newIndex) {
      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    var dThis = this;
    this.remotedb.getSession(function(err, response) {
      if (err) {
        //There was an error
      } else if (response.userCtx.roles.indexOf("_admin") != -1) {
        dThis.isAdmin = true;
      } else {
        dThis.isAdmin = false;
      }
    });
  }
};
</script>

<style>
.field-edit {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>