import { Request, Response } from "express";
import { asyncHandler } from "../utils/asynchandler.utils";
import WishList from "../models/wishlist.model";
import Product from "../models/product.models";
import CustomError from "../middlewares/error_handler.middleware";

//* create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.body;
  const user_id = req.user?._id;
  let wishlist = null;

  const product = await Product.findOne({ _id: product_id });

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  const is_exists = await WishList.findOne({
    user: user_id,
    product: product_id,
  });

  if (is_exists) {
    await is_exists.deleteOne();
  } else {
    wishlist = await WishList.create({ user: user_id, product: product._id });
  }

  res.status(201).json({
    message: is_exists
      ? "Prduct removed from wishlist"
      : "Prduct added to wishlist",
    data: wishlist,
    status: "success",
  });
});

//* clear list
export const clearAll = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?._id;

  await WishList.deleteMany({ user: user_id });

  res.status(200).json({
    message: "Wislist cleared.",
    data: null,
    status: "success",
  });
});

//* get all
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?._id;

  const list = await WishList.find({ user: user_id }).populate('user').populate('product');

  res.status(200).json({
    message: "Wislist fetched.",
    data: list,
    status: "success",
  });
});
