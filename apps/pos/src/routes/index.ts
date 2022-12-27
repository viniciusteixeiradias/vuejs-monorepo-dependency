import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@fjord/core/src/components/Home.vue";
import TodayOrderVue from "@/views/TodayOrder/TodayOrder.vue";
import DriversVue from "@/views/Drivers/Drivers.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/today", name: "today", component: TodayOrderVue },
  { path: "/drivers", name: "drivers", component: DriversVue },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
