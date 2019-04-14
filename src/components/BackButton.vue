<template>
  <div class="grid location-span">
    <h3
      @click="goBack()"
      class="background-box background-box-hover content-centered location-centered-small done-button-container"
    >
      Back
    </h3>
  </div>
</template>

<script>
export default {
  name: "BackButton",
  props: {
    goBackCallback: {
      type: Function
    },
    pushuri: {
      type: String
    }
  },
  methods: {
    goBack() {
      if (this.goBackCallback == null) {
        if (this.pushuri == undefined) {
          this.$router.go(-1);
        } else {
          this.$router.push(this.pushuri);
        }
      } else {
        this.goBackCallback();
      }
    }
  }
};
</script>
