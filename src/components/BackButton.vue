<template>
  <h3 @click="goBack()" class="background-box background-box-hover content-centered location-centered-small done-button-container">Back</h3>
</template>

<script>
export default {
  name: "BackButton",
  props: {
    goBackCallback: {
      type: Function,
      default: () => true
    },
    pushuri: {
      type: String
    }
  },
  methods: {
    goBack() {
      if (this.goBackCallback) {
        if (this.pushuri == undefined) {
          this.$router.go(-1);
        } else {
          this.$router.push(this.pushuri);
        }
      }
    }
  }
};
</script>
