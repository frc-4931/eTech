import Vue from 'vue'
import App from './App.vue'
import Router from "vue-router";

import MenuMain from "./components/MenuMain.vue"
import MenuTeamAdd from "./components/MenuTeamAdd.vue";
import MenuTeamView from "./components/MenuTeamView.vue";
import MenuAdmin from "./components/MenuAdmin.vue";
import MenuTemplateEditor from "./components/MenuTemplateEditor.vue";

Vue.config.productionTip = false

Vue.use(Router);

const routes = [
  { path: "/", name: "home", component: MenuMain },
  { path: "/team/add", name: "team-add", component: MenuTeamAdd },
  { path: "/team/:number", name: "team", component: MenuTeamView, props: true },
  { path: "/admin/", name: "admin", component: MenuAdmin },
  { path: "/admin/template", name: "admin-template", component: MenuTemplateEditor }
];

const router = new Router({
  routes: routes,
  mode: "history"
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
