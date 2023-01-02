import { OrderType } from "./order";

interface Takeaway {
  type: OrderType;
  addressUuid?: string;
  phoneNumber: string;
  name: string;
  address?: string;
  eirCode?: string;
  distance?: string;
  deliveryFee?: number;
  extraDelivery?: number;
  comment?: string;
}

export type { Takeaway };
