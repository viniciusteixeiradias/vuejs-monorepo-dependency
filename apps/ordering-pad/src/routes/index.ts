import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@fjord/core/src/components/Home.vue";
import TodayOrderVue from "@/components/TodayOrder.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/today", name: "today", component: TodayOrderVue },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
