import { createApp } from "vue";
import { createPinia } from "pinia";
import { Quasar } from "quasar";
import App from "./App.vue";
import router from "@/routes";
import "./samples/node-api";

import { vSoundClick } from "@/directives";

import quasarUserOptions from "@fjord/core/src/quasar-user-options";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Quasar, quasarUserOptions);
app.use(router);
app.directive("soundClick", vSoundClick);

app.mount("#app").$nextTick(() => {
  postMessage({ payload: "removeLoading" }, "*");
});
