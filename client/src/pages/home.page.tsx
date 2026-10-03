import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";
import ProductGrid from "../components/product/product-grid";
import { getFeaturedProducts, getNewArrivals } from "../api/product.api";
import { getCategories } from "../api/category.api";
import { getBrands } from "../api/brand.api";
import NavBar from "../components/header";
import { mediaUrl } from "../utils/media";

const HomePage = () => {
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: getFeaturedProducts,
  });

  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: getNewArrivals,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ limit: 8 }),
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands({ limit: 8 }),
  });

  type CategoryItem = { _id: string; name: string; description: string; image?: { path: string } };
  type BrandItem = { _id: string; name: string; description: string; image?: { path: string } };

  const features = [
    { icon: FiTruck, title: "Free Shipping", desc: "On orders over $50" },
    { icon: FiShield, title: "Secure Payment", desc: "100% secure payments" },
    { icon: FiRefreshCw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: FiHeadphones, title: "24/7 Support", desc: "Dedicated support team" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Discover Your
                <span className="block text-blue-200">Perfect Style</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Shop the latest trends with unbeatable prices. Quality products, fast delivery, and exceptional service.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                >
                  Shop Now <FiArrowRight />
                </Link>
                <Link
                  to="/products?category=featured"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Featured
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/logo.jpg"
                alt="Hero"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/products" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categoriesData?.data && Array.isArray(categoriesData.data) ? (
              categoriesData.data.slice(0, 8).map((category: CategoryItem) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                >
                  {category.image?.path && (
                    <img
                      src={mediaUrl(category.image.path)}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    <p className="text-white/80 text-sm line-clamp-1">{category.description}</p>
                  </div>
                </Link>
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products?featured=true" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <ProductGrid
            products={featuredData?.data || []}
            loading={featuredLoading}
            columns={4}
          />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
            <Link to="/products?new_arrival=true" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <ProductGrid
            products={newArrivalsData?.data || []}
            loading={newArrivalsLoading}
            columns={4}
          />
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Top Brands</h2>
            <Link to="/products" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {brandsData?.data && Array.isArray(brandsData.data) ? (
              brandsData.data.slice(0, 8).map((brand: BrandItem) => (
                <Link
                  key={brand._id}
                  to={`/products?brand=${brand._id}`}
                  className="group flex items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {brand.image?.path ? (
                    <img
                      src={mediaUrl(brand.image.path)}
                      alt={brand.name}
                      className="max-h-16 object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-400">{brand.name}</span>
                  )}
                </Link>
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover the best products at the best prices.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Shop</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products" className="hover:text-white">All Products</Link></li>
                <li><Link to="/products?featured=true" className="hover:text-white">Featured</Link></li>
                <li><Link to="/products?new_arrival=true" className="hover:text-white">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
                <li><Link to="/profile" className="hover:text-white">My Account</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">Subscribe for updates and offers</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 E-Commerce Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;