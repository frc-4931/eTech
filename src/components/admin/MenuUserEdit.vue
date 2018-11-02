<template>
  <div v-if="loggedin" id="menu-team-add">
    <div class="grid">

      <div class="location-centered-small grid-perminant">
        <Error v-if="isError" class="background=box location-span">All feidls are required!</Error>
        <h2 v-else class="content-centered background-box location-span">{{username}}</h2>

        <div class="location-left background-box content-centered">
          <p>Name</p>
        </div>

        <div class="location-right background-box-input">
          <input v-model.trim="name" type="text" placeholder="Name" class="content-centered">
        </div>

        <div class="location-left background-box content-centered">
          <p>Password</p>
        </div>

        <div class="location-right background-box-input">
          <input v-model="password" type="password" placeholder="Password" class="content-centered">
        </div>

        <div class="location-left background-box content-centered">
          <p>Confirm Password</p>
        </div>

        <div class="location-right background-box-input">
          <input v-model="confirmPassword" type="password" placeholder="Confirm Password" class="content-centered">
        </div>

        <div class="background-box content-centered location-span grid-perminant">
          <label class="location-left-small">
            <input class="radio-button" v-model="role" value="admin" type="radio" name="radio1" :disabled="lockRole">
            Admin
          </label>
          <label class="location-centered-small">
            <input class="radio-button" v-model="role" value="edit" type="radio" name="radio1" :disabled="lockRole">
            Edit
          </label>
          <label class="location-right-small">
            <input class="radio-button" v-model="role" value="view" type="radio" name="radio1" :disabled="lockRole">
            View
          </label>
        </div>
      </div>

      <div class="location-centered-small">
        <div @click="updateUser()" class="background-box background-box-hover content-centered">
          <h3>Save</h3>
        </div>

        <div @click="goBack()" class="background-box background-box-hover content-centered">
          <h3>Cancel</h3>
        </div>
      </div>
    </div>
  </div>
  <Error v-else>You must be logged in as an admin to view this page!</Error>
</template>

<script>
import Error from "../Error.vue";

export default {
  name: "MenuUserAdd",
  components: { Error },
  props: {
    localdb: Object,
    remotedb: Object,
    username: String
  },
  data() {
    return {
      loggedin: false,
      name: "",
      isError: false,
      role: "edit",
      editingUser: "",
      lockRole: false,
      isAdmin: false,
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    getUser() {
      var dThis = this;
      this.remotedb.getUser(this.username, function(err, response) {
        if (err) {
          //error
        } else {
          if (response.roles.indexOf("admin") != -1) {
            dThis.role = "admin";
            dThis.isAdmin = true;
          } else if (response.roles.indexOf("edit") != -1) {
            dThis.role = "edit";
          } else if (response.roles.indexOf("view") != -1) {
            dThis.role = "view";
          }

          dThis.name = response.realName || "";
        }
      });
    },
    updateUser() {
      if (this.allFieldsValid()) {
        var dThis = this;

        //Changing to admin
        if (this.role === "admin" && this.isAdmin != true) {
          this.remotedb.signUpAdmin(this.username, this.password);
        }

        //Changing from admin
        if (this.role !== "admin" && this.isAdmin == true) {
          this.remotedb.deleteAdmin(this.username);
        }

        this.remotedb.putUser(
          this.username,
          { roles: [this.role], metadata: { realName: this.name } },
          function(err) {
            if (err) {
              console.log(err);
            } else {
              dThis.goBack();
            }
          }
        );
      } else {
        this.isError = true;
      }
    },
    allFieldsValid() {
      return this.name != "" && this.password === this.confirmPassword;
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
        dThis.loggedin = true;
        dThis.editingUser = response.userCtx.name;

        if (dThis.editingUser == dThis.username) {
          dThis.lockRole = true;
        }

        dThis.getUser();
      } else {
        dThis.loggedin = false;
      }
    });
  }
};
</script>

<style>
</style>
