<template>
  <div
    v-if="loggedin"
    class="grid"
  >
    <div class="location-centered-small grid-perminant">
      <Error
        v-if="isError"
        class="background=box location-span"
      >All fields are required!</Error>
      <h2
        v-else
        class="content-centered background-box location-span"
      >Add User</h2>

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
        <p>Username</p>
      </div>

      <div class="location-right background-box-input">
        <input
          v-model.trim="username"
          type="text"
          placeholder="Username"
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
        >
      </div>

      <div class="location-left background-box content-centered">
        <p>Confirm Password</p>
      </div>

      <div class="location-right background-box-input">
        <input
          v-model="confrimPassword"
          type="password"
          placeholder="Confirm Password"
          class="content-centered"
        >
      </div>

      <div class="background-box content-centered location-span grid-perminant">
        <label class="location-left-small">
          <input
            class="radio-button"
            v-model="role"
            value="admin"
            type="radio"
          >
          Admin
        </label>
        <label class="location-centered-small">
          <input
            class="radio-button"
            v-model="role"
            value="edit"
            type="radio"
          >
          Edit
        </label>
        <label class="location-right-small">
          <input
            class="radio-button"
            v-model="role"
            value="view"
            type="radio"
          >
          View
        </label>
      </div>
    </div>

    <div class="location-centered-small">
      <h3
        @click="addUser()"
        class="background-box background-box-hover content-centered"
        v-bind:class="[this.allFieldsValid() ?  'background-box-hover' : 'background-box-disabled']"
      >Add</h3>

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
  name: "MenuUserAdd",
  components: { Error },
  props: {
    localdb: Object,
    remotedb: Object
  },
  data() {
    return {
      loggedin: false,
      name: "",
      username: "",
      password: "",
      confrimPassword: "",
      isError: false,
      role: "edit"
    };
  },
  methods: {
    addUser() {
      if (this.allFieldsValid()) {
        var dThis = this;

        if (this.role === "admin") {
          this.remotedb.signUpAdmin(
            this.username.toLowerCase(),
            this.password,
            {
              metadata: { realName: dThis.name }
            }
          );
        }
        this.remotedb.signUp(
          this.username.toLowerCase(),
          this.password,
          { roles: [this.role], metadata: { realName: dThis.name } },
          function(err) {
            if (err) {
              if (err.name === "conflict") {
                alert("conflict");
              } else if (err.name === "forbidden") {
                alert("Invalid username");
              } else {
                // HTTP error, cosmic rays, etc.
              }
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
      return (
        this.name != "" &&
        this.username != "" &&
        this.password === this.confrimPassword &&
        this.password != ""
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
      }
    });
  }
};
</script>