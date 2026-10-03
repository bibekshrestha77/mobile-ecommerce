import express from "express";
import multer from "multer";
import { login, register, me, logout, updateProfile, changePassword } from "../controllers/auth.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

//creating multer instance

const router = express.Router();
const upload = uploadFile();

router.post("/register", upload.single("profile_image"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate([Role.ADMIN, Role.USER]), me);
router.put("/profile", authenticate([Role.ADMIN, Role.USER]), updateProfile);
router.post(
  "/change-password",
  authenticate([Role.ADMIN, Role.USER]),
  changePassword
);

export default router;
