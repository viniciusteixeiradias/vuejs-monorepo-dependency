import { defineStore } from 'pinia';
import { TablePOS } from '@fjord/core/models/table';
import { Item } from '@fjord/core/models/item';

interface State {
  tables: TablePOS[];
  activeTable?: TablePOS;
  printableItems: Item[];
}

export const useTableStore = defineStore('table', {
  state(): State {
    return {
      printableItems: [],
      activeTable: undefined,
      tables: [],
    };
  },
});
