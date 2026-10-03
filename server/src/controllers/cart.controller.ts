import { Request, Response } from "express";
import { asyncHandler } from "../utils/asynchandler.utils";
import Product from "../models/product.models";
import CustomError from "../middlewares/error_handler.middleware";
import Cart from "../models/cart.models";

// create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?._id;
  const { product_id, quantity = 1 } = req.body;
  let cart = null;

  const product = await Product.findOne({ _id: product_id });

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  cart = await Cart.findOne({ user: user_id });

  if (cart) {
    //*  if cart already created for user

    const product_exists = cart.items.find(
      (item) => item.product.toString() === product._id.toString()
    );

    if (product_exists) {
      product_exists.quantity = Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(quantity),
      });
    }
  } else {
    //* if cart not exists for user
    cart = new Cart({
      user: user_id,
      items: [{ product: product._id, quantity: Number(quantity) }],
    });
  }

  //* calculate total amount
  await cart.populate("items.product");
  cart.total_amount = cart.items.reduce((acc: number, item: any) => {
    return acc + (item.product.sale_price ?? item.product.price) * item.quantity;
  }, 0);

  //*   save cart
  await cart.save();

  res.status(201).json({
    message: "Product added to cart",
    data: cart,
    status: "success",
  });
});

//* get cart [user]
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?._id;

  const cart = await Cart.findOne({
    user: user,
  })
    .populate("user")
    .populate("items.product");

  if (!cart) {
    // A user with no cart yet simply has an empty cart — not an error
    res.status(200).json({
      message: "Cart fetched",
      data: { user: user, items: [], total_amount: 0 },
      status: "success",
    });
    return;
  }
  //* calculate  total amount

  cart.total_amount = cart.items.reduce((acc: number, item: any) => {
    return acc + ((item.product?.sale_price ?? item.product?.price) || 0) * item.quantity;
  }, 0);

  await cart.save();

  res.status(200).json({
    message: "Cart fetched",
    data: cart,
    status: "success",
  });
});

//* remove product from cart
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?._id;
  const { product } = req.body;

  const cart = await Cart.findOne({ user: user });
  if (!cart) {
    // Nothing to remove — return an empty cart rather than failing
    res.status(200).json({
      message: "Cart fetched",
      data: { user: user, items: [], total_amount: 0 },
      status: "success",
    });
    return;
  }

  const items = cart.items.filter(
    (item) => item.product?.toString() !== product.toString()
  );

  cart.items = items as any;

  //* calculate total amount
  await cart.populate("items.product");
  cart.total_amount = cart.items.reduce((acc: number, item: any) => {
    return acc + ((item.product?.sale_price ?? item.product?.price) || 0) * item.quantity;
  }, 0);

  await cart.save();

  res.status(200).json({
    message: "Product removed from cart",
    data: cart,
    status: "success",
  });
});

//* clear all
export const clear = asyncHandler(async(req: Request, res:Response) => {
   const user = req.user?._id;
   
   await Cart.findOneAndDelete({ user: user });

   res.status(200).json({
     message: "Cart cleared",
     data: null,
     status: "success",
   });
})