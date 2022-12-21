import { ClosePopup, Dark, Dialog, Notify, Ripple } from "quasar";
import iconSet from "quasar/icon-set/svg-material-icons-outlined";
import lang from "quasar/lang/en-GB";

import "quasar/src/css/index.sass";
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/material-icons-round/material-icons-round.css";
import "@quasar/extras/material-icons-sharp/material-icons-sharp.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";

export default {
  directives: {
    ClosePopup,
    Ripple,
  },
  config: {},
  plugins: {
    Dark,
    Dialog,
    Notify,
  },
  iconSet,
  lang,
};
