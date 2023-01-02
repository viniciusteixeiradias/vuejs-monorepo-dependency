import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@fjord/core/components/Home.vue';
import TodayOrderVue from '@/views/TodayOrder/TodayOrder.vue';
import DriversVue from '@/views/Drivers/Drivers.vue';
import AppOrder from '@/print/Order/AppOrder.vue';
import ZReport from '@/views/ZReport/ZReport.vue';
import Settings from '@/views/Settings/Settings.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/main', name: 'main', redirect: '/' },
  { path: '/today', name: 'today', component: TodayOrderVue },
  { path: '/drivers', name: 'drivers', component: DriversVue },
  { path: '/print-order', name: 'print-order', component: AppOrder },
  { path: '/z-report', name: 'z-report', component: ZReport },
  { path: '/settings', name: 'settings', component: Settings },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
