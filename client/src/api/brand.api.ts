import instance from "./index";

// Brand types
export interface Brand {
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

export interface BrandResponse {
  message: string;
  status: string;
  data: Brand | Brand[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Get all brands
export const getBrands = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<BrandResponse> => {
  try {
    const response = await instance.get("/brands", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Get brand by ID
export const getBrandById = async (id: string): Promise<BrandResponse> => {
  try {
    const response = await instance.get(`/brands/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Create brand (Admin)
export const createBrand = async (formData: FormData): Promise<BrandResponse> => {
  try {
    const response = await instance.post("/brands", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Update brand (Admin)
export const updateBrand = async (
  id: string,
  formData: FormData
): Promise<BrandResponse> => {
  try {
    const response = await instance.put(`/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Delete brand (Admin)
export const deleteBrand = async (id: string): Promise<BrandResponse> => {
  try {
    const response = await instance.delete(`/brands/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};