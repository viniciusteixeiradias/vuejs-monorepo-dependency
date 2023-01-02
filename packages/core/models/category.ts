enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

interface DayAvailable {
  day: DayOfWeek;
  start: string;
  end: string;
}

export interface Category {
  name: string;
  description: string;
  rank: number;
  displayIn: string[];
  vat: number;
  discount: number;
  fontColor: string;
  bgColor1: string;
  bgColor2: string;
  composeName: boolean;
  printGroupName: string;
  alwaysAvailable: boolean;
  daysAvailable: DayAvailable[];
  uuid: string;
  children: Category[];
  parent?: Category;
  printRank: number;
}
