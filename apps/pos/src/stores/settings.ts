import { defineStore } from 'pinia';
import { Settings, Printer } from '@fjord/core/src/models/settings';

interface State {
  settings: Settings;
  selectedPrinters: Printer[];
}

export const useSettingsStore = defineStore('settings', {
  state(): State {
    return {
      settings: {
        askBeforePrint: true,
        printers: [],
        onHoldPrintTimes: 1,
        checkoutPrintTimes: 1,
        useVirtualKeyboard: false,
      },
      selectedPrinters: [],
    };
  },

  actions: {
    saveSettings(settings: Settings): void {
      this.settings = settings;
    },
    addNewPrinter(printer: Printer): void {
      this.settings.printers.push(printer);
    },
    removePrinter(printer: Printer): void {
      this.settings.printers.splice(this.settings.printers.indexOf(printer), 1);
    },
    setPrinters(printers: Printer[]): void {
      this.selectedPrinters = printers;
    },
  },

  getters: {
    version: (): string => __APP_VERSION__,
    printers: (state): Printer[] => state.selectedPrinters,
  },
});
