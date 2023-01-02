import { PrinterInfo } from 'electron';
import { SettingsFile } from '@fjord/core/models/settings';

interface WindowAPI {
  printHtml: (html: string) => Promise<void>;
  saveSettings: (settings: string) => Promise<void>;
  getPrinters: () => Promise<PrinterInfo[]>;
  getSettings: () => Promise<SettingsFile>;
}

declare global {
  interface Window {
    api: WindowAPI;
  }
}

export {};
