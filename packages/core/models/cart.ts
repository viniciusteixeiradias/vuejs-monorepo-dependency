import { Item } from "./item";
import { PaymentMethodType } from "./payment";
import { Takeaway } from "./takeaway";

interface CartPayment {
  paymentType: PaymentMethodType;
  payedValue: number;
  serviceFee: number;
}

interface Cart {
  items: Item[];
  discount: number;
  takeaway?: Takeaway;
}

export type { Cart, CartPayment };
