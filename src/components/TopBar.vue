<template>
  <div>
    <transition>
      <i v-show="user.role != null" class="material-icons toggle-nav-drawer" @click="navigationDrawerStatus.active = !navigationDrawerStatus.active" :class="navigationDrawerStatus.active ? 'toggle-nav-drawer-open' : ''">menu</i>
    </transition>

    <h1 class="top-bar content-centered">eTech</h1>
  </div>
</template>

<script>
export default {
  props: {
    navigationDrawerStatus: Object,
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
.toggle-nav-drawer {
  position: fixed;
  left: 16px;
  top: 16px;
  z-index: 100;
  transition: 0.25s ease-in-out;
}
.toggle-nav-drawer-open {
  transform: rotate(90deg);
}
html {
  padding-top: 66px;
}
</style>