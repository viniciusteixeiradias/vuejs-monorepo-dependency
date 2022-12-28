import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@fjord/core/src/components/Home.vue';
import TodayOrderVue from '@/views/TodayOrder/TodayOrder.vue';
import DriversVue from '@/views/Drivers/Drivers.vue';
import AppOrder from '@/printer/Order/AppOrder.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/main', name: 'main', redirect: '/' },
  { path: '/today', name: 'today', component: TodayOrderVue },
  { path: '/drivers', name: 'drivers', component: DriversVue },
  { path: '/print-order', name: 'print-order', component: AppOrder },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
