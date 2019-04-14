<template>
  <div>
    <ul class="background-box tabs-container">
      <li
        v-for="tab in tabs"
        :key="tab"
        @click="switchTab(tab)"
        :class="activeTab == tab ? 'tab-active' : ''"
      >
        {{ tab }}
      </li>
    </ul>

    <slot :name="tabPanelSlotName" />
  </div>
</template>

<script>
export default {
  name: "TabContainer",
  props: {
    initialTab: String,
    tabs: Array
  },
  data: function() {
    return {
      activeTab: this.initialTab
    };
  },
  computed: {
    tabPanelSlotName: function() {
      return "tab-panel-" + this.activeTab.toLowerCase();
    }
  },
  methods: {
    switchTab: function(tabName) {
      this.activeTab = tabName;
    }
  }
};
</script>

<style>
.tabs-container {
  display: flex;
  padding: 0px;
}
.tabs-container li {
  width: 100%;
  text-align: center;
  list-style: none;
  padding: 10px;
  transition: all 0.2s;
}
.tabs-container li:hover {
  background-color: var(--box-hover-color);
}
.tab-active {
  background-color: var(--neutral) !important;
}
</style>
