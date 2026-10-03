import axios from "axios";
import instance from "./index";

const rethrowApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) throw error.response?.data ?? error;
  throw error;
};

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
  } catch (error: unknown) {
    return rethrowApiError(error);
  }
};

// Get user's cart
export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await instance.get("/cart");
    return response.data;
  } catch (error: unknown) {
    return rethrowApiError(error);
  }
};

/** Add a quantity to the existing line, accounting for the API's set-quantity behavior. */
export const addCartQuantity = async (
  productId: string,
  quantity: number = 1,
  stockLimit?: number
): Promise<CartResponse> => {
  const cart = await getCart();
  const existingQuantity = cart.data.items.find(
    (item) => item.product?._id === productId
  )?.quantity ?? 0;
  const nextQuantity = existingQuantity + quantity;

  if (stockLimit !== undefined && nextQuantity > stockLimit) {
    throw new Error(`Only ${stockLimit} of this item are available.`);
  }

  return addToCart(productId, nextQuantity);
};

// Remove item from cart
export const removeFromCart = async (productId: string): Promise<CartResponse> => {
  try {
    const response = await instance.post("/cart/remove", { product: productId });
    return response.data;
  } catch (error: unknown) {
    return rethrowApiError(error);
  }
};

// Clear cart
export const clearCart = async (): Promise<CartResponse> => {
  try {
    const response = await instance.post("/cart/clear");
    return response.data;
  } catch (error: unknown) {
    return rethrowApiError(error);
  }
};