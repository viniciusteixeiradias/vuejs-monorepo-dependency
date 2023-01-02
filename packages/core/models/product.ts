import { Category } from "./category";
import { AddonGroup } from "./addon";

export interface Product {
  name?: string;
  name2?: string;
  description?: string;
  price: number;
  price2?: number;
  displayIn?: string[];
  uuid: string;
  category?: Category;
  rank?: number;
  addongroups: AddonGroup[];
}
