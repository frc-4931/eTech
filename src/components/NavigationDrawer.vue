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

        <div class="nav-drawer-tab" @click="viewPage('awards')" :class="isCurrent('account')">
          <div>
            <i class="material-icons">person</i>
          </div>
          <p>Account</p>
        </div>
      </div>

      <div class="nav-drawer-tab" @click="viewPage('home')" :class="isCurrent('home')">
        <div>
          <i class="material-icons">home</i>
        </div>
        <p>Home</p>
      </div>

      <div class="nav-drawer-tab" @click="viewPage('ranking')" :class="isCurrent('dfakfka')">
        <div>
          <i class="material-icons">search</i>
        </div>
        <p>Search for team</p>
      </div>

      <div v-if="this.user.role === '_admin'" class="nav-drawer-tab" @click="viewPage('admin')" :class="isCurrent('admin')">
        <div>
          <i class="material-icons">build</i>
        </div>
        <p>Admin Tools</p>
      </div>

      <div class="line"/>

      <h2 class="content-centered">The Blue Alliance</h2>
      <div class="nav-drawer-tab" @click="viewPage('ranking')" :class="isCurrent('ranking')">
        <div>
          <i class="material-icons">swap_vert</i>
        </div>
        <p>Rankings</p>
      </div>
      <div class="nav-drawer-tab" @click="viewPage('schedule')" :class="isCurrent('schedule')">
        <div>
          <i class="material-icons">watch_later</i>
        </div>
        <p>Schedule</p>
      </div>
      <div class="nav-drawer-tab" @click="viewPage('awards')" :class="isCurrent('awards')">
        <div>
          <i class="material-icons">star</i>
        </div>
        <p>Awards</p>
      </div>
      <div class="nav-drawer-tab" @click="viewPage('bracket')" :class="isCurrent('bracket')">
        <div>
          <i class="material-icons">view_list</i>
        </div>
        <p>Finals Bracket</p>
      </div>

      <div class="line"/>

      <div class="nav-drawer-tab" @click="viewPage('credits')" :class="isCurrent('credits')">
        <div>
          <i class="material-icons">info</i>
        </div>
        <p>About & credits</p>
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
      if (this.$router.currentRoute.name != page) {
        this.$router.push({ name: page });
      }
    },
    isCurrent(page) {
      return this.$router.currentRoute.name == page
        ? "nav-drawer-tab-current"
        : "";
    }
  }
};
</script>

<style>
.nav-drawer-background {
  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  z-index: 98;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s ease-in-out;
}
::-webkit-scrollbar {
  width: 0px; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}
.nav-drawer-background-enter,
.nav-drawer-background-leave-active {
  opacity: 0;
}
.nav-drawer {
  height: 100%;
  width: 320px;
  position: fixed;
  z-index: 99;
  top: 0;
  left: -325px;
  background-color: var(--box-color);
  box-shadow: var(--shadow);
  transition: 0.25s ease-in-out;
  overflow-y: scroll;
}
.nav-drawer-active {
  left: 0px;
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
  display: grid;
  grid-template-columns: 50px 1fr;
  transition: all 0.2s ease-in-out;
}
.nav-drawer-tab-current {
  background-color: var(--link-color) !important;
  box-shadow: none !important;
}
.nav-drawer-tab p {
  grid-column: 2/3;
  padding: 10px 0px 10px 0px;
}
.nav-drawer-tab:hover,
.nav-drawer-tab:focus {
  background-color: var(--box-hover-color);
  box-shadow: var(--shadow);
}
.nav-drawer-tab div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-drawer .line {
  margin: 0px !important;
}
</style>