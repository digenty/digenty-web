export const stocksItems = [
  {
    id: 1,
    itemName: "Fuel",
    category: "SS 3 Items",
    quantity: 20,
    amount: 150000,
    currency: "₦",
    status: "In Stock",
    lastUpdated: "2025-06-20",
  },
  {
    id: 2,
    itemName: "Fuel",
    category: "SS 3 Items",
    quantity: 20,
    amount: 150000,
    currency: "₦",
    status: "In Stock",
    lastUpdated: "2025-06-20",
  },
  {
    id: 3,
    itemName: "Fuel",
    category: "SS 3 Items",
    quantity: 20,
    amount: 150000,
    currency: "₦",
    status: "Low Stock",
    lastUpdated: "2025-06-20",
  },
  {
    id: 4,
    itemName: "Fuel",
    category: "SS 3 Items",
    quantity: 20,
    amount: 150000,
    currency: "₦",
    status: "In Stock",
    lastUpdated: "2025-06-20",
  },
  {
    id: 5,
    itemName: "Fuel",
    category: "SS 3 Items",
    quantity: 20,
    amount: 150000,
    currency: "₦",
    status: "Out of Stock",
    lastUpdated: "2025-06-20",
  },
];

export interface stocksItemsProps {
  id: number;
  itemName: string;
  category: string;
  quantity: number;
  amount: number;
  currency: string;
  status: string;
  lastUpdated: string;
}
