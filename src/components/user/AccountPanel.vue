<template>
  <div class="background-box">
    <h2 class="content-centered">Account</h2>

    <p v-if="loggedin" class="content-centered">Logged in as: {{username}}</p>
    <p v-else class="content-centered">Not logged in</p>

    <br>
    <div v-if="loggedin && isAdmin" class="grid-perminant">
      <a class="location-left-small content-centered">Change Password</a>
      <router-link class="location-centered-small content-centered" :to="{name: 'admin'}">Admin Tools</router-link>
      <a class="location-right-small content-centered">Logout</a>
    </div>

    <div v-else-if="loggedin && !isAdmin" class="grid-perminant">
      <a class="location-left content-centered">Change Password</a>
      <a class="location-right content-centered">Logout</a>
    </div>

    <div v-else class="grid-perminant">
      <div class="content-centered background-box location-left">
        <h3>Username</h3>
      </div>
      <div class="background-box-input location-right">
        <input v-model="username" placeholder="Username" class="location-span content-centered">
      </div>
      <div class="content-centered background-box location-left">
        <h3>Password</h3>
      </div>
      <div class="background-box-input location-right">
        <input v-model="password" placeholder="Password" type="password" class="content-centered">
      </div>
      <div @click="login()" class="location-span content-centered background-box background-box-hover">
        <h3>Login</h3>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "AccountPanel",
  props: {
    remotedb: Object
  },
  data: function() {
    return {
      loggedin: false,
      isAdmin: false,
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      alert(this.username + "\n" + this.password);
    }
  },
  created() {
    var dThis = this;
    this.remotedb.getSession(function(err, response) {
      if (err) {
        // network error
      } else if (!response.userCtx.name) {
        dThis.loggedin = false;
      } else {
        dThis.loggedin = true;
        dThis.username = response.userCtx.name;
        if (response.userCtx.roles.indexOf("_admin") !== -1) {
          dThis.isAdmin = true;
        }
      }
    });
  }
};
</script>

<style>
</style>
