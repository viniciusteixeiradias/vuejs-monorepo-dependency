import { defineStore } from 'pinia';
import { Preference } from '@fjord/core/models/preference';
import PreferenceService from '@fjord/core/services/preference';
import http from '@/services';
import { computed, ComputedRef } from 'vue';

interface State {
  preferences?: Preference;
}

export const usePreferenceStore = defineStore('preference', {
  state(): State {
    return {
      preferences: undefined,
    };
  },

  actions: {
    async load(): Promise<void> {
      const service = PreferenceService(http);
      this.preferences = await service.get();
    },

    async save(preferences?: Preference): Promise<void> {
      if (!preferences) {
        return;
      }

      const service = PreferenceService(http);
      this.preferences = await service.create(preferences);
    },
  },

  getters: {
    useTables(state): ComputedRef<boolean | undefined> {
      return computed(() => state.preferences?.general?.useTables);
    },

    useTakeaway(state): ComputedRef<boolean | undefined> {
      return computed(() => state.preferences?.general?.useTakeaway);
    },

    moneySymbol(state): string {
      return state.preferences?.general?.currency?.symbol || '€';
    },
  },
});
