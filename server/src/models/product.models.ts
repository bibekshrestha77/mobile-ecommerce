import mongoose from "mongoose";

//* name description price sale_price , is_featured -> boolean , new_arrival -> boolean

//* _id createdAt , updatedAt

//TODO: category brand cover_image , images
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true, // ' abc '  => 'abc'
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    // Optional discounted price — when set and lower than price, product is "on sale"
    sale_price: {
      type: Number,
      default: null,
      min: [0, "Sale price cannot be negative"],
      validate: {
        validator: function (this: any, value: number) {
          if (value === null || value === undefined) return true;
          return value < (this.price as number);
        },
        message: "Sale price must be lower than the regular price",
      },
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: 25,
      trim: true,
    },
    cover_image: {
      type: {
        path: {
          type: String,
          required: [true, "cover image path is required"],
        },
        public_id: {
          type: String,
          required: [true, "cover image public_id is required"],
        },
      },
      required: [true, "Cover image is required"],
    },

    images: [
      {
        path: String,
        public_id: String,
      },
    ],
    is_featured: {
      type: Boolean,
      default: false,
    },
    new_arrival: {
      type: Boolean,
      default: false,
    },

    // ref to category collection
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category is required"],
    },

    // ref to brand collection
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
      required: [true, "Brand is required"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);
export default Product;
