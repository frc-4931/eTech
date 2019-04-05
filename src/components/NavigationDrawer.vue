<template>
  <div>
    <transition name="nav-drawer-background">
      <div v-show="navigationDrawerStatus.active" @click="navigationDrawerStatus.active = false" class="nav-drawer-background"/>
    </transition>

    <div class="nav-drawer" :class="navigationDrawerStatus.active ? 'nav-drawer-active' : ''">
      <div class="nav-drawer-account-panel">
        <h1 class="content-centered">eTech</h1>

        <div v-if="user.username != null" class="nav-drawer-account-panel-name content-centered">
          <h3>Signed in as:</h3>
          <p>{{ user.username }}</p>
        </div>

        <div v-else>
          <p class="content-centered">Error: Not signed in</p>
        </div>

        <div class="nav-drawer-tab" @click="viewPage('awards')">
          <p>Account</p>
        </div>
      </div>

      <div class="nav-drawer-tab" @click="viewPage('home')">
        <p>Home</p>
      </div>

      <div class="nav-drawer-tab" @click="viewPage('ranking')">
        <p>Search for team</p>
      </div>

      <div v-if="this.user.role === '_admin'" class="nav-drawer-tab" @click="viewPage('admin')">
        <p>Admin Tools</p>
      </div>

      <div class="line"/>

      <h2 class="content-centered">The Blue Alliance</h2>
      <div class="nav-drawer-tab" @click="viewPage('ranking')">
        <p>Rankings</p>
      </div>
      <div class="nav-drawer-tab" @click="viewPage('schedule')">
        <p>Schedule</p>
      </div>
      <div class="nav-drawer-tab" @click="viewPage('awards')">
        <p>Awards</p>
      </div>

      <div class="line"/>
      <div class="nav-drawer-tab" @click="viewPage('awards')">
        <p>Credits</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationDrawer",
  props: {
    user: Object,
    navigationDrawerStatus: Object
  },
  methods: {
    viewPage: function(page) {
      this.navigationDrawerStatus.active = false;

      var dThis = this;

      setTimeout(function() {
        dThis.$router.push({ name: page });
      }, 500);
    }
  }
};
</script>

<style>
.nav-drawer-background {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: 0.6s;
}
.nav-drawer-background-enter,
.nav-drawer-background-leave-active {
  opacity: 0;
}
.nav-drawer {
  height: 100%;
  width: 350px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: calc(0vw - 355px);
  background-color: var(--box-color);
  box-shadow: var(--shadow);
  transition: 0.6s;
}
.nav-drawer-active {
  left: calc(0vw - 0px);
}
.nav-drawer h1,
.nav-drawer h2,
.nav-drawer h2 {
  margin: 10px;
}
.nav-drawer h2 {
  color: var(--neutral);
}
.nav-drawer-account-panel {
  background-color: var(--background-color);
  box-shadow: var(--shadow);
  margin-bottom: 10px;
}
.nav-drawer-account-panel h1 {
  margin: 0px !important;
  padding: 10px;
}
.nav-drawer-account-panel-name {
  margin-left: 10px;
  margin-right: 10px;
}
.nav-drawer-account-panel-name h3 {
  padding-bottom: 5px;
}
.nav-drawer-tab {
  display: grid;
  grid-template-columns: 30px 1fr;
  padding: 10px 30px 10px 30px;
  transition: all 0.2s ease-in-out;
}
.nav-drawer-tab p {
  grid-column: 2/3;
}
.nav-drawer-tab:hover,
.nav-drawer-tab:focus {
  background-color: var(--box-hover-color);
  box-shadow: var(--shadow);
}
.nav-drawer .line {
  margin: 0px !important;
}
</style>