import router from '@/routes';

const moduleRoute = {
  path: '/z-report',
  component: () => import('./Module.vue'),
  children: [
    {
      path: '',
      name: 'z-report',
      component: () => import('./views/ZReport.vue'),
    },
  ],
};

export default () => {
  router.addRoute(moduleRoute);
};
