<template>
  <div>
    <transition enter-active-class="content-fade-in" leave-active-class="content-fade-out">
      <i
        v-if="user.role != null && !navigationStatus.backButton"
        class="material-icons toggle-nav-drawer"
        @click="navigationStatus.active = !navigationStatus.active"
        :class="navigationStatus.active ? 'toggle-nav-drawer-open' : ''"
      >menu</i>
    </transition>

    <transition enter-active-class="content-fade-in" leave-active-class="content-fade-out">
      <i
        v-if="user.role != null && navigationStatus.backButton"
        class="material-icons nav-back-button"
        @click="$router.go(-1)"
      >arrow_back</i>
    </transition>

    <h1 class="top-bar content-centered">eTech</h1>
  </div>
</template>

<script>
export default {
  props: {
    navigationStatus: Object,
    user: Object
  }
};
</script>

<style>
.top-bar {
  z-index: 1;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: var(--box-color);
  box-shadow: var(--shadow);
  padding: 10px;
}
.nav-back-button,
.toggle-nav-drawer {
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 100;
  padding: 16px;
  transition: 0.25s ease-in-out;
}
.toggle-nav-drawer-open {
  transform: rotate(90deg);
}
html {
  padding-top: 66px;
}
</style>