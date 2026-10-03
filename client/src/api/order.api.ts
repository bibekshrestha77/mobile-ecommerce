import instance from "./index";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  _id: string;
  product: string;
  name: string;
  /** Unit price actually paid at checkout */
  price: number;
  quantity: number;
  image?: { path: string; public_id: string };
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface Order {
  _id: string;
  user: string;
  order_number: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: "card" | "cod";
  card_last4?: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  is_paid: boolean;
  paid_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  message: string;
  status: string;
  data: Order[];
}

export interface OrderResponse {
  message: string;
  status: string;
  data: Order;
}

export interface CreateOrderInput {
  shipping_address: ShippingAddress;
  payment_method?: "card" | "cod";
  card_number?: string;
}

/** Place an order from the current cart. Prices are computed server-side. */
export const createOrder = async (input: CreateOrderInput): Promise<OrderResponse> => {
  const { data } = await instance.post<OrderResponse>("/orders", input);
  return data;
};

/** Current user's orders, newest first. */
export const getOrders = async (): Promise<OrdersResponse> => {
  const { data } = await instance.get<OrdersResponse>("/orders");
  return data;
};

/** Single order — must be owned by the current user (or admin). */
export const getOrder = async (id: string): Promise<OrderResponse> => {
  const { data } = await instance.get<OrderResponse>(`/orders/${id}`);
  return data;
};

/** Admin: all orders with pagination + optional status filter. */
export const getAllOrders = async (
  params: { page?: number; limit?: number; status?: string } = {}
): Promise<OrdersResponse & { pagination?: { page: number; limit: number; total: number; totalPages: number } }> => {
  const { data } = await instance.get("/orders/admin/all", { params });
  return data;
};

/** Admin: update fulfilment status. */
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<OrderResponse> => {
  const { data } = await instance.patch<OrderResponse>(`/orders/${id}/status`, {
    status,
  });
  return data;
};
