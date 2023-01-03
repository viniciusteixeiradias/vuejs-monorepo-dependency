const usePrintHtml = (html: string) => {
  // @ts-ignore (define in dts)
  return window.api.printHtml(html);
};

export { usePrintHtml };
