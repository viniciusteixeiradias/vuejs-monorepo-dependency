export enum DisplayIn {
  ONLINE = 'ONLINE',
  POS = 'POS',
  POS_SIDE = 'POS (SIDE)',
  POS_TOP = 'POS (TOP)',
  POS_CART = 'POS (In Cart)',
  TABLE = 'TABLE',
  POS_MENU = 'POS (Menu Page)'
}

export interface Addon {
  name?: string;
  name2?: string;
  price: number;
  price2?: number;
  preSelected?: boolean;
  position?: number;
  composeName?: string;
  id?: number;
  selected: boolean;
  quantity: number;
  freeQuantity: number;
  description?: string;
  fontColor?: string;
  bgColor1?: string;
  bgColor2?: string;
}

export interface AddonGroup {
  uuid?: string;
  name: string;
  maxChoices: number;
  maxChoicesPos: number;
  minChoices: number;
  displayIn: DisplayIn[];
  id?: number;
  addons: Addon[];
  showName: boolean;
  freeAmount: number;
  dependency?: string[];
  fontColor: string;
  bgColor1: string;
  bgColor2: string;
}
