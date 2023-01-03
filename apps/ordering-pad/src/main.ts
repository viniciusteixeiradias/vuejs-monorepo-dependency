import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import App from './App.vue';
import router from '@/routes';

import { vSoundClick } from '@/directives/vSoundClick';

import quasarUserOptions from '@fjord/core/quasar-user-options';

import '@/modules/index';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Quasar, quasarUserOptions);
app.use(router);
app.directive('soundClick', vSoundClick);
app.mount('#app');
