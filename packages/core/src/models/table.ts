import { Order } from './order';

export interface Table {
  number: number;
  seats: number;
  fontColor: string;
  bgColor1: string;
  bgColor2: string;
}

export interface TablePOS {
  table: Table;
  number: number;
  order?: Order;
  status: 'free' | 'reserved' | 'seated' | 'addItem' | 'removeItem';
}
