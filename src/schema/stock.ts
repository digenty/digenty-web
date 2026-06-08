import * as yup from "yup";

export const stockSchema = yup.object().shape({
  name: yup.string().trim().required("Item name is required"),
  description: yup.string().trim().required("Description is required"),
  categoryId: yup.number().typeError("Category is required").required("Category is required").min(1, "Category is required"),
  imagePath: yup.string().trim().required("Image is required"),
  stockUnitId: yup.number().typeError("Unit is required").required("Unit is required").min(1, "Unit is required"),
  quantity: yup.number().typeError("Quantity is required").required("Quantity is required").min(0, "Quantity must be 0 or more"),
  price: yup.number().typeError("Price is required").required("Price is required").min(0, "Price must be 0 or more"),
  costPrice: yup.number().typeError("Cost price is required").required("Cost price is required").min(0, "Cost price must be 0 or more"),
  branchId: yup.number().typeError("Branch is required").required("Branch is required").min(1, "Branch is required"),
});

export const editStockSchema = yup.object().shape({
  stockId: yup.number().required().min(1),
  name: yup.string().trim().required("Item name is required"),
  description: yup.string().trim().required("Description is required"),
  categoryId: yup.number().typeError("Category is required").required("Category is required").min(1, "Category is required"),
  imagePath: yup.string().trim(),
  stockUnitId: yup.number().typeError("Unit is required").required("Unit is required").min(1, "Unit is required"),
  quantity: yup.number().typeError("Quantity is required").required("Quantity is required").min(0, "Quantity must be 0 or more"),
  price: yup.number().typeError("Price is required").required("Price is required").min(0, "Price must be 0 or more"),
  costPrice: yup.number().typeError("Cost price is required").required("Cost price is required").min(0, "Cost price must be 0 or more"),
});

export const stockCategorySchema = yup.object().shape({
  name: yup.string().trim().required("Category name is required"),
});

export const stockUnitSchema = yup.object().shape({
  name: yup.string().trim().required("Unit name is required"),
  description: yup.string().trim().required("Description is required"),
});

export const stockSettingsSchema = yup.object().shape({
  lowStockThreshold: yup.number().typeError("Threshold is required").required("Threshold is required").min(0, "Threshold must be 0 or more"),
  lowStockAlertEnabled: yup.boolean().required(),
});

export const adjustQuantitySchema = yup.object().shape({
  stockId: yup.number().required().min(1),
  quantityAdjustment: yup.number().typeError("Adjustment is required").required("Adjustment is required"),
  reason: yup
    .string()
    .oneOf(["RESTOCK", "DONATION", "RETURNED", "CORRECTION_OF_PREVIOUS_ERROR", "TRANSFER_FROM_ANOTHER_BRANCH", "RECOVERED_ITEMS"])
    .required("Reason is required"),
});
