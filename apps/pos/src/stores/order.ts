import { defineStore } from "pinia";
import { Order, OrderTypeFilter } from "@fjord/core/src/models/order";
import OrderService from "@fjord/core/src/services/order";
import moment from "moment";
import http from "@/services";

interface State {
  onlineOrders: Order[];
  order: Order | null;
  newOnlineOrder: boolean;
  onlineOrderCount: number;
  orderCount: number;
}

interface Dates {
  start: string;
  end: string;
}

const getDates = (): Dates => {
  const startDate = moment();
  if (startDate.hours() < 8) {
    startDate.subtract(1, "day");
  }

  return {
    start: startDate.format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  };
};

// TODO: Shared this?
interface Filters {
  page?: number;
  limit?: number;
  sort_by?: string;
  desc?: boolean;
  start_at?: string;
  origin?: string;
  end_at?: string;
  status?: string;
}

const mountFilters = (filters: Filters): URLSearchParams => {
  const params = new URLSearchParams();

  for (const key in filters) {
    params.append(key, filters[key]);
  }

  return params;
};

const orderService = OrderService(http);

export const useOrderStore = defineStore("order", {
  state: () =>
    ({
      onlineOrders: [],
      order: null,
      newOnlineOrder: false,
      onlineOrderCount: 0,
      orderCount: 0,
    } as State),

  getters: {},

  actions: {
    async getTodayOrders(
      orderType: OrderTypeFilter,
      page: number,
      limit: number
    ): Promise<Order[]> {
      const dates = getDates();
      const filters = mountFilters({
        page,
        limit,
        start_at: dates.start,
        end_at: dates.end,
        status: "Completed",
        sort_by: "daily_id",
        desc: true,
      });

      if (orderType !== OrderTypeFilter.ALL) {
        filters.append("delivery_type", orderType);
      }

      this.orderCount = await orderService.getCount(filters);
      return orderService.getAll(filters);
    },

    getOrder(uuid: string): Promise<Order> {
      return orderService.get(uuid);
    },

    setOrder(order: Order | null): void {
      this.order = order;
    },
  },
});
