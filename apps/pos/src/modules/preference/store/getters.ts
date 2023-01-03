import { computed, ComputedRef } from 'vue';
import type { State } from './state';

export const getters = {
  useTables(state: State): ComputedRef<boolean | undefined> {
    return computed(() => state.preferences?.general?.useTables);
  },

  useTakeaway(state: State): ComputedRef<boolean | undefined> {
    return computed(() => state.preferences?.general?.useTakeaway);
  },

  moneySymbol(state: State): string {
    return state.preferences?.general?.currency?.symbol || '€';
  },
};
