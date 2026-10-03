import { Request, Response, Express } from "express";
import { asyncHandler } from "../utils/asynchandler.utils";
import Product from "../models/product.models";
import CustomError from "../middlewares/error_handler.middleware";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import Brand from "../models/brand.model";
import Category from "../models/category.models";
import {
  validateRequiredFields,
  validateNumericFields,
  validatePositiveNumber,
  validateBooleanFields,
} from "../utils/validation.utils";

const dir = "/products";

//get all
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    is_featured,
    new_arrival,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const filter: any = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = brand;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (is_featured !== undefined) {
    filter.is_featured = is_featured === "true";
  }

  if (new_arrival !== undefined) {
    filter.new_arrival = new_arrival === "true";
  }

  // Build sort
  const sort: any = {};
  sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category")
      .populate("brand")
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    data: products,
    message: "Products fetched",
    status: "success",
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// get by id
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id }).populate('category').populate('brand');

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  res.status(200).json({
    data: product,
    message: "Product fetched",
    status: "success",
  });
});


//* create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    price,
    sale_price,
    description,
    category,
    brand,
    stock,
    is_featured,
    new_arrival,
  } = req.body;

  // Validation
  validateRequiredFields(req.body, [
    "name",
    "price",
    "description",
    "category",
    "brand",
    "stock",
  ]);
  validateNumericFields(req.body, ["price", "sale_price", "stock"]);
  validatePositiveNumber(price, "price");
  validatePositiveNumber(sale_price, "sale_price");
  validatePositiveNumber(stock, "stock");
  validateBooleanFields(req.body, ["is_featured", "new_arrival"]);

  if (
    sale_price !== undefined &&
    sale_price !== null &&
    sale_price !== "" &&
    Number(sale_price) >= Number(price)
  ) {
    throw new CustomError("Sale price must be lower than the regular price", 400);
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files || !files["cover_image"] || !files["cover_image"][0]) {
    throw new CustomError("Cover image is required", 400);
  }

  const { cover_image, images } = files;

  const product = new Product({
    name,
    price: Number(price),
    sale_price:
      sale_price !== undefined && sale_price !== null && sale_price !== ""
        ? Number(sale_price)
        : null,
    description,
    is_featured: is_featured === "true" || is_featured === true,
    new_arrival: new_arrival === "true" || new_arrival === true,
    stock: Number(stock),
  });

  //* handle product brand
  const product_brand = await Brand.findOne({ _id: brand });
  if (!product_brand) {
    throw new CustomError("Brand not found", 404);
  }
  product.brand = product_brand._id;

  //* handle product category
  const product_category = await Category.findOne({ _id: category });
  if (!product_category) {
    throw new CustomError("Category not found", 404);
  }
  product.category = product_category._id;

  //* upload file
  const { path, public_id } = await upload(cover_image[0].path, dir);
  product.cover_image = { path, public_id };

  //* images
  if (images && images.length > 0) {
    const promises = images.map(async (image) => await upload(image.path, dir));
    const product_images = await Promise.all(promises);
    product.images = product_images as any;
  }

  await product.save();

  res.status(201).json({
    message: "Product created",
    data: product,
    status: "success",
  });
});

//* update
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    price,
    sale_price,
    description,
    category,
    brand,
    deleted_image,
    is_featured,
    new_arrival,
    stock,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const { cover_image, images } = files;

  // Validation for provided fields
  if (price !== undefined) validatePositiveNumber(price, "price");
  if (sale_price !== undefined && sale_price !== null && sale_price !== "") {
    validatePositiveNumber(sale_price, "sale_price");
  }
  if (stock !== undefined) validatePositiveNumber(stock, "stock");
  validateNumericFields(req.body, ["price", "sale_price", "stock"]);
  validateBooleanFields(req.body, ["is_featured", "new_arrival"]);

  //! find product by id
  const product = await Product.findOne({ _id: id });

  //! throw error if product not found
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  // update body fields
  if (name) product.name = name;
  if (stock !== undefined) product.stock = Number(stock);
  if (price !== undefined) {
    product.price = Number(price);
  }
  // sale_price: explicit null/"" clears the discount; a number sets it
  if (sale_price !== undefined) {
    if (sale_price === null || sale_price === "") {
      product.set("sale_price", null);
    } else {
      const effectivePrice = Number(sale_price);
      const comparePrice =
        price !== undefined ? Number(price) : (product.price as number);
      if (effectivePrice >= comparePrice) {
        throw new CustomError("Sale price must be lower than the regular price", 400);
      }
      product.sale_price = effectivePrice;
    }
  }
  if (description) product.description = description;
  if (is_featured !== undefined) product.is_featured = is_featured === "true" || is_featured === true;
  if (new_arrival !== undefined) product.new_arrival = new_arrival === "true" || new_arrival === true;

  //* update category
  if (category) {
    const new_category = await Category.findOne({ _id: category });
    if (!new_category) throw new CustomError("Category not found", 404);
    product.category = new_category._id;
  }

  //* update brand
  if (brand) {
    const new_brand = await Brand.findOne({ _id: brand });
    if (!new_brand) throw new CustomError("Brand not found", 404);
    product.brand = new_brand._id;
  }

  // update cover image
  if (cover_image && cover_image.length > 0) {
    await deleteFile(product.cover_image?.public_id);
    const cover = await upload(cover_image[0].path, dir);
    product.cover_image = cover;
  }

  //* update images
  //? delete changed image
  if (deleted_image && Array.isArray(deleted_image) && deleted_image.length > 0) {
    await Promise.all(deleted_image.map((public_id) => deleteFile(public_id)));
    product.images = product.images?.filter(
      (img) => !deleted_image.includes(img.public_id)
    ) as any;
  }

  if (images && images.length > 0) {
    //? upload new images
    const uploaded_images = await Promise.all(
      images.map(async (img) => await upload(img.path, dir))
    );
    //? update product images
    product.images = [...uploaded_images, ...product.images] as any;
  }

  await product.save();

  res.status(200).json({
    message: "Product Updated",
    data: product,
    status: "success",
  });
});

// delete
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  await deleteFile(product.cover_image.public_id);

  if (product.images && product.images.length > 0) {
    await Promise.all(
      product.images.map((img) => deleteFile(img?.public_id || ""))
    );
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product Deleted",
    data: null,
    status: "success",
  });
});


// get by category  -> category_id -> product.category === category_id 
export const getProductByCategory = asyncHandler(async (req: Request, res: Response) => {
  
  const { category_id } = req.params

  const products = await Product.find({ category: category_id }).populate('category').populate('brand')


  res.status(200).json({
    message: 'Products by category fetched',
    data: products,
    status:'success'
  })


  
})

//* get featured products
export const getFeatured = asyncHandler(async(req:Request,res:Response) => {
  
  const products = await Product.find({is_featured:true}).populate('category').populate('brand')

    res.status(200).json({
    message: 'Featured products fetched',
    data: products,
    status:'success'
  })

})

//* get new arrival products
export const getNewArrivals = asyncHandler(async(req:Request,res:Response) => {
  
  const products = await Product.find({new_arrival:true}).populate('category').populate('brand')

    res.status(200).json({
    message: 'New arrivals products fetched',
    data: products,
    status:'success'
  })

})