import instance from "./index";

// Product types
export interface ProductImage {
  path: string;
  public_id: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  image?: {
    path: string;
    public_id: string;
  };
}

export interface Brand {
  _id: string;
  name: string;
  description: string;
  image?: {
    path: string;
    public_id: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  /** Discounted price when the product is on sale, otherwise null/undefined */
  sale_price?: number | null;
  stock: number;
  description: string;
  cover_image: ProductImage;
  images: ProductImage[];
  is_featured: boolean;
  new_arrival: boolean;
  category: Category;
  brand: Brand;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  message: string;
  status: string;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  message: string;
  status: string;
  data: Product;
}

// Get all products with pagination, search, filter
export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  is_featured?: boolean;
  new_arrival?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ProductsResponse> => {
  try {
    const response = await instance.get("/products", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await instance.get(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<ProductsResponse> => {
  try {
    const response = await instance.get("/products/featured");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Get new arrival products
export const getNewArrivals = async (): Promise<ProductsResponse> => {
  try {
    const response = await instance.get("/products/new-arrivals");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Get products by category
export const getProductsByCategory = async (
  categoryId: string
): Promise<ProductsResponse> => {
  try {
    const response = await instance.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Create product (Admin)
export const createProduct = async (formData: FormData): Promise<ProductResponse> => {
  try {
    const response = await instance.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Update product (Admin)
export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<ProductResponse> => {
  try {
    const response = await instance.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Delete product (Admin)
export const deleteProduct = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await instance.delete(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};