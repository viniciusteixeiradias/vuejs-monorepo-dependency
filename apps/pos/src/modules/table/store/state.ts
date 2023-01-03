import { TablePOS } from '@fjord/core/models/table';
import { Item } from '@fjord/core/models/item';

export interface State {
  tables: TablePOS[];
  activeTable?: TablePOS;
  printableItems: Item[];
}

export const state: State = {
  printableItems: [],
  activeTable: undefined,
  tables: [],
};
