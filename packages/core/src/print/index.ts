import { BrowserWindow } from 'electron';

const DEFAULT_PRINTER_OPTIONS: Electron.WebContentsPrintOptions = {
  silent: true,
  printBackground: true,
  color: false,
  margins: {
    marginType: 'custom',
    top: 100,
    left: 10,
    right: 10,
    bottom: 10,
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Header of the Page',
  footer: 'Footer of the Page',
};

const getPrinterOptions = (options: Electron.WebContentsPrintOptions) => {
  return {
    ...DEFAULT_PRINTER_OPTIONS,
    ...options,
  };
};

const prepareWindow = async (html: string) => {
  const win = new BrowserWindow({
    width: 350,
    height: 600,
    show: false,
  });
  await win.loadURL('data:text/html;charset=utf-8,' + encodeURI(html));
  return win;
};

const mountHtmlDocument = (innerHTML: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print</title>
      </head>
      <body>
        ${innerHTML}
      </body>
    </html>
  `;
};

const printHtml = async (_: any, html: string) => {
  const doc = mountHtmlDocument(html);
  const printerOptions = getPrinterOptions({ deviceName: '' });
  const win = await prepareWindow(doc);
  try {
    win.focus();
    win.webContents.print(printerOptions, (success, failureReason) => {
      if (!success) console.error(failureReason);
      win.close();
    });
  } catch (erro) {
    console.error(erro);
  }
};

export { printHtml };
