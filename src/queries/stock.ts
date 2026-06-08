import { StockStatus } from "@/api/stock";

export const stockKeys = {
  all: ["stocks"] as const,
  search: (branchId: number, search?: string, page?: number, size?: number) => ["stocks", "search", branchId, search, page, size] as const,
  byBranch: (branchId: number, page?: number, size?: number) => ["stocks", "branch", branchId, page, size] as const,
  byStatus: (status?: StockStatus) => ["stocks", "status", status] as const,
  byName: (name?: string) => ["stocks", "name", name] as const,
  byCategory: (category?: string | number) => ["stocks", "category", category] as const,
  detail: (id: number) => ["stocks", "detail", id] as const,

  transactions: (stockId: number, page?: number, size?: number) => ["stockTransactions", stockId, page, size] as const,

  units: (page?: number, size?: number) => ["stockUnits", page, size] as const,
  unitSizes: (page?: number, size?: number) => ["stockUnits", "size", page, size] as const,

  categories: (page?: number, size?: number) => ["stockCategories", page, size] as const,
  categoryByName: (name?: string) => ["stockCategories", "name", name] as const,

  settings: (branchId?: number) => ["stockSettings", branchId] as const,

  createStock: ["createStock"] as const,
  editStock: ["editStock"] as const,
  deleteStock: ["deleteStock"] as const,
  adjustQuantity: ["adjustStockQuantity"] as const,

  createUnit: ["createStockUnit"] as const,
  editUnit: ["editStockUnit"] as const,
  deleteUnit: ["deleteStockUnit"] as const,

  createCategory: ["createStockCategory"] as const,
  editCategory: ["editStockCategory"] as const,
  deleteCategory: ["deleteStockCategory"] as const,

  updateSettings: ["updateStockSettings"] as const,
};

export const STOCK_STATUS_CONFIG = {
  IN_STOCK: { label: "In Stock", className: "bg-bg-badge-green text-bg-basic-green-strong" },
  LOW_STOCK: { label: "Low Stock", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  OUT_OF_STOCK: { label: "Out of Stock", className: "bg-bg-badge-red text-bg-basic-red-strong" },
} as const;
