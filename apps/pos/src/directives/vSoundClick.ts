import { Directive } from "vue";
import { click } from "@fjord/core/src/utils/sounds";

const vSoundClick: Directive<HTMLElement> = {
  mounted: (el) => el.addEventListener("click", click),
};

export { vSoundClick };
