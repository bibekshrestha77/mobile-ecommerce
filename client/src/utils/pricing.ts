import type { Product } from "../api/product.api";

/** The price a customer actually pays (sale price when active, otherwise regular) */
export const effectivePrice = (product: Pick<Product, "price" | "sale_price">): number =>
  product.sale_price != null && product.sale_price < product.price
    ? product.sale_price
    : product.price;

/** Percentage discount, or 0 when the product is not on sale */
export const discountPercent = (product: Pick<Product, "price" | "sale_price">): number => {
  if (product.sale_price == null || product.sale_price >= product.price) return 0;
  if (product.price <= 0) return 0;
  return Math.round(((product.price - product.sale_price) / product.price) * 100);
};

export const isOnSale = (product: Pick<Product, "price" | "sale_price">): boolean =>
  discountPercent(product) > 0;
