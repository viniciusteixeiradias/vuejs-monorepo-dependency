import router from '@/routes';

const moduleRoute = {
  path: '/settings',
  component: () => import('./Module.vue'),
  children: [
    {
      path: '',
      name: 'settings',
      component: () => import('./views/Index.vue'),
    },
  ],
};

export default () => {
  router.addRoute(moduleRoute);
};
