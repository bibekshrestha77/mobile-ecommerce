"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_config_1 = require("./config/db.config");
const error_handler_middleware_1 = require("./middlewares/error_handler.middleware");
const error_handler_middleware_2 = __importDefault(require("./middlewares/error_handler.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
//? importing routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const PORT = process.env.PORT || 5000;
//express app instance
const app = (0, express_1.default)();
//connect database
(0, db_config_1.connect_DB)();
//* using middleware
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.match(/^http:\/\/localhost:\d+$/)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "5mb" }));
app.use("/api/uploads", express_1.default.static("uploads/"));
//*ping route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up & running",
        status: "success",
        success: true,
    });
});
//* using routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/brands", brand_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/wishlist", wishlist_routes_1.default);
app.use("/api/orders", order_routes_1.default);
//! handling path fallback error
app.use((req, res, next) => {
    const message = `Can not ${req.method} on ${req.originalUrl}`;
    next(new error_handler_middleware_2.default(message, 400));
});
app.use(error_handler_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
