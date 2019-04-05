<template>
  <div class="top-bar content-centered">
    <div class="toggle-nav-drawer">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" @click="navigationDrawerStatus.active = true">
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"></path>
      </svg>
    </div>

    <h1>eTech</h1>
  </div>
</template>

<script>
export default {
  props: {
    navigationDrawerStatus: Object
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
  display: grid;
  grid-template-columns: 72px 1fr 72px;
}
.toggle-nav-drawer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.toggle-nav-drawer svg {
  color: var(--text-color);
  fill: currentColor;
}
html {
  padding-top: 66px;
}
</style>