// TODO: Delete this store, use the actions in ZReport component.
import { defineStore } from 'pinia';
import { state } from './state';
import { actions } from './actions';
import { getters } from './getters';

export const useZReportStore = defineStore('z-report', {
  state: () => state,
  actions,
  getters,
});
