import { Cart, CartPayment } from '@fjord/core/models/cart';
import { Item } from '@fjord/core/models/item';
import { Order } from '@fjord/core/models/order';

export interface State {
  cart: Cart;
  editItem: Item | null;
  payment: CartPayment;
  baseOrder: Order | null;
}

export const state: State = {
  cart: {
    discount: 0,
    items: [],
  },
  editItem: null,
  payment: {
    paymentType: 'Cash',
    payedValue: 0,
    serviceFee: 0,
  },
  baseOrder: null,
};
