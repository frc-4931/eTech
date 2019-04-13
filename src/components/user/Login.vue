<template>
  <div class="grid-perminant">
    <p class="content-centered background-box location-left">Username</p>
    <div class="background-box-input location-right">
      <input
        v-model.trim="username"
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
      v-bind:class="[this.username.length !== 0 && this.password.length !== 0 ? 'background-box-hover' : 'background-box-disabled']"
      class="location-span content-centered background-box"
    >Login</p>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {
    user: Object
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      var dThis = this;
      if (this.username.length > 0 && this.password.length > 0) {
        this.user.logIn(this.username, this.password).then(user => {
          dThis.$router.push({ name: "home" });
        });
      }
    }
  }
};
</script>

<style>
</style>
