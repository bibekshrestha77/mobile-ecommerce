import instance from "./index";

// Cart types
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  total_amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  message: string;
  status: string;
  data: Cart;
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

// Add item to cart
export const addToCart = async (
  productId: string,
  quantity: number = 1
): Promise<CartResponse> => {
  try {
    const response = await instance.post("/cart", { product_id: productId, quantity });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Get user's cart
export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await instance.get("/cart");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Remove item from cart
export const removeFromCart = async (productId: string): Promise<CartResponse> => {
  try {
    const response = await instance.post("/cart/remove", { product: productId });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Clear cart
export const clearCart = async (): Promise<CartResponse> => {
  try {
    const response = await instance.post("/cart/clear");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};