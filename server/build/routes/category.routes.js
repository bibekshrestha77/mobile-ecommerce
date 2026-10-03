"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploadFile)();
//get all
router.get("/", category_controller_1.getAll);
//create
router.post("/", upload.single("image"), (0, auth_middleware_1.authenticate)(), category_controller_1.create);
//get by id
router.get("/:id", category_controller_1.getById);
//upload
router.put("/:id", upload.single("image"), category_controller_1.update);
//delete
router.delete("/:id", category_controller_1.remove);
exports.default = router;
