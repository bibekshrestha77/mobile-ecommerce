/**
 * Seed script — populates categories, brands and products for local development.
 * Run: npx ts-node --transpile-only src/scripts/seed.ts   (from server/)
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import Category from "../models/category.models";
import Brand from "../models/brand.model";
import Product from "../models/product.models";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const DB_URI =
  process.env.DB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "ecommerce";

const img = (file: string) => ({
  path: `/api/uploads/${file}`,
  public_id: `local_${file.replace(/\W+/g, "_")}`,
});

const categories = [
  {
    name: "Electronics",
    description: "Gadgets, devices and accessories for work and play.",
    image: img("1762848846540-images.jpeg"),
  },
  {
    name: "Fashion",
    description: "Clothing, footwear and accessories for every occasion.",
    image: img("1762852201862-images.jpeg"),
  },
  {
    name: "Home & Kitchen",
    description: "Everything you need to make your house a home.",
    image: img("1763281299320-food.jpg"),
  },
  {
    name: "Sports",
    description: "Gear and equipment to keep you active and healthy.",
    image: img("1763281565034-food.jpg"),
  },
  {
    name: "Beauty",
    description: "Skincare, makeup and personal care essentials.",
    image: img("1763281894825-food.jpg"),
  },
];

const brands = [
  { name: "NovaTech", description: "Innovative consumer electronics.", image: img("1762852297066-images.jpeg") },
  { name: "UrbanWeave", description: "Modern apparel for everyday life.", image: img("1763281921613-food.jpg") },
  { name: "HomeHaven", description: "Thoughtful home and kitchen goods.", image: img("1763281929131-food.jpg") },
  { name: "ProFit", description: "Performance sports equipment.", image: img("1763281929318-food.jpg") },
  { name: "GlowLab", description: "Clean beauty and skincare.", image: img("1763282350151-food.jpg") },
];

type Seed = {
  name: string;
  price: number;
  sale_price?: number;
  stock: number;
  description: string;
  category: string;
  brand: string;
  is_featured?: boolean;
  new_arrival?: boolean;
  image: string;
};

const products: Seed[] = [
  {
    name: "NovaTech Wireless Headphones",
    price: 89.99,
    sale_price: 69.99,
    stock: 42,
    description:
      "Immersive wireless headphones with active noise cancellation, 30-hour battery life and crystal-clear call quality for work and travel.",
    category: "Electronics",
    brand: "NovaTech",
    is_featured: true,
    image: "1762848846540-images.jpeg",
  },
  {
    name: "NovaTech Smart Watch Series 5",
    price: 199.99,
    stock: 8,
    description:
      "Feature-packed smartwatch with heart-rate monitoring, GPS, sleep tracking and a bright always-on AMOLED display.",
    category: "Electronics",
    brand: "NovaTech",
    is_featured: true,
    new_arrival: true,
    image: "1762852201862-images.jpeg",
  },
  {
    name: "NovaTech Portable Bluetooth Speaker",
    price: 59.5,
    stock: 30,
    description:
      "Compact portable speaker with deep bass, IPX7 water resistance and 12 hours of playtime for outdoor adventures.",
    category: "Electronics",
    brand: "NovaTech",
    image: "1762852297066-images.jpeg",
  },
  {
    name: "UrbanWeave Classic Denim Jacket",
    price: 74.0,
    sale_price: 54.0,
    stock: 15,
    description:
      "Timeless denim jacket crafted from premium cotton with a relaxed fit that layers easily over any outfit.",
    category: "Fashion",
    brand: "UrbanWeave",
    is_featured: true,
    image: "1763281921613-food.jpg",
  },
  {
    name: "UrbanWeave Everyday Sneakers",
    price: 64.99,
    stock: 0,
    description:
      "Lightweight everyday sneakers with a cushioned insole and durable outsole designed for all-day comfort.",
    category: "Fashion",
    brand: "UrbanWeave",
    image: "1763281929131-food.jpg",
  },
  {
    name: "UrbanWeave Cotton Crew T-Shirt (3-Pack)",
    price: 29.99,
    stock: 120,
    description:
      "Soft breathable crew-neck t-shirts in a convenient three-pack, pre-shrunk and built to keep their shape wash after wash.",
    category: "Fashion",
    brand: "UrbanWeave",
    new_arrival: true,
    image: "1763281929318-food.jpg",
  },
  {
    name: "HomeHaven Non-Stick Cookware Set",
    price: 129.0,
    sale_price: 99.0,
    stock: 12,
    description:
      "Ten-piece non-stick cookware set with even heat distribution, comfortable handles and oven-safe construction.",
    category: "Home & Kitchen",
    brand: "HomeHaven",
    is_featured: true,
    image: "1763281299320-food.jpg",
  },
  {
    name: "HomeHaven Ceramic Dinnerware Set",
    price: 84.5,
    stock: 20,
    description:
      "Elegant sixteen-piece ceramic dinnerware set that is dishwasher and microwave safe for effortless everyday dining.",
    category: "Home & Kitchen",
    brand: "HomeHaven",
    image: "1763281565034-food.jpg",
  },
  {
    name: "HomeHaven programmable Coffee Maker",
    price: 49.99,
    stock: 3,
    description:
      "Programmable 12-cup coffee maker with auto shut-off, bold-brew option and a reusable filter for eco-friendly mornings.",
    category: "Home & Kitchen",
    brand: "HomeHaven",
    new_arrival: true,
    image: "1763281894825-food.jpg",
  },
  {
    name: "ProFit Yoga Mat with Carry Strap",
    price: 34.99,
    stock: 55,
    description:
      "Extra-thick non-slip yoga mat with alignment guides and a handy carry strap, perfect for studio or home practice.",
    category: "Sports",
    brand: "ProFit",
    image: "1763282446400-food.jpg",
  },
  {
    name: "ProFit Adjustable Dumbbell Set",
    price: 159.0,
    sale_price: 129.0,
    stock: 6,
    description:
      "Space-saving adjustable dumbbells ranging from 5 to 52 pounds with quick-select dial for fast workout transitions.",
    category: "Sports",
    brand: "ProFit",
    is_featured: true,
    image: "1763282514337-food.jpg",
  },
  {
    name: "ProFit Running Hydration Belt",
    price: 24.5,
    stock: 40,
    description:
      "Bounce-free hydration belt with two water bottles and a zippered pocket for keys and phone during long runs.",
    category: "Sports",
    brand: "ProFit",
    image: "1763281921613-food.jpg",
  },
  {
    name: "GlowLab Vitamin C Facial Serum",
    price: 26.99,
    sale_price: 21.99,
    stock: 25,
    description:
      "Brightening vitamin C serum with hyaluronic acid that helps even skin tone and reduce the look of fine lines.",
    category: "Beauty",
    brand: "GlowLab",
    is_featured: true,
    new_arrival: true,
    image: "1763282350151-food.jpg",
  },
  {
    name: "GlowLab Hydrating Night Cream",
    price: 32.0,
    stock: 18,
    description:
      "Rich overnight moisturiser with ceramides and shea butter that restores your skin barrier while you sleep.",
    category: "Beauty",
    brand: "GlowLab",
    image: "1763281894825-food.jpg",
  },
  {
    name: "GlowLab Everyday Sunscreen SPF 50",
    price: 18.99,
    stock: 60,
    description:
      "Lightweight broad-spectrum SPF 50 sunscreen that layers cleanly under makeup without a white cast or greasy feel.",
    category: "Beauty",
    brand: "GlowLab",
    image: "1763281565034-food.jpg",
  },
  {
    name: "NovaTech Fast-Charging Power Bank",
    price: 44.99,
    stock: 0,
    description:
      "20000mAh power bank with 30W fast charging, dual USB-C ports and a digital display showing remaining capacity.",
    category: "Electronics",
    brand: "NovaTech",
    image: "1762848846540-images.jpeg",
  },
];

const run = async () => {
  try {
    await mongoose.connect(`${DB_URI}/${DB_NAME}`);
    console.log("Connected to MongoDB");

    // Idempotent: clear previous seed data
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing categories, brands and products");

    const categoryDocs = await Category.insertMany(categories);
    const brandDocs = await Brand.insertMany(brands);
    console.log(`Inserted ${categoryDocs.length} categories, ${brandDocs.length} brands`);

    const categoryNameToId = Object.fromEntries(
      categoryDocs.map((c) => [c.name, c._id])
    );
    const brandNameToId = Object.fromEntries(
      brandDocs.map((b) => [b.name, b._id])
    );

    const productDocs = await Product.insertMany(
      products.map((p) => ({
        name: p.name,
        price: p.price,
        sale_price: p.sale_price ?? null,
        stock: p.stock,
        description: p.description,
        category: categoryNameToId[p.category],
        brand: brandNameToId[p.brand],
        is_featured: !!p.is_featured,
        new_arrival: !!p.new_arrival,
        cover_image: img(p.image),
        images: [img(p.image)],
      }))
    );
    console.log(`Inserted ${productDocs.length} products`);

    await mongoose.disconnect();
    console.log("Seed complete.");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

run();
