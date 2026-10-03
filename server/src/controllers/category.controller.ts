import { Request, Response } from "express";
import { asyncHandler } from "../utils/asynchandler.utils";
import Category from "../models/category.models";
import CustomError from "../middlewares/error_handler.middleware";
import { deleteFile, upload } from "../utils/cloudinary.utils";

const dir = "/categories";

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.find({});

  res.status(200).json({
    message: "Category fetched",
    status: "success",
    data: category,
  });
});

//get by id
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; //id = req.params.id
  const category = await Category.findById(id);

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  res.status(200).json({
    message: "Category fetched",
    status: "success",
    data: category,
  });
});

//create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const file = req.file;

  if (!file) {
    throw new CustomError("image is required", 400);
  }

  const category = new Category({ name, description });

  const { path, public_id } = await upload(file.path, dir);

  category.image = {
    path,
    public_id,
  };

  category.save();

  res.status(201).json({
    message: "Category created",
    status: "success",
    data: category,
  });
});

//update
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file;

  const category = await Category.findOne({ _id: id });

  if (!category) {
    throw new CustomError("Category not found", 400);
  }

  if (name) {
    category.name = name;
  }

  if (description) {
    category.description = description;
  }

  if (file) {
    if (category.image) {
      //delete old image
      await deleteFile(category.image?.public_id as string);
    }
    //upload new image
    const { path, public_id } = await upload(file.path, dir);
    category.image = {
      path,
      public_id,
    };

    await category.save();

    res.status(201).json({
      message: "Category updated",
      data: category,
      status: "success",
    });
  }
});

//delete
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  // Delete image from Cloudinary if it exists
  if (category.image && category.image.public_id) {
    await deleteFile(category.image.public_id);
  }

  await category.deleteOne();

  res.status(200).json({
    message: "Category deleted successfully",
    status: "success",
  });
});
