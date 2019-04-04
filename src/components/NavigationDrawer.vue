<template>
  <div>
    <div v-if="false" @click="active = false" class="nav-drawer-background" v-class="active ? 'nav-drawer-background-active' : ''"/>

    <div class="nav-drawer" :class="displayNavigationDrawer">
      <div class="nav-drawer-account-panel">
        <h1 class="content-centered">eTech</h1>

        <div v-if="user.username != null" class="nav-drawer-account-panel-name content-centered">
          <h3>Logged in as:</h3>
          <p>{{ user.username }}</p>
        </div>

        <div v-else>
          <p class="content-centered">Error: Not logged in</p>
        </div>

        <div class="nav-drawer-tab" @click="viewPage('awards')">
          <p>Account</p>
        </div>
      </div>

      <div class="nav-drawer-tab" @click="viewPage('ranking')">
        <p>Search for team</p>
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

      <p @click="active = !active" class="content-centered">{{ active }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationDrawer",
  props: {
    user: Object,
    active: Boolean
  },
  methods: {
    viewPage: function(page) {
      this.$router.push({ name: page });

      var dThis = this;

      setTimeout(function() {
        dThis.active = false;
      }, 200);
    }
  },
  computed: {
    displayNavigationDrawer: function() {
      return this.active ? "nav-drawer-active" : "";
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
  opacity: 0;
  transition: 0.5s ease-in-out;
}
.nav-drawer-background-active {
  opacity: 1;
}
.nav-drawer-background-disabled {
  position: initial !important;
}
.nav-drawer {
  height: 100%;
  width: 300px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: calc(0vw - 305px);
  background-color: var(--box-color);
  box-shadow: var(--shadow);
  transition: 0.5s ease-in-out;
}
.nav-drawer-active {
  width: 300px;
  left: calc(0vw - 0px);
}
.nav-drawer h1,
.nav-drawer h2,
.nav-drawer h2 {
  margin: 10px;
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
  padding: 10px;
  transition: all 0.2s ease-in-out;
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