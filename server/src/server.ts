import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { connect_DB } from "./config/db.config";
import { errorHandler } from "./middlewares/error_handler.middleware";
import CustomError from "./middlewares/error_handler.middleware";
import cookieParser from 'cookie-parser'
import cors from 'cors'

//? importing routes
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import brandRoutes from "./routes/brand.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import orderRoutes from "./routes/order.routes";

const PORT = process.env.PORT || 5000;

//express app instance
const app = express();

//connect database
connect_DB();

//* using middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.match(/^http:\/\/localhost:\d+$/)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use("/api/uploads", express.static("uploads/"));

//*ping route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up & running",
    status: "success",
    success: true,
  });
});

//* using routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);

//! handling path fallback error
app.use((req: Request, res: Response, next: NextFunction) => {
  const message = `Can not ${req.method} on ${req.originalUrl}`;

  next(new CustomError(message, 400));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
