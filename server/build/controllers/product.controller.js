"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewArrivals = exports.getFeatured = exports.getProductByCategory = exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const asynchandler_utils_1 = require("../utils/asynchandler.utils");
const product_models_1 = __importDefault(require("../models/product.models"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const brand_model_1 = __importDefault(require("../models/brand.model"));
const category_models_1 = __importDefault(require("../models/category.models"));
const validation_utils_1 = require("../utils/validation.utils");
const dir = "/products";
//get all
exports.getAll = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, search, category, brand, minPrice, maxPrice, is_featured, new_arrival, sortBy = "createdAt", sortOrder = "desc", } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    // Build filter query
    const filter = {};
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
        if (minPrice)
            filter.price.$gte = Number(minPrice);
        if (maxPrice)
            filter.price.$lte = Number(maxPrice);
    }
    if (is_featured !== undefined) {
        filter.is_featured = is_featured === "true";
    }
    if (new_arrival !== undefined) {
        filter.new_arrival = new_arrival === "true";
    }
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    const [products, total] = await Promise.all([
        product_models_1.default.find(filter)
            .populate("category")
            .populate("brand")
            .sort(sort)
            .skip(skip)
            .limit(limitNum),
        product_models_1.default.countDocuments(filter),
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
exports.getById = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const product = await product_models_1.default.findOne({ _id: id }).populate('category').populate('brand');
    if (!product) {
        throw new error_handler_middleware_1.default("Product not found", 404);
    }
    res.status(200).json({
        data: product,
        message: "Product fetched",
        status: "success",
    });
});
//* create
exports.create = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { name, price, sale_price, description, category, brand, stock, is_featured, new_arrival, } = req.body;
    // Validation
    (0, validation_utils_1.validateRequiredFields)(req.body, [
        "name",
        "price",
        "description",
        "category",
        "brand",
        "stock",
    ]);
    (0, validation_utils_1.validateNumericFields)(req.body, ["price", "sale_price", "stock"]);
    (0, validation_utils_1.validatePositiveNumber)(price, "price");
    (0, validation_utils_1.validatePositiveNumber)(sale_price, "sale_price");
    (0, validation_utils_1.validatePositiveNumber)(stock, "stock");
    (0, validation_utils_1.validateBooleanFields)(req.body, ["is_featured", "new_arrival"]);
    if (sale_price !== undefined &&
        sale_price !== null &&
        sale_price !== "" &&
        Number(sale_price) >= Number(price)) {
        throw new error_handler_middleware_1.default("Sale price must be lower than the regular price", 400);
    }
    const files = req.files;
    if (!files || !files["cover_image"] || !files["cover_image"][0]) {
        throw new error_handler_middleware_1.default("Cover image is required", 400);
    }
    const { cover_image, images } = files;
    const product = new product_models_1.default({
        name,
        price: Number(price),
        sale_price: sale_price !== undefined && sale_price !== null && sale_price !== ""
            ? Number(sale_price)
            : null,
        description,
        is_featured: is_featured === "true" || is_featured === true,
        new_arrival: new_arrival === "true" || new_arrival === true,
        stock: Number(stock),
    });
    //* handle product brand
    const product_brand = await brand_model_1.default.findOne({ _id: brand });
    if (!product_brand) {
        throw new error_handler_middleware_1.default("Brand not found", 404);
    }
    product.brand = product_brand._id;
    //* handle product category
    const product_category = await category_models_1.default.findOne({ _id: category });
    if (!product_category) {
        throw new error_handler_middleware_1.default("Category not found", 404);
    }
    product.category = product_category._id;
    //* upload file
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0].path, dir);
    product.cover_image = { path, public_id };
    //* images
    if (images && images.length > 0) {
        const promises = images.map(async (image) => await (0, cloudinary_utils_1.upload)(image.path, dir));
        const product_images = await Promise.all(promises);
        product.images = product_images;
    }
    await product.save();
    res.status(201).json({
        message: "Product created",
        data: product,
        status: "success",
    });
});
//* update
exports.update = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, price, sale_price, description, category, brand, deleted_image, is_featured, new_arrival, stock, } = req.body;
    const files = req.files;
    const { cover_image, images } = files;
    // Validation for provided fields
    if (price !== undefined)
        (0, validation_utils_1.validatePositiveNumber)(price, "price");
    if (sale_price !== undefined && sale_price !== null && sale_price !== "") {
        (0, validation_utils_1.validatePositiveNumber)(sale_price, "sale_price");
    }
    if (stock !== undefined)
        (0, validation_utils_1.validatePositiveNumber)(stock, "stock");
    (0, validation_utils_1.validateNumericFields)(req.body, ["price", "sale_price", "stock"]);
    (0, validation_utils_1.validateBooleanFields)(req.body, ["is_featured", "new_arrival"]);
    //! find product by id
    const product = await product_models_1.default.findOne({ _id: id });
    //! throw error if product not found
    if (!product) {
        throw new error_handler_middleware_1.default("Product not found", 404);
    }
    // update body fields
    if (name)
        product.name = name;
    if (stock !== undefined)
        product.stock = Number(stock);
    if (price !== undefined) {
        product.price = Number(price);
    }
    // sale_price: explicit null/"" clears the discount; a number sets it
    if (sale_price !== undefined) {
        if (sale_price === null || sale_price === "") {
            product.set("sale_price", null);
        }
        else {
            const effectivePrice = Number(sale_price);
            const comparePrice = price !== undefined ? Number(price) : product.price;
            if (effectivePrice >= comparePrice) {
                throw new error_handler_middleware_1.default("Sale price must be lower than the regular price", 400);
            }
            product.sale_price = effectivePrice;
        }
    }
    if (description)
        product.description = description;
    if (is_featured !== undefined)
        product.is_featured = is_featured === "true" || is_featured === true;
    if (new_arrival !== undefined)
        product.new_arrival = new_arrival === "true" || new_arrival === true;
    //* update category
    if (category) {
        const new_category = await category_models_1.default.findOne({ _id: category });
        if (!new_category)
            throw new error_handler_middleware_1.default("Category not found", 404);
        product.category = new_category._id;
    }
    //* update brand
    if (brand) {
        const new_brand = await brand_model_1.default.findOne({ _id: brand });
        if (!new_brand)
            throw new error_handler_middleware_1.default("Brand not found", 404);
        product.brand = new_brand._id;
    }
    // update cover image
    if (cover_image && cover_image.length > 0) {
        await (0, cloudinary_utils_1.deleteFile)(product.cover_image?.public_id);
        const cover = await (0, cloudinary_utils_1.upload)(cover_image[0].path, dir);
        product.cover_image = cover;
    }
    //* update images
    //? delete changed image
    if (deleted_image && Array.isArray(deleted_image) && deleted_image.length > 0) {
        await Promise.all(deleted_image.map((public_id) => (0, cloudinary_utils_1.deleteFile)(public_id)));
        product.images = product.images?.filter((img) => !deleted_image.includes(img.public_id));
    }
    if (images && images.length > 0) {
        //? upload new images
        const uploaded_images = await Promise.all(images.map(async (img) => await (0, cloudinary_utils_1.upload)(img.path, dir)));
        //? update product images
        product.images = [...uploaded_images, ...product.images];
    }
    await product.save();
    res.status(200).json({
        message: "Product Updated",
        data: product,
        status: "success",
    });
});
// delete
exports.remove = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const product = await product_models_1.default.findOne({ _id: id });
    if (!product) {
        throw new error_handler_middleware_1.default("Product not found", 404);
    }
    await (0, cloudinary_utils_1.deleteFile)(product.cover_image.public_id);
    if (product.images && product.images.length > 0) {
        await Promise.all(product.images.map((img) => (0, cloudinary_utils_1.deleteFile)(img?.public_id || "")));
    }
    await product.deleteOne();
    res.status(200).json({
        message: "Product Deleted",
        data: null,
        status: "success",
    });
});
// get by category  -> category_id -> product.category === category_id 
exports.getProductByCategory = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const { category_id } = req.params;
    const products = await product_models_1.default.find({ category: category_id }).populate('category').populate('brand');
    res.status(200).json({
        message: 'Products by category fetched',
        data: products,
        status: 'success'
    });
});
//* get featured products
exports.getFeatured = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const products = await product_models_1.default.find({ is_featured: true }).populate('category').populate('brand');
    res.status(200).json({
        message: 'Featured products fetched',
        data: products,
        status: 'success'
    });
});
//* get new arrival products
exports.getNewArrivals = (0, asynchandler_utils_1.asyncHandler)(async (req, res) => {
    const products = await product_models_1.default.find({ new_arrival: true }).populate('category').populate('brand');
    res.status(200).json({
        message: 'New arrivals products fetched',
        data: products,
        status: 'success'
    });
});
