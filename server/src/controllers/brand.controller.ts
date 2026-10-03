import { Request, Response } from "express";
import { asyncHandler } from "../utils/asynchandler.utils";
import Brand from "../models/brand.model";
import CustomError from "../middlewares/error_handler.middleware";
import { deleteFile, upload } from "../utils/cloudinary.utils";

const dir = "/brand";

//get all
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.find({});

  res.status(200).json({
    message: "Brand fetched",
    status: "success",
    data: brand,
  });
});

//get by id
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("Brand not found", 404);
  }
   res.status(200).json({
    message: "Brand fetched",
    status: "success",
    data: brand,
  });
});

//create 
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const file = req.file;

  if (!file) {
    throw new CustomError("image is required", 400);
  }

  const brand = new Brand({ name, description });

  const { path, public_id } = await upload(file.path, dir);

  brand.image = {
    path,
    public_id,
  };

  brand.save();

  res.status(201).json({
    message: "Brand created",
    status: "success",
    data: brand,
  });
});

//update
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file;

  const brand = await Brand.findOne({ _id: id });

  if (!brand) {
    throw new CustomError("Brand not found", 400);
  }

  if (name) {
    brand.name = name;
  }

  if (description) {
    brand.description = description;
  }

  if (file) {
    if (brand.image) {
      //delete old image
      await deleteFile(brand.image?.public_id as string);
    }
    //upload new image
    const { path, public_id } = await upload(file.path, dir);
    brand.image = {
      path,
      public_id,
    };

    await brand.save();

    res.status(201).json({
      message: "Brand updated",
      data: brand,
      status: "success",
    });
  }
});

//delete
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("Brand not found", 404);
  }

  // Delete image from Cloudinary if it exists
  if (brand.image && brand.image.public_id) {
    await deleteFile(brand.image.public_id);
  }

  await brand.deleteOne();

  res.status(200).json({
    message: "Brand deleted successfully",
    status: "success",
  });
});

