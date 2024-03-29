<template>
  <div v-if="loggedin" class="grid">
    <div class="location-centered-small">
      <h2 class="content-centered background-box">
        Editing user: {{ username }}
      </h2>

      <div class="grid-perminant small-margin">
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
          />
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
          />
        </div>

        <div
          class="background-box content-centered location-span grid-perminant"
        >
          <label class="location-left-small">
            <input
              class="radio-button"
              v-model="role"
              value="admin"
              type="radio"
              :disabled="lockRole"
            />
            Admin
          </label>
          <label class="location-centered-small">
            <input
              class="radio-button"
              v-model="role"
              value="edit"
              type="radio"
              :disabled="lockRole"
            />
            Edit
          </label>
          <label class="location-right-small">
            <input
              class="radio-button"
              v-model="role"
              value="view"
              type="radio"
              :disabled="lockRole"
            />
            View
          </label>
        </div>
      </div>

      <h3
        @click="updateUser()"
        class="background-box content-centered"
        v-bind:class="[
          this.allFieldsValid
            ? 'background-box-hover'
            : 'background-box-disabled'
        ]"
      >
        Save
      </h3>

      <h3
        @click="deleteUser()"
        class="background-box background-box-hover content-centered"
      >
        Delete
      </h3>

      <h3
        @click="goBack()"
        class="background-box background-box-hover content-centered"
      >
        Cancel
      </h3>
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
    popup: Object,
    localdb: Object,
    remotedb: Object,
    username: String
  },
  data() {
    return {
      loggedin: true,
      role: "edit",
      editingUser: "",
      lockRole: false,
      isAdmin: false,
      password: "",
      confirmPassword: "",
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
        if (this.o_role !== this.role) values++;

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
        }
      });
    },
    deleteUser() {
      var dThis = this;

      this.popup
        .newPopup(
          "Delete User?",
          "Are you sure you would like to delete this user?",
          ["Cancel", "Delete"]
        )
        .then(option => {
          if (option == "Delete") {
            if (dThis.isAdmin) {
              dThis.remotedb
                .deleteAdmin(this.username)
                .then(function() {
                  dThis.isAdmin = false;
                })
                .then(function() {
                  dThis.remotedb.deleteUser(dThis.username);
                })
                .catch(err => dThis.popup.catchError(err));
            } else {
              this.remotedb.deleteUser(dThis.username);
            }
            this.goBack();
          }
        });
    },
    updateUser() {
      this.fieldsChanged = 0;
      if (this.allFieldsValid) {
        var dThis = this;

        this.isError = false;

        //Changing to admin
        if (this.role === "admin" && this.isAdmin != true) {
          if (this.password.length > 0) {
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
            dThis.popup.newPopup(
              "Error while editing user",
              "You must change the password when making a user an admin.",
              undefined
            );
            return;
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

        if (this.o_role !== this.role) {
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
        this.popup.newPopup(
          undefined,
          "You didn't change any values or passwords do not match!",
          undefined
        );
      }
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
        dThis.editingUser = response.userCtx.name;

        if (dThis.editingUser == dThis.username) {
          dThis.lockRole = true;
        }

        dThis.getUser();
      } else {
        dThis.loggedin = false;
      }
    });
  },
  computed: {
    allFieldsValid() {
      return (
        this.password === this.confirmPassword &&
        (this.password.length !== 0 || this.o_role !== this.role)
      );
    }
  }
};
</script>
