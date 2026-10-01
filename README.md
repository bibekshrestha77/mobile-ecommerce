# E-Commerce Platform

A full-stack e-commerce application built with **React + TypeScript** (frontend) and **Node.js + Express + TypeScript** (backend) with MongoDB database and Cloudinary for image management.

---

## 📁 Project Structure

```
project-ec/
├── client/                 # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── form/       # Form components (login, register)
│   │   │   ├── header/     # Navigation components
│   │   │   └── ui/         # Base UI components (Button, Input, Logo)
│   │   ├── pages/          # Page components
│   │   │   └── auth/       # Authentication pages
│   │   ├── api/            # API layer (Axios + React Query)
│   │   ├── schema/         # Validation schemas (Yup)
│   │   ├── providers/      # Context providers (React Query)
│   │   └── App.tsx         # Main app with routing
│   └── package.json
│
└── server/                 # Backend (Express + TypeScript)
    ├── src/
    │   ├── config/         # Configuration files
    │   ├── controllers/    # Route controllers
    │   ├── middlewares/    # Express middlewares
    │   ├── models/         # Mongoose models
    │   ├── routes/         # API routes
    │   ├── utils/          # Utility functions
    │   ├── @types/         # TypeScript types
    │   └── server.ts       # Entry point
    └── package.json
```

---

## ✅ What Has Been Completed

### Backend (Server)

#### 🔐 Authentication System
- **User Registration** - With profile image upload (Cloudinary)
- **User Login** - JWT token generation with HttpOnly cookies
- **User Profile** - Protected route to get current user (`/api/auth/me`)
- **Password Hashing** - bcryptjs for secure password storage
- **Role-based Access Control** - USER and ADMIN roles

#### 🗄️ Database Models (Mongoose)
| Model | Status | Fields |
|-------|--------|--------|
| **User** | ✅ Complete | first_name, last_name, email, password, role, profile_image, phone |
| **Category** | ✅ Complete | name, description, image |
| **Brand** | ✅ Complete | name, description, image |
| **Product** | ✅ Complete | name, price, stock, description, cover_image, images[], is_featured, new_arrival, category(ref), brand(ref) |
| **Cart** | ✅ Complete | user(ref), items[{product(ref), quantity}], total_amount |
| **Wishlist** | ✅ Complete | user(ref), product(ref) |

#### 🛣️ API Routes

| Route | Methods | Auth Required | Description |
|-------|---------|---------------|-------------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login user |
| `/api/auth/me` | GET | Yes (USER/ADMIN) | Get current user profile |
| `/api/categories` | GET | No | Get all categories |
| `/api/categories/:id` | GET | No | Get category by ID |
| `/api/categories` | POST | Yes (ADMIN) | Create category |
| `/api/categories/:id` | PUT | Yes (ADMIN) | Update category |
| `/api/categories/:id` | DELETE | Yes (ADMIN) | Delete category |
| `/api/brands` | GET | No | Get all brands |
| `/api/brands/:id` | GET | No | Get brand by ID |
| `/api/brands` | POST | Yes | Create brand |
| `/api/brands/:id` | PUT | Yes | Update brand |
| `/api/brands/:id` | DELETE | Yes | Delete brand |
| `/api/products` | GET | No | Get all products (with pagination) |
| `/api/products/:id` | GET | No | Get product by ID |
| `/api/products` | POST | Yes (ADMIN) | Create product |
| `/api/products/:id` | PUT | Yes (ADMIN) | Update product |
| `/api/products/:id` | DELETE | Yes (ADMIN) | Delete product |
| `/api/products/category/:category_id` | GET | No | Get products by category |
| `/api/products/featured` | GET | No | Get featured products |
| `/api/products/new-arrivals` | GET | No | Get new arrival products |
| `/api/cart` | POST | Yes (USER) | Add item to cart |
| `/api/cart` | GET | Yes (USER) | Get user's cart |
| `/api/cart/remove` | POST | Yes (USER) | Remove item from cart |
| `/api/cart/clear` | POST | Yes (USER) | Clear entire cart |
| `/api/wishlist` | POST | Yes (USER) | Toggle wishlist item |
| `/api/wishlist` | GET | Yes (USER) | Get user's wishlist |
| `/api/wishlist/clear` | POST | Yes (USER) | Clear wishlist |

#### 🛠️ Middlewares & Utilities
- **Authentication Middleware** - JWT verification, role-based authorization
- **Error Handler** - Centralized error handling with custom error class
- **Multer Middleware** - File upload handling with validation (5MB, jpg/jpeg/png/webp/svg)
- **Cloudinary Integration** - Image upload/delete utilities
- **Email Service** - Nodemailer setup for welcome emails
- **Async Handler** - Wrapper for async route handlers

---

### Frontend (Client)

#### 🎨 UI Components
- **Button** - Reusable button component
- **Input** - Form input with label, icon, error display
- **Logo** - Brand logo component
- **Header/NavBar** - Navigation with logo, links, and icons

#### 📄 Pages
- **Landing Page** - Home page with navigation
- **Login Page** - Form with email/password validation
- **Register Page** - Form with full name, email, password, confirm password

#### 🔌 API Layer
- **Axios Instance** - Configured with base URL
- **Auth API** - Login mutation (React Query)
- **React Query Provider** - Setup for server state management

#### 📋 Form Validation
- **Login Schema** - Yup validation for email/password
- **Register Schema** - (Partial - needs completion)

---

## ⚠️ What Is Remaining / Needs Fixing

### 🔴 Critical Issues

| Issue | Location | Priority |
|-------|----------|----------|
| **Register API endpoint wrong** | `client/src/api/auth.api.tsx:23` | 🔴 HIGH |
| **Role enum has leading space** | `server/src/@types/enum.types.ts:2` | 🔴 HIGH |
| **Category model typo** | `server/src/models/product.models.ts:61` | 🔴 HIGH |
| **Cart `clear` endpoint incomplete** | `server/src/controllers/cart.controller.ts:108` | 🔴 HIGH |
| **No cart routes registered** | `server/src/server.ts` | 🔴 HIGH |
| **No wishlist routes registered** | `server/src/server.ts` | 🔴 HIGH |

### 🟡 Backend Issues

| Issue | Details |
|-------|---------|
| **User model typo** | `minLengthL` should be `minlength` (line 23) |
| **Cart model typo** | `reuired` should be `required` (lines 12, 20) |
| **Brand controller messages** | Say "Category" instead of "Brand" |
| **Product delete** | Uses `map` without `await Promise.all` for image deletion |
| **Cart total_amount** | Not persisted to database |
| **No product routes for cart/wishlist** | Need to add routes in server.ts |
| **No validation on product create/update** | Missing req.body validation |
| **No pagination on product listing** | Could cause performance issues |
| **No search/filter on products** | Missing query parameters |
| **No order/checkout system** | Core e-commerce feature missing |

### 🟡 Frontend Issues

| Issue | Details |
|-------|---------|
| **Register form not using React Hook Form** | Uses manual state, no validation |
| **Register schema incomplete** | `auth.schema.ts` only has login schema |
| **Category API empty** | `client/src/api/category.api.tsx` is empty |
| **No product pages/components** | Product listing, detail, cart, wishlist UI missing |
| **No protected routes** | Need auth guards for user pages |
| **No user profile page** | Missing `/profile` route |
| **No admin dashboard** | Missing admin product/category/brand management |
| **React Hot Toast import** | Using internal path `../../../node_modules/...` |
| **Landing page minimal** | Only shows navbar |

### 🟢 Enhancements (Nice to Have)

- [ ] Product search & filtering
- [ ] Product pagination
- [ ] Image gallery on product detail
- [ ] User address management
- [ ] Order management system
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit/Integration tests
- [ ] Docker configuration
- [ ] CI/CD pipeline

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- SMTP credentials (for emails)

### Environment Variables

**Server (.env)**
```env
PORT=5000
NODE_ENV=development

# Database
DB_URI=mongodb://localhost:27017
DB_NAME=ecommerce

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINAR_CLOUD_NAME=your-cloud-name
CLOUDINARR_API_KEY=your-api-key
CLOUDINAR_SECRET_KEY=your-secret-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cookie
COOKIE_EXPIRES_IN=7
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### Installation & Running

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start development servers
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

---

## 📝 Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Express 5.x** | Latest version with improved routing |
| **Mongoose** | MongoDB ODM with schema validation |
| **Cloudinary** | Managed image hosting with transformations |
| **JWT in HttpOnly Cookies** | Secure token storage, CSRF protection via SameSite |
| **React Query** | Server state caching, background refetching |
| **React Hook Form + Yup** | Performant forms with schema validation |
| **Tailwind CSS v4** | Utility-first styling with Vite plugin |
| **TypeScript** | Type safety across full stack |

---

## 🐛 Known Bugs

1. **Registration doesn't work** - Frontend calls `/api/auth/login` instead of `/api/auth/register`
2. **Role check fails** - `Role.USER` has value `' USER'` (leading space), won't match `'USER'`
3. **Product creation fails** - Category reference typo: `'cateogry'` instead of `'category'`
4. **Cart clear doesn't work** - Controller method is empty
5. **Wishlist/Cart routes not mounted** - Controllers exist but not connected in server.ts

---

## 📄 License

ISC License

---

*Last Updated: September 2025*