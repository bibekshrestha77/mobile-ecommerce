import instance from "./index";

//! mutation function
export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await instance.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

//!register user
export const registerUser = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  profile_image?: File;
}) => {
  try {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.phone) formData.append("phone", data.phone);
    if (data.profile_image) formData.append("profile_image", data.profile_image);

    const response = await instance.post("/auth/register", formData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

//! get current user
export const getMe = async () => {
  try {
    const response = await instance.get("/auth/me");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

//! update profile (name / phone)
export const updateProfile = async (data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}) => {
  try {
    const response = await instance.put("/auth/profile", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

//! change password
export const changePassword = async (data: {
  current_password: string;
  new_password: string;
}) => {
  try {
    const response = await instance.post("/auth/change-password", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

//! logout
export const logout = async () => {
  try {
    const response = await instance.post("/auth/logout");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};