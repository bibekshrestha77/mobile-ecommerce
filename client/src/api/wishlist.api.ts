import instance from "./index";

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

export interface Product {
  _id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  stock: number;
  description: string;
  cover_image: {
    path: string;
    public_id: string;
  };
  images: Array<{
    path: string;
    public_id: string;
  }>;
  is_featured: boolean;
  new_arrival: boolean;
  category: { _id: string; name: string };
  brand: { _id: string; name: string };
}

// Toggle wishlist item (add/remove)
export const toggleWishlist = async (productId: string): Promise<WishlistResponse> => {
  try {
    const response = await instance.post("/wishlist", { product_id: productId });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Get user's wishlist
export const getWishlist = async (): Promise<WishlistResponse> => {
  try {
    const response = await instance.get("/wishlist");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Clear wishlist
export const clearWishlist = async (): Promise<WishlistResponse> => {
  try {
    const response = await instance.post("/wishlist/clear");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};