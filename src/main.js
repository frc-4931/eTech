import Vue from 'vue'
import App from './App.vue'
import Router from "vue-router";

import MenuMain from "./components/MenuMain.vue"
import MenuTeamView from "./components/MenuTeamView.vue";
import MenuAdmin from "./components/MenuAdmin.vue";
import MenuTemplateEditor from "./components/MenuTemplateEditor.vue";
import MenuUserAdd from "./components/admin/MenuUserAdd.vue";
import MenuUserEdit from "./components/admin/MenuUserEdit.vue";
import MenuAnalytics from "./components/MenuAnalytics.vue";
import MenuRanking from "./components/ranking/MenuRanking.vue";
import MenuSchedule from "./components/schedule/MenuSchedule.vue";
import MenuBracket from "./components/bracket/MenuBracket.vue";
import MenuAwards from "./components/awards/MenuAwards.vue";
import MenuCredits from "./components/credits/MenuCredits.vue";
import PageNotFound from "./components/PageNotFound.vue";

Vue.config.productionTip = false

Vue.use(Router);

const routes = [
  { path: "/", name: "home", component: MenuMain },
  { path: "/team/:number", name: "team", component: MenuTeamView, props: true },
  { path: "/admin/", name: "admin", component: MenuAdmin },
  { path: "/admin/user/add", name: "user-add", component: MenuUserAdd },
  { path: "/admin/user/:username", name: "user-edit", component: MenuUserEdit, props: true },
  { path: "/admin/template", name: "admin-template", component: MenuTemplateEditor, },
  { path: "/analytics", name: "analytics", component: MenuAnalytics },
  { path: "/tba/ranking", name: "ranking", component: MenuRanking },
  { path: "/tba/schedule", name: "schedule", component: MenuSchedule },
  { path: "/tba/bracket", name: "bracket", component: MenuBracket },
  { path: "/tba/awards", name: "awards", component: MenuAwards },
  { path: "/credits", name: "credits", component: MenuCredits },
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