import { Printer } from '@fjord/core/models/settings';
import type { State } from './state';

export const getters = {
  version: (): string => __APP_VERSION__,
  printers: (state: State): Printer[] => state.selectedPrinters,
};
