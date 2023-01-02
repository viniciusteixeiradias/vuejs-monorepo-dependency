import router from '@/routes';

const moduleRoute = {
  path: '/orders',
  component: () => import('./Module.vue'),
  children: [
    {
      path: '/today',
      name: 'today-orders',
      component: () => import('./views/today-orders/Index.vue'),
    },
    {
      path: '/drivers',
      name: 'drivers-orders',
      component: () => import('./views/drivers-orders/Index.vue'),
    },
  ],
};

export default () => {
  router.addRoute(moduleRoute);
};
