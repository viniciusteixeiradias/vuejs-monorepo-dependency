import { defineStore } from "pinia";
import { Preference } from "@fjord/core/src/models/preference";
import PreferenceService from "@fjord/core/src/services/preference";
import http from "@/services";
import { reactive, computed, ComputedRef } from "vue";

interface State {
  preferences?: Preference;
}

// export const usePreferenceStore = defineStore("preference", () => {
//   const state = reactive<State>({});

//   async function load(): Promise<void> {
//     const service = PreferenceService(http);
//     state.preferences = await service.get();
//   }

//   async function save(preferences?: Preference): Promise<void> {
//     if (!preferences) {
//       return;
//     }

//     const service = PreferenceService(http);
//     state.preferences = await service.create(preferences);
//   }

//   const getters = {
//     moneySymbol: () =>
//       computed(() => {
//         return state.preferences?.general?.currency?.symbol || "€";
//       }),
//     useTables: () =>
//       computed(() => {
//         return state.preferences?.general?.useTables;
//       }),
//     useTakeaway: () =>
//       computed(() => {
//         return state.preferences?.general?.useTakeaway;
//       }),
//     logo: () =>
//       computed(() => {
//         return state.preferences?.general?.logo;
//       }),
//     posLogoUrl: () =>
//       computed(() => {
//         return state.preferences?.template.posLogoUrl;
//       }),
//     online: () =>
//       computed(() => {
//         return state.preferences?.general?.online;
//       }),
//     onlyCollection: () =>
//       computed(() => {
//         return state.preferences?.general?.onlyCollection;
//       }),
//     countryCode: () =>
//       computed(() => {
//         return state.preferences?.general?.countryCode;
//       }),
//     deliveryFee: () =>
//       computed(() => {
//         return state.preferences?.general?.deliveryFee;
//       }),
//   };

//   return { state, getters, load };
// });

export const usePreferenceStore = defineStore("preference", {
  state(): State {
    return {};
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
  },
});

// const state: State = {};

// const actions = {
//   async load(): Promise<void> {
//     const service = PreferenceService(http);
//     state.preferences = await service.get();
//   },

//   async save(preferences?: Preference): Promise<void> {
//     if (!preferences) {
//       return;
//     }

//     const service = PreferenceService(http);
//     state.preferences = await service.create(preferences);
//   },
// };

// const getters = {
//   useTables(state: State): ComputedRef<boolean | undefined> {
//     return computed(() => state.preferences?.general?.useTables);
//   },
//   useTakeaway(state: State): ComputedRef<boolean | undefined> {
//     return computed(() => state.preferences?.general?.useTakeaway);
//   },
// };

// export const usePreferenceStore = defineStore("preference", {
//   state: () => state,
//   actions,
//   getters,
// });
