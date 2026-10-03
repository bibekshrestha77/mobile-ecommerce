import multer from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";
import CustomError from "./error_handler.middleware";

export const uploadFile = () => {
  // creating multer instance
  const folder = "uploads";
  const file_size = 5 * 1024 * 1024; // 5mb
  const allowed_ext = ["jpg", "jpeg", "png", "webp", "svg"];

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  //? storage
  const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + "-" + file.originalname;
      cb(null, fileName);
    },
  });

  const file_filter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const ext = path.extname(file.originalname).replace(".", "");
    const isAllowed = allowed_ext.includes(ext);
    if (isAllowed) {
      cb(null, true);
    } else {
      const message = `${ext} is not allowed. Only ${allowed_ext.join(
        ","
      )} are allowed.`;
      cb(new Error(message) as any, false);
    }
  };

  const upload = multer({
    storage: myStorage,
    limits: { fileSize: file_size },
    fileFilter: file_filter,
  });

  return upload;
};
