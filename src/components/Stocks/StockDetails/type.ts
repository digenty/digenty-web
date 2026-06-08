import { StockAdjustReason, StockStatus } from "@/api/stock";

export interface StockDetailResponse {
  id: number;
  name?: string;
  itemName?: string;
  description?: string;
  imagePath?: string;
  image?: string;
  category?: { id?: number; name?: string } | null;
  categoryName?: string;
  categoryId?: number;
  unit?: { id?: number; name?: string } | null;
  unitName?: string;
  stockUnitId?: number;
  quantity?: number;
  totalQuantity?: number;
  price?: number;
  costPrice?: number;
  branchId?: number;
  branchName?: string;
  branch?: { id?: number; name?: string } | null;
  totalSold?: number;
  totalRemoved?: number;
  totalReturned?: number;
  status?: StockStatus;
  stockStatus?: StockStatus;
  branchStocks?: StockBranchEntry[];
  branches?: StockBranchEntry[];
  createdAt?: string;
  updatedAt?: string;
  lastModified?: string;
  dateAdded?: string;
}

export interface StockBranchEntry {
  id?: number;
  branchId?: number;
  branchName?: string;
  branch?: { id?: number; name?: string } | null;
  location?: string;
  quantity?: number;
  amount?: number;
  price?: number;
  status?: string;
  stockStatus?: StockStatus;
  lastModified?: string;
  dateAdded?: string;
}

export interface StockTransactionRecord {
  id: number;
  date?: string;
  createdAt?: string;
  changedBy?: string;
  userName?: string;
  user?: { name?: string; id?: number } | null;
  reason?: StockAdjustReason | string;
  before?: number;
  quantityBefore?: number;
  after?: number;
  quantityAfter?: number;
  change?: number;
  quantityAdjustment?: number;
  branch?: string;
  branchName?: string;
  summary?: string;
  type?: "INCREASE" | "DECREASE";
  itemName?: string;
  imagePath?: string;
}

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
  change: number;
  branch: string;
  summary: string;
}
