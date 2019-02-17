<template>
  <div class="background-box">
    <div class="accountpanel-contents">
      <h2 class="content-centered">Account</h2>

      <Message v-if="networkError && loggedin">Could not connect to server.<br> You are working offline.</Message>
      <Message v-else-if="networkError">Could not connect to server.<br> You must be online to login.</Message>
      <div v-else>
        <Message v-if="isError">{{ errorMessage }}</Message>
        <p
          v-else-if="loggedin"
          class="content-centered"
        >Logged in as: {{username}}</p>
        <p
          v-else
          class="content-centered"
        >Not logged in</p>

        <br>
        <div
          v-if="changePasswordMenu === true"
          class="grid-perminant"
        >
          <p class="content-centered background-box location-left">Password</p>
          <div class="background-box-input location-right">
            <input
              v-model="password"
              placeholder="Password"
              type="password"
              class="location-span content-centered"
            >
          </div>

          <p class="content-centered background-box location-left">Confirm Password</p>
          <div class="background-box-input location-right">
            <input
              v-on:keydown.enter="changePassword()"
              v-model="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              class="content-centered"
            >
          </div>
          <p
            @click="closeChangePasswordMenu()"
            class="location-left content-centered background-box background-box-hover"
          >Cancel</p>

          <p
            @click="changePassword()"
            class="location-right content-centered background-box background-box-hover"
          >Change Password</p>
        </div>

        <div
          v-else-if="loggedin && isAdmin"
          class="grid-perminant content-centered"
        >
          <a
            @click="openChangePasswordMenu()"
            class="location-left-small"
          >Change Password</a>
          <router-link
            class="location-centered-small"
            :to="{name: 'admin'}"
          >Admin Tools</router-link>
          <a
            @click="logOut()"
            class="location-right-small"
          >Logout</a>
        </div>

        <div
          v-else-if="loggedin && !isAdmin"
          class="grid-perminant content-centered"
        >
          <a
            @click="openChangePasswordMenu()"
            class="location-left"
          >Change Password</a>
          <a
            @click="logOut()"
            class="location-right"
          >Logout</a>
        </div>

        <div
          v-else
          class="grid-perminant"
        >
          <p class="content-centered background-box location-left">Username</p>
          <div class="background-box-input location-right">
            <input
              v-model="username"
              placeholder="Username"
              type="text"
              class="location-span content-centered"
            >
          </div>
          <p class="content-centered background-box location-left">Password</p>
          <div class="background-box-input location-right">
            <input
              v-on:keydown.enter="login()"
              v-model="password"
              placeholder="Password"
              type="password"
              class="content-centered"
            >
          </div>
          <p
            @click="login()"
            class="location-span content-centered background-box background-box-hover"
          >Login</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from "../Message.vue";

export default {
  name: "AccountPanel",
  components: { Message },
  props: {
    remotedb: Object,
    sync_change: Object,
    user: Object,
    reloadSync: Function
  },
  data: function() {
    return {
      loggedin: false,
      isAdmin: false,
      username: "",
      password: "",
      confirmPassword: "",
      isError: false,
      networkError: true,
      errorMessage: "",
      changePasswordMenu: false
    };
  },
  methods: {
    login() {
      var dThis = this;
      this.remotedb.logIn(this.username, this.password, function(err) {
        dThis.password = "";
        dThis.confirmPassword = "";
        if (err) {
          dThis.loggedin = false;
          dThis.isAdmin = false;
          dThis.user.username = null;

          if (err.name === "unauthorized" || err.name === "forbidden") {
            dThis.isError = true;
            dThis.errorMessage = "Username or password is incorrect.";
          } else {
            dThis.isError = true;
            dThis.errorMessage = "Error, please try again.";
          }
        } else {
          //Login successful
          dThis.getLoggedIn();
          dThis.reloadSync();
        }
      });
    },
    logOut() {
      var dThis = this;
      this.remotedb.logOut(function(err) {
        if (err) {
          dThis.isError = true;
          dThis.errorMessage = "Error, please try again.";
        } else {
          dThis.user.username = null;
          dThis.user.role = null;
          dThis.getLoggedIn();
        }
      });
    },
    getLoggedIn() {
      var dThis = this;

      this.loggedin = this.user.username != null && this.user.role != null;

      this.remotedb.getSession(function(err, response) {
        if (err) {
          dThis.isError = true;
          dThis.networkError = true;
          dThis.errorMessage = "Could not connet to server.";
          dThis.loggedin =
            dThis.user.username != null && dThis.user.role != null;
        } else if (!response.userCtx.name) {
          dThis.isError = false;
          dThis.networkError = false;
          dThis.loggedin = false;
          dThis.isAdmin = false;
          dThis.password = "";
          dThis.confirmPassword = "";
          dThis.username = "";
          dThis.user.username = null;
          dThis.user.role = null;

          dThis.$emit("loggedout");
        } else {
          dThis.isError = false;
          dThis.networkError = false;
          dThis.loggedin = true;
          dThis.username = response.userCtx.name;
          dThis.user.username = response.userCtx.name;
          dThis.isAdmin = false;
          dThis.user.role = null;

          var roles = response.userCtx.roles;
          if (roles.indexOf("_admin") !== -1) {
            dThis.isAdmin = true;
            dThis.user.role = "_admin";
          } else if (roles.indexOf("edit") !== -1) {
            dThis.user.role = "edit";
          } else if (roles.indexOf("view") !== -1) {
            dThis.user.role = "view";
          }

          dThis.$emit("loggedin");
        }
      });
    },
    openChangePasswordMenu() {
      this.changePasswordMenu = true;
    },
    closeChangePasswordMenu() {
      this.changePasswordMenu = false;
    },
    changePassword() {
      if (this.password === this.confirmPassword) {
        var dThis = this;
        this.remotedb.changePassword(this.username, this.password, function(
          err
        ) {
          if (err) {
            if (err.name === "not_found") {
              // You don't have the privileges to see this user
            } else {
              // some other error
              dThis.isError = true;
              dThis.errorMessage = "Failed to change password.";
            }
          } else {
            dThis.password = "";
            dThis.confirmPassword = "";
            dThis.changePasswordMenu = false;
            dThis.getLoggedIn();
          }
        });
      } else {
        this.isError = true;
        this.errorMessage = "Passwords do not match!";
      }
    }
  },
  created() {
    var dThis = this;

    this.getLoggedIn();

    this.sync_change.onPaused = function() {
      dThis.getLoggedIn();
    };
  }
};
</script>

<style>
.accountpanel-contents {
  --box-color: var(--background-color);
}
</style>
