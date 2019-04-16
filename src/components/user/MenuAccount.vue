<template>
  <div class="grid grid-shrink">
    <h2 class="location-centered content-centered background-box">Account</h2>

    <div class="location-centered grid">
      <div class="location-left-small">
        <div class="background-box menu-account-tabs">
          <p
            v-for="(panel, index) in panels"
            :key="index"
            :class="{'menu-account-tab-active': index == activePanel}"
            @click="activePanel = index"
          >{{ panel[1] }}</p>

          <div class="line"/>

          <p
            @click="
              user.logOut();
              $router.push({ name: 'login' });
            "
            class="content-centered"
          >Sign out</p>
        </div>
      </div>
      <div class="location-right-large">
        <h2 class="content-centered location-span background-box">{{ panels[activePanel][1] }}</h2>

        <transition
          enter-active-class="content-fade-in"
          leave-active-class="content-fade-out"
          mode="out-in"
        >
          <component
            :is="panels[activePanel][0]"
            :user="user"
            :popup="popup"
            :reloadSync="reloadSync"
            class="menu-account-small"
          ></component>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import AccountInfo from "./AccountInfo.vue";
import AccountPassword from "./AccountPassword.vue";

export default {
  name: "MenuAccount",
  components: {
    AccountInfo,
    AccountPassword
  },
  props: {
    user: Object,
    popup: Object,
    reloadSync: Function
  },
  data() {
    return {
      panels: [
        ["AccountInfo", "Your Account"],
        ["AccountPassword", "Change Password"]
      ],
      activePanel: 0
    };
  }
};
</script>

<style>
.menu-account-small {
  max-width: 500px;
  margin: 0 auto;
}

.menu-account-tabs {
  padding: 0px;
}
.menu-account-tabs p,
.menu-account-tabs h3 {
  padding: 10px;
  transition: 0.2s ease-in-out;
}
.menu-account-tabs .line {
  margin: 0px !important;
}
.menu-account-tabs p:hover,
.menu-account-tabs p:focus {
  background-color: var(--box-hover-color);
  box-shadow: var(--shadow);
}
.menu-account-tab-active {
  background-color: var(--link-color) !important;
  box-shadow: none !important;
}
</style>