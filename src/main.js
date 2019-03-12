import Vue from 'vue'
import App from './App.vue'
import Router from "vue-router";

import MenuMain from "./components/MenuMain.vue"
import MenuTeamAdd from "./components/admin/MenuTeamAdd.vue";
import MenuTeamView from "./components/MenuTeamView.vue";
import MenuAdmin from "./components/MenuAdmin.vue";
import MenuTemplateEditor from "./components/MenuTemplateEditor.vue";
import MenuUserAdd from "./components/admin/MenuUserAdd.vue";
import MenuUserEdit from "./components/admin/MenuUserEdit.vue";
// import MenuAnalytics from "./components/MenuAnalytics.vue";
import MenuImportTBATeams from "./components/admin/MenuImportTBATeams.vue";
import PageNotFound from "./components/PageNotFound.vue";

Vue.config.productionTip = false

Vue.use(Router);

const routes = [
  { path: "/", name: "home", component: MenuMain },
  { path: "/team/:number", name: "team", component: MenuTeamView, props: true },
  { path: "/admin/", name: "admin", component: MenuAdmin },
  { path: "/admin/team/add", name: "team-add", component: MenuTeamAdd },
  { path: "/admin/team/import", name: "import-tba-teams", component: MenuImportTBATeams },
  { path: "/admin/user/add", name: "user-add", component: MenuUserAdd },
  { path: "/admin/user/:username", name: "user-edit", component: MenuUserEdit, props: true },
  { path: "/admin/template", name: "admin-template", component: MenuTemplateEditor, },
  //{ path: "/analytics", name: "analytics", component: MenuAnalytics },
  { path: "*", name: "page-not-found", component: PageNotFound }
];

const router = new Router({
  routes: routes,
  mode: "history"
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
