import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import LoginPage from "./pages/auth/login.page";
import RegisterPage from "./pages/auth/register.page";
import HomePage from "./pages/home.page";
import ProductListingPage from "./pages/products.page";
import ProductDetailPage from "./pages/product-detail.page";
import CartPage from "./pages/cart.page";
import CheckoutPage from "./pages/checkout.page";
import WishlistPage from "./pages/wishlist.page";
import ProfilePage from "./pages/profile.page";
import OrderSuccessPage from "./pages/order-success.page";
import OrdersPage from "./pages/orders.page";
import OrderDetailPage from "./pages/order-detail.page";
import AdminDashboard from "./pages/admin/dashboard.page";
import AdminProductsPage from "./pages/admin/products.page";
import AdminCategoriesPage from "./pages/admin/categories.page";
import AdminBrandsPage from "./pages/admin/brands.page";
import AdminUsersPage from "./pages/admin/users.page";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <main className="min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/brands" element={<AdminBrandsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route
            path="*"
            element={
              <main className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl text-gray-600">Page Not Found</h1>
              </main>
            }
          />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </main>
  );
}

export default App;