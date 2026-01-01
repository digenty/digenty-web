export interface ClassFeeTypes {
  id: number;
  classname: string;
  fee: { tution: string; item: string; count: number };
  totalAmount: number;
}

export const classesFee: {
  title: string;
  clasess: ClassFeeTypes[];
}[] = [
  {
    title: "Lawanson",
    clasess: [
      { id: 1, classname: "JSS 1", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 23000 },
      { id: 2, classname: "JSS 2", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 26000 },
      { id: 3, classname: "JSS 3", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 29000 },
      { id: 4, classname: "SSS 1", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 31000 },
      { id: 5, classname: "SSS 2", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 35000 },
      { id: 6, classname: "SSS 3", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 36000 },
    ],
  },
  {
    title: "Ilasamaja",
    clasess: [
      { id: 7, classname: "JSS 1", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 24000 },
      { id: 8, classname: "JSS 2", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 27000 },
      { id: 9, classname: "JSS 3", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 30000 },
      { id: 10, classname: "SSS 1", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 32000 },
      { id: 11, classname: "SSS 2", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 36000 },
      { id: 12, classname: "SSS 3", fee: { tution: "Tution", item: "School Uniform", count: 20 }, totalAmount: 37000 },
    ],
  },
];
