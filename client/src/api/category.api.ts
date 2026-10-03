import instance from "./index";

// Category types
export interface Category {
  _id: string;
  name: string;
  description: string;
  image?: {
    path: string;
    public_id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  message: string;
  status: string;
  data: Category | Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Get all categories
export const getCategories = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<CategoryResponse> => {
  try {
    const response = await instance.get("/categories", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<CategoryResponse> => {
  try {
    const response = await instance.get(`/categories/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Create category (Admin)
export const createCategory = async (formData: FormData): Promise<CategoryResponse> => {
  try {
    const response = await instance.post("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Update category (Admin)
export const updateCategory = async (
  id: string,
  formData: FormData
): Promise<CategoryResponse> => {
  try {
    const response = await instance.put(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Delete category (Admin)
export const deleteCategory = async (id: string): Promise<CategoryResponse> => {
  try {
    const response = await instance.delete(`/categories/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};