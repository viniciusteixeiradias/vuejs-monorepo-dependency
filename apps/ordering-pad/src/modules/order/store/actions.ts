import { Order, OrderTypeFilter } from '@fjord/core/models/order';
import OrderService from '@fjord/core/services/order';
import { state } from './state';
import { utils } from './utils';
import http from '@/services';

const orderService = OrderService(http);

export const actions = {
  getOrder(uuid: string): Promise<Order> {
    return orderService.get(uuid);
  },

  setOrder(order: Order | null): void {
    state.order = order;
  },

  async getTodayOrders(
    orderType: OrderTypeFilter,
    page: number,
    limit: number
  ): Promise<Order[]> {
    const dates = utils.getDates();
    const filters = utils.mountFilters({
      page,
      limit,
      start_at: dates.start,
      end_at: dates.end,
      status: 'Completed',
      sort_by: 'daily_id',
      desc: true,
    });

    if (orderType !== OrderTypeFilter.ALL) {
      filters.append('delivery_type', orderType);
    }

    state.orderCount = await orderService.getCount(filters);
    return orderService.getAll(filters);
  },

  async getDeliveryOrders(page: number, limit: number): Promise<Order[]> {
    const dates = utils.getDates();

    const filters = utils.mountFilters({
      page,
      limit,
      start_at: dates.start,
      end_at: dates.end,
      sort_by: 'date',
      desc: true,
    });

    filters.append('delivery_type', 'Delivery');

    state.orderCount = await orderService.getCount(filters);
    return orderService.getAll(filters);
  },
};
