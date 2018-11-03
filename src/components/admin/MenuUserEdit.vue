<template>
  <div v-if="loggedin" id="menu-team-add">
    <div class="grid">

      <div class="location-centered-small grid-perminant">
        <Error v-if="isError" class="background=box location-span">{{ errorMessage }}</Error>
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
          <input v-model="password" type="password" placeholder="Password" class="content-centered" :disabled="lockRole">
        </div>

        <div class="location-left background-box content-centered">
          <p>Confirm Password</p>
        </div>

        <div class="location-right background-box-input">
          <input v-model="confirmPassword" type="password" placeholder="Confirm Password" class="content-centered" :disabled="lockRole">
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
      errorMessage: "",
      role: "edit",
      editingUser: "",
      lockRole: false,
      isAdmin: false,
      password: "",
      confirmPassword: "",
      o_name: "",
      o_role: "",
      fieldsChanged: 0
    };
  },
  watch: {
    fieldsChanged(newValue) {
      if (newValue != 0) {
        var values = 0;

        if (this.role !== "admin" && this.isAdmin == true) values++;
        if (this.role === "admin" && this.isAdmin == false) values++;
        if (this.password != "") values++;
        if (this.o_role !== this.role || this.o_name !== this.name) values++;

        if (values == newValue) {
          this.goBack();
        }
      }
    }
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
          dThis.o_role = dThis.role;

          dThis.name = response.realName || "";
          dThis.o_name = dThis.name;
        }
      });
    },
    updateUser() {
      this.fieldsChanged = 0;
      if (this.allFieldsValid()) {
        var dThis = this;

        this.isError = false;

        if (this.o_name !== this.name) {
          if (this.username === this.editingUser) {
            this.remotedb.putUser(
              this.username,
              { metadata: { realName: this.name } },
              function(err) {
                if (err) {
                  //Errer has occured
                } else {
                  dThis.fieldsChanged++;
                }
              }
            );
            this.putUserIntoFile();
          }
        } else {
          if (this.password != "") {
            this.remotedb
              .changePassword(this.username, this.password)
              .then(function() {
                dThis.fieldsChanged++;
              });
          }

          //Changing to admin
          if (this.role === "admin" && this.isAdmin != true) {
            if (this.password != "") {
              this.remotedb
                .signUpAdmin(this.username, this.password)
                .then(function() {
                  dThis.isAdmin = true;
                  dThis.fieldsChanged++;
                })
                .catch(function(err) {
                  if (err.status == 409) {
                    dThis.fieldsChanged++;
                  }
                });
            } else {
              this.isError = true;
              this.errorMessage =
                "You must change the password when making a user an admin.";
            }
          }

          //Changing from admin
          if (this.role !== "admin" && this.isAdmin == true) {
            this.remotedb
              .deleteAdmin(this.username)
              .then(function() {
                dThis.isAdmin = false;
                dThis.fieldsChanged++;
              })
              .catch(function(err) {
                if (err.name === "not_found") {
                  dThis.fieldsChanged++;
                }
              });
          }

          if (this.o_role !== this.role || this.o_name !== this.name) {
            this.remotedb.putUser(
              this.username,
              { roles: [this.role], metadata: { realName: this.name } },
              function(err) {
                if (err) {
                  //Errer has occured
                } else {
                  dThis.fieldsChanged++;
                }
              }
            );

            this.putUserIntoFile();
          }
        }
      } else {
        this.isError = true;
        this.errorMessage = "All feidls are required!";
      }
    },
    allFieldsValid() {
      return this.name != "" && this.password === this.confirmPassword;
    },
    goBack() {
      this.$router.go(-1);
    },
    putUserIntoFile() {
      var dThis = this;
      this.localdb
        .get("USER_INDEX")
        .then(function(doc) {
          if (!doc.users) doc.users = {};
          if (!doc.roles) doc.roles = {};

          doc.users[dThis.username] = dThis.name;
          doc.roles[dThis.username] = dThis.role;

          dThis.localdb.put(doc);
        })
        .catch(function() {
          var doc = { _id: "USER_INDEX", users: {}, roles: {}, names: {} };

          doc.users[dThis.username] = dThis.name;
          doc.roles[dThis.username] = dThis.role;

          dThis.localdb.put(doc);
        });
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
