import Vue from "vue"
import App from "./App.vue"
import Router from "vue-router";

import MenuHome from "./components/MenuHome.vue"
import MenuTeamView from "./components/MenuTeamView.vue";
import MenuAdmin from "./components/admin/MenuAdmin.vue";
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

Vue.config.productionTip = false;

Vue.use(Router);

const routes = [
  { path: "/", name: "home", component: MenuHome, meta: { title: "Home" } },
  { path: "/team/:number", name: "team", component: MenuTeamView, props: true, meta: { title: "Team: %s", backButton: true } },
  { path: "/admin/", name: "admin", component: MenuAdmin, meta: { title: "Admin Tools" } },
  { path: "/admin/user/add", name: "user-add", component: MenuUserAdd, meta: { title: "Add user", backButton: true } },
  { path: "/admin/user/:username", name: "user-edit", component: MenuUserEdit, props: true, meta: { title: "Editing user: %s", backButton: true } },
  { path: "/admin/template", name: "admin-template", component: MenuTemplateEditor, meta: { title: "Template Editor", backButton: true } },
  { path: "/analytics", name: "analytics", component: MenuAnalytics, meta: { title: "Analytics" } },
  { path: "/tba/ranking", name: "ranking", component: MenuRanking, meta: { title: "Ranking" } },
  { path: "/tba/schedule", name: "schedule", component: MenuSchedule, meta: { title: "Schedule" } },
  { path: "/tba/bracket", name: "bracket", component: MenuBracket, meta: { title: "Finals Bracket" } },
  { path: "/tba/awards", name: "awards", component: MenuAwards, meta: { title: "Home" } },
  { path: "/credits", name: "credits", component: MenuCredits, meta: { title: "Credits" } },
  { path: "*", name: "page-not-found", component: PageNotFound, meta: { title: "Page Not Found" } }
];

const router = new Router({
  routes: routes,
  mode: "history"
});

router.beforeEach((to, from, next) => {
  var pageTitle = to.meta.title;

  if (to.params.number) pageTitle = pageTitle.replace("%s", to.params.number);
  if (to.params.username) pageTitle = pageTitle.replace("%s", to.params.username);

  document.title = "eTech: Scouting Done Right - " + pageTitle;

  next();
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");