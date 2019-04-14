<template>
  <div class="grid-perminant menu-account-small">
    <p class="content-centered background-box location-left">Username</p>
    <div class="background-box-input location-right">
      <input
        v-model.trim="password"
        placeholder="Password"
        type="password"
        class="content-centered"
      />
    </div>
    <p class="content-centered background-box location-left">Password</p>
    <div class="background-box-input location-right">
      <input
        v-on:keydown.enter="changePassword()"
        v-model="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        class="content-centered"
      />
    </div>

    <p
      @click="changePassword()"
      v-bind:class="[
        allFieldsValid ? 'background-box-hover' : 'background-box-disabled'
      ]"
      class="location-span content-centered background-box"
    >
      Login
    </p>
  </div>
</template>

<script>
export default {
  name: "AccountPassword",
  data() {
    return {
      password: "",
      confirmPassword: ""
    };
  },
  props: { user: Object },
  methods: {
    changePassword() {
      this.user
        .changePassword(this.password)
        .then(() => {
          this.password = "";
          this.confirmPassword = "";
        })
        .catch(() => console.log("ERROR")); // TODO: Catch
    }
  },
  computed: {
    allFieldsValid() {
      return this.password != "" && this.password === this.confirmPassword;
    }
  }
};
</script>