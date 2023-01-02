import { Settings, Printer } from '@fjord/core/models/settings';
import { state } from './state';

export const actions = {
  saveSettings(settings: Settings): void {
    state.settings = settings;
  },
  addNewPrinter(printer: Printer): void {
    state.settings.printers.push(printer);
  },
  removePrinter(printer: Printer): void {
    state.settings.printers.splice(state.settings.printers.indexOf(printer), 1);
  },
  setPrinters(printers: Printer[]): void {
    state.selectedPrinters = printers;
  },
};
