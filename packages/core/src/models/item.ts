import { Product } from "./product";
import { AddonGroup } from "./addon";

export interface Item {
  uuid?: string;
  id?: number;
  product?: Product;
  name?: string;
  comment?: string;
  quantity: number;
  price: number;
  addons?: AddonGroup[];
  addonsExtra?: AddonGroup[];
  // TODO: Colocar como opcional
  extra: number;
}
