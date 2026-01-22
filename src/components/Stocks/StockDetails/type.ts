import { ReactNode } from "react";

export interface StockQuantityManagementProps {
  location: string;
  quantity: number;
  amount: number;
  status: string;
}
export interface StockHistoryProps {
  date: string | number;
  changedBy: string;
  reason: string;
  before: number;
  after: number;
  change: number | ReactNode;
  branch: string;
  summary: string;
}
export const StockQuantityManagementItems = [
  {
    location: "Lawanson",
    quantity: 20,
    amount: 150000,
    status: "In Stock",
  },
  {
    location: "Lawanson",
    quantity: 20,
    amount: 150000,
    status: "In Stock",
  },
];

export const StockHistoryList = [
  {
    date: "June 20, 2025",
    changedBy: "Damilare John",
    reason: "Sold",
    before: 20,
    after: 20,
    change: 20,
    branch: "Lawanson",
    summary: "Sold to: Adebayo Sarah (SS1 A)",
  },
  {
    date: "June 20, 2025",
    changedBy: "Damilare John",
    reason: "Sold",
    before: 20,
    after: 20,
    change: 20,
    branch: "Lawanson",
    summary: "Sold to: Adebayo Sarah (SS1 A)",
  },
  {
    date: "June 20, 2025",
    changedBy: "Damilare John",
    reason: "Sold",
    before: 20,
    after: 20,
    change: 20,
    branch: "Lawanson",
    summary: "Sold to: Adebayo Sarah (SS1 A)",
  },
  {
    date: "June 20, 2025",
    changedBy: "Damilare John",
    reason: "Sold",
    before: 20,
    after: 20,
    change: 20,
    branch: "Lawanson",
    summary: "Sold to: Adebayo Sarah (SS1 A)",
  },
];
