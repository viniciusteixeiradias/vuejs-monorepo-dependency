export interface Preference {
  general: General;
  company: Company;
  coverArea: CoverArea;
  openingTimes: OpeningTimes;
  template: Template;
}

export interface General {
  online?: boolean;
  logo?: string;
  useTables?: boolean;
  useTakeaway?: boolean;
  cousine?: string;
  deliveryFee?: number;
  countryCode?: string;
  currency?: Currency;
  companyNamePrintSize?: number;
  maintenance?: boolean;
  stripeAccount?: string;
  deliveryFees?: DeliveryFee[];
  onlyCollection?: boolean;
  paymentModes?: string[];
  useVirtualKeyboard?: boolean;
}

export interface Currency {
  name?: string;
  symbol?: string;
  stripeId?: string;
}

export interface DeliveryFee {
  distance?: number;
  value?: number;
}

export interface Company {
  name?: string;
  phone?: string;
  address?: string;
  websiteUrl?: string;
  email?: string;
  latitude?: string;
  longitude?: string;
}

export interface CoverArea {
  swLatitude?: string;
  swLongitude?: string;
  neLatitude?: string;
  neLongitude?: string;
}

export interface OpeningTimes {
  monday: DayTime;
  tuesday: DayTime;
  wednesday: DayTime;
  thursday: DayTime;
  friday: DayTime;
  saturday: DayTime;
  sunday: DayTime;
}

export interface DayTime {
  start?: string;
  end?: string;
}

export interface Template {
  posLogoUrl?: string;
  siteLogoUrl?: string;
  mainColor?: string;
  textColor?: string;
  secondaryColor?: string;
  secondaryTextColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  menuButtonImageUrl?: string;
  footerImageUrl?: string;
  cardBackgroundColor?: string;
  cardTextColor?: string;
  mainPageImages?: ImageUrl[];
}

export interface ImageUrl {
  url: string;
  position: string;
  ranking: number;
}
