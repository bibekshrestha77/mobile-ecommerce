"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploadFile)();
//get all
router.get("/", product_controller_1.getAll);
// create
router.post("/", upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 6,
    },
]), (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), // ['ADMIN]
product_controller_1.create);
//* update
router.put("/:id", upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 6,
    },
]), (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), product_controller_1.update);
//* delete
router.delete("/:id", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), product_controller_1.remove);
//* get by category
router.get("/category/:category_id", product_controller_1.getProductByCategory); // http://localhost:8000/api/products/category/123 -> get
//* get featured products
router.get("/featured", product_controller_1.getFeatured);
//* get new arrival products
router.get("/new-arrivals", product_controller_1.getNewArrivals);
//* get by id
router.get("/:id", product_controller_1.getById); // http://localhost:8000/api/products/axyskhdsjfj -> get
exports.default = router;
