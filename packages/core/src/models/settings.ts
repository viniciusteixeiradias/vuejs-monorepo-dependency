interface Printer {
  label: string;
  device: string;
}

interface SettingsFile {
  apiUrl: string;
  loginByCode: boolean;
}

interface Settings {
  askBeforePrint: boolean;
  printers: Printer[];
  onHoldPrintTimes: number;
  checkoutPrintTimes: number;
  useVirtualKeyboard?: boolean;
}

export { Printer, Settings, SettingsFile };
