import { Order } from '@fjord/core/models/order';
import { state } from './state';
import { utils } from './utils';

export const actions = {
  loadCartFromOrder(order: Order): void {
    state.baseOrder = order;
    state.payment = utils.cartPaymentFactory(order.payment);
    state.cart = utils.cartFactory(order);
  },
};
