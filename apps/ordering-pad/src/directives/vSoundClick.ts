import { Directive } from 'vue';
import { SoundsUtils } from '@fjord/core/utils';

const vSoundClick: Directive<HTMLElement> = {
  mounted: (el) => el.addEventListener('click', SoundsUtils.click),
};

export { vSoundClick };
