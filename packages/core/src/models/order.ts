import { Product } from "./product";
import { AddonGroup } from "./addon";
import { Address } from "./address";

enum OrderType {
  COLLECTION = "Collection",
  DELIVERY = "Delivery",
  TABLE = "Table",
  WALK_IN = "Walk In",
  SALE = "Sale",
}

interface OrderItem {
  id?: number;
  productUuid?: string;
  product?: Product;
  name?: string;
  comment?: string;
  quantity?: number;
  price?: number;
  extra?: number;
  total?: number;
  addons?: AddonGroup[];
  addonsExtra?: AddonGroup[];
}

interface Order {
  uuid?: string;
  date?: Date;
  status?: string;
  deliveryType?: OrderType;
  deliveryTime?: string;
  totalPrice?: number;
  userId?: number;
  addressUuid?: string | null;
  address?: Address;
  comment?: string;
  deliveryFee?: number;
  extraDeliveryFee?: number;
  discount?: number;
  subTotal?: number;
  discountValue?: number;
  tableNumber?: number;
  dailyId?: number;
  pickup: number;
  changeDue: number;
  rejectionReason: string;
  origin?: string;
  items?: OrderItem[];
  payment?: Payment;
}

enum OrderTypeFilter {
  ALL = "All",
  COLLECTION = "Collection",
  DELIVERY = "Delivery",
  TABLE = "Table",
  WALK_IN = "Walk In",
  SALE = "Sale",
}

export { OrderType, OrderTypeFilter };
export type { OrderItem, Order };
