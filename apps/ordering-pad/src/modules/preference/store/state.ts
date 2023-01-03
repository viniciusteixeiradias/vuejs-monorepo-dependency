import { Preference } from '@fjord/core/models/preference';

export interface State {
  preferences?: Preference;
}

export const state: State = {
  preferences: undefined,
};
