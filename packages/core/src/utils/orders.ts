import { Order } from "@/models/order";

const decreasingSortOrdersDate = (orders: Order[]) => {
  return orders.sort((a, b) =>
    a && a.dailyId && b && b.dailyId ? b.dailyId - a.dailyId : 0
  );
};

export { decreasingSortOrdersDate };
