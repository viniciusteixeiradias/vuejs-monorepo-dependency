import { state } from './state';
import PreferenceService from '@fjord/core/services/preference';
import http from '@/services';
import { Preference } from '@fjord/core/models/preference';

export const actions = {
  async load(): Promise<void> {
    const service = PreferenceService(http);
    state.preferences = await service.get();
  },

  async save(preferences?: Preference): Promise<void> {
    if (!preferences) {
      return;
    }

    const service = PreferenceService(http);
    state.preferences = await service.create(preferences);
  },
};
