<template>
  <div class="grid">
    <h3 class="content-centered location-centered-small background-box">
      Sign in
    </h3>

    <div class="location-centered-small grid-perminant small-margin">
      <p class="content-centered background-box location-left">Username</p>
      <div class="background-box-input location-right">
        <input
          v-model.trim="username"
          placeholder="Username"
          type="text"
          class="content-centered"
        />
      </div>
      <p class="content-centered background-box location-left">Password</p>
      <div class="background-box-input location-right">
        <input
          v-on:keydown.enter="login()"
          v-model="password"
          placeholder="Password"
          type="password"
          class="content-centered"
        />
      </div>
    </div>
    <div class="location-centered-small">
      <p
        @click="login()"
        v-bind:class="[
          allFieldsValid ? 'background-box-hover' : 'background-box-disabled'
        ]"
        class="content-centered background-box"
      >
        Login
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {
    user: Object,
    popup: Object
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
      if (this.allFieldsValid) {
        this.user
          .logIn(this.username, this.password)
          .then(() => {
            dThis.$router.push({ name: "home" });
          })
          .catch(err => {
            this.password = "";
            this.popup.catchError(err);
          });
      }
    }
  },
  computed: {
    allFieldsValid() {
      return this.username.length > 0 && this.password.length > 0;
    }
  }
};
</script>