import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import App from './App.vue';
import router from '@/routes';

import { vSoundClick } from '@/directives';

import quasarUserOptions from '@fjord/core/quasar-user-options';

import settingsModule from './modules/settings';
import zReportModule from './modules/z-report';
import orderModule from './modules/order';

import { registerModules } from './register-modules';

registerModules({
  settings: settingsModule,
  zReport: zReportModule,
  order: orderModule,
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Quasar, quasarUserOptions);
app.use(router);
app.directive('soundClick', vSoundClick);
app.mount('#app');
