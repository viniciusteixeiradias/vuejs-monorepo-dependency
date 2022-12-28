interface WindowAPI {
  printHtml: (html: string) => Promise<void>;
}

declare global {
  interface Window {
    api: WindowAPI;
  }
}

export {};
