import * as yup from 'yup';

//! login schema
export const loginSchema = yup.object({
  email: yup.string().email().required("email is required"),
  password: yup.string().required("password is required"),
});

//! register schema
export const registerSchema = yup.object({
  fullname: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  profile_image: yup.mixed().notRequired().test(
    "fileType",
    "Only image files are allowed",
    (value) => {
      if (!value) return true;
      if (value instanceof FileList && value.length > 0) {
        return ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(value[0].type);
      }
      return true;
    }
  ).test(
    "fileSize",
    "File size must be less than 5MB",
    (value) => {
      if (!value) return true;
      if (value instanceof FileList && value.length > 0) {
        return value[0].size <= 5 * 1024 * 1024;
      }
      return true;
    }
  ),
});