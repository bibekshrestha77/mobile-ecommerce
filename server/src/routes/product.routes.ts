import express from "express";
import {
  create,
  getAll,
  getById,
  getFeatured,
  getNewArrivals,
  getProductByCategory,
  remove,
  update,
} from "../controllers/product.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

const router = express.Router();

const upload = uploadFile();

//get all
router.get("/", getAll);

// create
router.post(
  "/",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 6,
    },
  ]),
  authenticate([Role.ADMIN]), // ['ADMIN]
  create
);
//* update
router.put(
  "/:id",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 6,
    },
  ]),
  authenticate([Role.ADMIN]), 

  update
);

//* delete
router.delete("/:id", authenticate([Role.ADMIN]), remove);

//* get by category
router.get("/category/:category_id", getProductByCategory); // http://localhost:8000/api/products/category/123 -> get

//* get featured products
router.get("/featured", getFeatured);

//* get new arrival products
router.get("/new-arrivals", getNewArrivals);

//* get by id
router.get("/:id", getById); // http://localhost:8000/api/products/axyskhdsjfj -> get

export default router;