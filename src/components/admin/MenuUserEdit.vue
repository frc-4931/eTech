<template>
  <div
    v-if="loggedin"
    class="grid"
  >
    <div class="location-centered-small grid-perminant">
      <Error
        v-if="isError"
        class="background-box location-span"
      >{{ errorMessage }}</Error>
      <h2 class="content-centered background-box location-span">Editing user: {{username}}</h2>

      <div class="location-left background-box content-centered">
        <p>Name</p>
      </div>

      <div class="location-right background-box-input">
        <input
          v-model.trim="name"
          type="text"
          placeholder="Name"
          class="content-centered"
        >
      </div>

      <div class="location-left background-box content-centered">
        <p>Password</p>
      </div>

      <div class="location-right background-box-input">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="content-centered"
          :disabled="lockRole"
        >
      </div>

      <div class="location-left background-box content-centered">
        <p>Confirm Password</p>
      </div>

      <div class="location-right background-box-input">
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="content-centered"
          :disabled="lockRole"
        >
      </div>

      <div class="background-box content-centered location-span grid-perminant">
        <label class="location-left-small">
          <input
            class="radio-button"
            v-model="role"
            value="admin"
            type="radio"
            name="radio1"
            :disabled="lockRole"
          >
          Admin
        </label>
        <label class="location-centered-small">
          <input
            class="radio-button"
            v-model="role"
            value="edit"
            type="radio"
            name="radio1"
            :disabled="lockRole"
          >
          Edit
        </label>
        <label class="location-right-small">
          <input
            class="radio-button"
            v-model="role"
            value="view"
            type="radio"
            name="radio1"
            :disabled="lockRole"
          >
          View
        </label>
      </div>
    </div>

    <div class="location-centered-small">
      <h3
        @click="updateUser()"
        class="background-box content-centered"
        v-bind:class="[this.allFieldsValid() ?  'background-box-hover' : 'background-box-disabled']"
      >Save</h3>

      <h3
        @click="deleteUser()"
        class="background-box background-box-hover content-centered"
      >Delete</h3>

      <h3
        @click="goBack()"
        class="background-box background-box-hover content-centered"
      >Cancel</h3>
    </div>
  </div>
  <Error v-else>You must be logged in as an admin to view this page!</Error>
</template>

<script>
import Error from "../Error.vue";

export default {
  name: "MenuUserEdit",
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
    deleteUser() {
      var dThis = this;

      if (!confirm("Are you sure you would like to delete this user?")) return;

      if (this.isAdmin) {
        this.remotedb
          .deleteAdmin(this.username)
          .then(function() {
            dThis.isAdmin = false;
          })
          .then(function() {
            dThis.remotedb.deleteUser(dThis.username);
            //dThis.removeUserFromFile();
          })
          .catch(function(err) {
            //FAILED
          });
      } else {
        this.remotedb.deleteUser(dThis.username);
        //this.removeUserFromFile();
      }
      this.goBack();
    },
    updateUser() {
      this.fieldsChanged = 0;
      if (this.allFieldsValid()) {
        var dThis = this;

        this.isError = false;

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
        else if (this.role !== "admin" && this.isAdmin == true) {
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
          this.remotedb
            .putUser(
              this.username,
              { roles: [this.role], metadata: { realName: this.name } },
              function(err) {
                if (err) {
                  //Errer has occured
                } else {
                  dThis.fieldsChanged++;

                  if (dThis.password != "") {
                    dThis.remotedb
                      .changePassword(dThis.username, dThis.password)
                      .then(function() {
                        dThis.fieldsChanged++;
                      });
                  }
                }
              }
            )
            .then(function() {});
        } else if (this.password.length !== 0) {
          this.remotedb
            .changePassword(this.username, this.password)
            .then(function() {
              dThis.fieldsChanged++;
            });
        }
      } else {
        this.isError = true;
        this.errorMessage = "All fields are required!";
      }
    },
    allFieldsValid() {
      return (
        this.name.length !== 0 &&
        this.password === this.confirmPassword &&
        (this.password.length !== 0 || this.o_name !== this.name)
      );
    },
    goBack() {
      this.$router.push("/admin/");
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
      }
    });
  }
};
</script>
