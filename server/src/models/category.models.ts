//name , description , image

import mongoose from "mongoose";

//? category schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
    },
    image: {
      type: {
        path: {
          type: String,
          required: [true, "Image path is required"],
        },
        public_id: {
          type: String,
          required: [true, "Image public_id is required"],
        },
      },
      required: false, // optional if category can exist without an image
    },
  },
  { timestamps: true }
);

//? category model
const Category = mongoose.model("category", categorySchema);

export default Category;
