import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/category.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();
const upload = uploadFile();

//get all
router.get("/", getAll);

//create
router.post("/", upload.single("image"), authenticate(), create);

//get by id
router.get("/:id", getById);

//upload
router.put("/:id", upload.single("image"), update);

//delete
router.delete("/:id", remove);

export default router;
