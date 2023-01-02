interface OrderInfo {
  type: string;
  count: number;
  value: number;
}

interface ZReport {
  startAt?: string;
  endAt?: string;
  ordersInfo?: OrderInfo[];
  ordersCount?: number;
  vats?: Record<string, number>;
  totalVat?: number;
  subtotal?: number;
  total?: number;
}

export { OrderInfo, ZReport };
