import { Settings, Printer } from '@fjord/core/models/settings';

export interface State {
  settings: Settings;
  selectedPrinters: Printer[];
}

export const state: State = {
  settings: {
    askBeforePrint: true,
    printers: [],
    onHoldPrintTimes: 1,
    checkoutPrintTimes: 1,
    useVirtualKeyboard: false,
  },
  selectedPrinters: [],
};
