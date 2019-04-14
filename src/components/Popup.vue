<template>
  <div>
    <transition
      enter-active-class="content-fade-in"
      leave-active-class="content-fade-out"
      mode="out-in"
    >
      <div v-if="showPopup" class="popup-background" />
    </transition>

    <transition
      enter-active-class="content-fade-in"
      leave-active-class="content-fade-out"
      mode="out-in"
    >
      <div v-if="showPopup" class="popup-container">
        <div class="background-box">
          <h2 class="content-centered">{{ title }}</h2>
          <p>{{ text }}</p>

          <ul class="popup-options-container">
            <li
              v-for="(option, index) in options"
              :key="option"
              @click="clicked = index"
            >
              {{ option }}
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
export default {
  name: "Popup",
  data() {
    return { clicked: -1, title: "", text: "", options: [], showPopup: false };
  },
  props: { popup: Object },
  methods: {
    newPopup(newTitle, newText, newOptions) {
      this.title = newTitle;
      this.text = newText;
      this.options = newOptions;
      this.clicked = -1;
      this.showPopup = true;

      var dThis = this;

      return new Promise(resolve => {
        setInterval(function() {
          if (dThis.clicked > -1) {
            dThis.showPopup = false;

            resolve(dThis.options[dThis.clicked]);
          }
        }, 50);
      });
    },
    catchError(error) {
      this.newPopup(
        error.name ? "Error: " + error.name : "Error",
        error.message ? error.message : "Something went wrong.",
        ["Ok"]
      );
    }
  },
  created() {
    this.popup.newPopup = this.newPopup;
    this.popup.catchError = this.catchError;
  }
};
</script>

<style>
.popup-background {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 149;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.popup-container {
  position: fixed;
  z-index: 150;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-container div {
  max-width: 500px;
}
.popup-options-container {
  display: flex;
  padding: 0px;
  margin: 0px;
}
.popup-options-container li {
  width: 100%;
  text-align: center;
  list-style: none;
  transition: all 0.2s;
  color: var(--link-color);
  margin-top: 10px;
}
.popup-options-container li:hover {
  color: var(--link-active-color);
}
</style>
