import axios from "axios";
import instance from "./index";
import type { Product } from "./product.api";

const rethrowApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) throw error.response?.data ?? error;
  throw error;
};

// Wishlist types
export interface WishlistItem {
  _id: string;
  user: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  message: string;
  status: string;
  data: WishlistItem | WishlistItem[] | null;
}

// Toggle wishlist item (add/remove)
export const toggleWishlist = async (productId: string): Promise<WishlistResponse> => {
  try {
    const response = await instance.post("/wishlist", { product_id: productId });
    return response.data;
  } catch (error: unknown) {
    return rethrowApiError(error);
  }
};

// Get user's wishlist
export const getWishlist = async (): Promise<WishlistResponse> => {
  try {
    const response = await instance.get("/wishlist");
    return response.data;
  } catch (error: unknown) {
    return rethrowApiError(error);
  }
};

// Clear wishlist
export const clearWishlist = async (): Promise<WishlistResponse> => {
  try {
    const response = await instance.post("/wishlist/clear");
    return response.data;
  } catch (error: unknown) {
    return rethrowApiError(error);
  }
};