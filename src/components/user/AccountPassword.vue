<template>
  <div>
    <div class="location-span small-margin grid-perminant">
      <p class="content-centered background-box location-left">Password</p>
      <div class="background-box-input location-right">
        <input
          v-model.trim="password"
          placeholder="Password"
          type="password"
          class="content-centered"
        />
      </div>
      <p class="content-centered background-box location-left">
        Confirm Password
      </p>
      <div class="background-box-input location-right">
        <input
          v-on:keydown.enter="changePassword()"
          v-model="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          class="content-centered"
        />
      </div>
    </div>

    <p
      @click="changePassword()"
      v-bind:class="[
        allFieldsValid ? 'background-box-hover' : 'background-box-disabled'
      ]"
      class="content-centered background-box"
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
      confirmPassword: "",
      changingPassword: false
    };
  },
  props: {
    user: Object,
    popup: Object,
    reloadSync: Function
  },
  methods: {
    changePassword() {
      if (this.allFieldsValid) {
        this.user
          .changePassword(this.user.username, this.password)
          .then(() => {
            //   this.user
            //     .logIn(username, password)
            //     .then(() => {
            //       this.reloadSync();

            this.popup.newPopup(
              "Success",
              "You successfully changed your password.",
              ["Ok"]
            );

            this.reloadSync();
            this.changingPassword = false;
            // })
            // .catch(err => {
            //   this.popup.catchError(err);
            //   this.changingPassword = false;
            // });
          })
          .catch(err => {
            this.popup.catchError(err);
            this.changingPassword = false;
          });
      }

      this.password = this.confirmPassword = "";
      this.changingPassword = true;
    }
  },
  computed: {
    allFieldsValid() {
      return (
        this.password != "" &&
        this.password === this.confirmPassword &&
        !this.changingPassword
      );
    }
  }
};
</script>