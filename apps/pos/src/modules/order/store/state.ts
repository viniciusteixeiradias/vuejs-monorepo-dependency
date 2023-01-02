import { Order } from '@fjord/core/models/order';

export interface State {
  onlineOrders: Order[];
  order: Order | null;
  newOnlineOrder: boolean;
  onlineOrderCount: number;
  orderCount: number;
}

export const state: State = {
  onlineOrders: [],
  order: null,
  newOnlineOrder: false,
  onlineOrderCount: 0,
  orderCount: 0,
};
