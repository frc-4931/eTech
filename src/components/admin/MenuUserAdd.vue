<template>
  <div>
    <Error v-show="user.role != '_admin'"
      >You must be logged in as an admin to view this page!</Error
    >
    <div v-show="user.role == '_admin'" class="grid grid-shrink">
      <div class="location-centered-small">
        <h2 class="content-centered background-box">
          Add User
        </h2>

        <div class="grid-perminant small-margin">
          <p class="location-left background-box content-centered">Username</p>

          <div class="location-right background-box-input">
            <input
              v-model.trim="username"
              type="text"
              placeholder="Username"
              class="content-centered"
            />
          </div>

          <p class="location-left background-box content-centered">Password</p>

          <div class="location-right background-box-input">
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="content-centered"
            />
          </div>

          <p class="location-left background-box content-centered">
            Confirm Password
          </p>

          <div class="location-right background-box-input">
            <input
              v-model="confrimPassword"
              type="password"
              placeholder="Confirm Password"
              class="content-centered"
            />
          </div>

          <div
            class="background-box content-centered grid-perminant location-span"
          >
            <label class="location-left-small">
              <input
                class="radio-button"
                v-model="role"
                value="admin"
                type="radio"
              />
              Admin
            </label>
            <label class="location-centered-small">
              <input
                class="radio-button"
                v-model="role"
                value="edit"
                type="radio"
              />
              Edit
            </label>
            <label class="location-right-small">
              <input
                class="radio-button"
                v-model="role"
                value="view"
                type="radio"
              />
              View
            </label>
          </div>
        </div>

        <h3
          @click="addUser()"
          class="background-box content-centered"
          v-bind:class="[
            this.allFieldsValid
              ? 'background-box-hover'
              : 'background-box-disabled'
          ]"
        >
          Add
        </h3>

        <h3
          @click="goBack()"
          class="background-box background-box-hover content-centered"
        >
          Cancel
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import Error from "../Error.vue";

export default {
  name: "MenuUserAdd",
  components: { Error },
  props: {
    popup: Object,
    localdb: Object,
    remotedb: Object,
    user: Object
  },
  data() {
    return {
      username: "",
      password: "",
      confrimPassword: "",
      role: "edit"
    };
  },
  methods: {
    addUser() {
      if (this.allFieldsValid) {
        var dThis = this;

        if (this.role === "admin") {
          this.remotedb.signUpAdmin(this.username.toLowerCase(), this.password);
        }

        this.remotedb.signUp(
          this.username.toLowerCase(),
          this.password,
          { roles: [this.role] },
          function(err) {
            if (err) {
              if (err.name === "conflict") {
                dThis.popup.newPopup(
                  "Error while adding user",
                  "The username you tried to add already exists!",
                  undefined
                );
              } else if (err.name === "forbidden") {
                dThis.popup.newPopup(
                  "Error while adding user",
                  "You do not have permission to add a user!",
                  undefined
                );
              } else {
                dThis.popup.catchError(err);
              }
            } else {
              dThis.goBack();
            }
          }
        );
      } else {
        This.popup.newPopup(
          "Error while adding user",
          "You must be an admin to add users!",
          undefined
        );
      }
    },
    goBack() {
      this.$router.push("/admin/");
    }
  },
  computed: {
    allFieldsValid() {
      return (
        this.username != "" &&
        !this.username.includes(" ") &&
        !this.username.includes("_") &&
        this.password === this.confrimPassword &&
        this.password != ""
      );
    }
  }
};
</script>