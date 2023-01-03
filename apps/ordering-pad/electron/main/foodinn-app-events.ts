import fs from 'fs';

import { BrowserWindow, ipcMain, App } from 'electron';

import { PrintUtils } from '@fjord/core/utils/index';

export default (app: App, window: BrowserWindow) => {
  ipcMain.on('closeApp', () => app.quit());

  ipcMain.handle('getPrinters', () => window.webContents.getPrintersAsync());

  ipcMain.handle('getSettings', () => {
    try {
      const data = fs
        .readFileSync(`${app.getPath('userData')}\\app-settings.json`)
        .toString('utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
    }
    return { apiUrl: '', loginByCode: false };
  });

  ipcMain.handle('saveSettings', (_, settings: string) => {
    try {
      fs.writeFileSync(
        `${app.getPath('userData')}\\app-settings.json`,
        settings
      );
    } catch (error) {
      console.error(error);
    }
  });

  ipcMain.handle('printHtml', PrintUtils.printHtml);
};
