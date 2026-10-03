import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FiArrowRight, FiBox, FiCreditCard, FiShield, FiTruck } from "react-icons/fi";
import ProductGrid from "../components/product/product-grid";
import { getFeaturedProducts, getNewArrivals } from "../api/product.api";
import { getCategories } from "../api/category.api";
import type { Category } from "../api/category.api";
import NavBar from "../components/header";
import { mediaUrl } from "../utils/media";

const HomePage = () => {
  const { data: featuredData, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ["featured-products"],
    queryFn: getFeaturedProducts,
  });

  const { data: newArrivalsData, isLoading: newArrivalsLoading, error: newArrivalsError } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: getNewArrivals,
  });

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ limit: 5 }),
  });

  const features = [
    { icon: FiTruck, title: "Express Delivery", desc: "Free on orders $99+" },
    { icon: FiCreditCard, title: "Secure Checkout", desc: "Card, UPI & EMI options" },
    { icon: FiBox, title: "Genuine Products", desc: "100% authentic devices" },
    { icon: FiShield, title: "Warranty Covered", desc: "Official manufacturer warranty" },
  ];

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
  const featured = featuredData?.data ?? [];
  const heroProduct = featured[0] ?? newArrivalsData?.data?.[0];
  const heroImage = heroProduct?.cover_image?.path
    ? mediaUrl(heroProduct.cover_image.path)
    : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85";

  return (
    <main className="site-shell">
      <NavBar />

      <section className="home-hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Next-Gen Mobile Experience</span>
            <h1>The future of <span>smartphones.</span></h1>
            <p>Discover flagship devices with cutting-edge processors, cinematic cameras, and titanium builds — engineered for those who demand the best.</p>
            <div className="hero-actions">
              <Link to="/products" className="button-primary">
                Explore Collection <FiArrowRight />
              </Link>
              <Link to="/products?new_arrival=true" className="text-link">New Arrivals</Link>
            </div>
          </div>
          <Link
            to={heroProduct ? `/products/${heroProduct._id}` : "/products"}
            className="hero-product"
            aria-label={heroProduct ? `View ${heroProduct.name}` : "Explore collection"}
          >
            <img src={heroImage} alt={heroProduct?.name ?? "Premium smartphone showcase"} />
            {heroProduct && (
              <span className="hero-product-label">
                {heroProduct.name}
                <span>${(heroProduct.sale_price ?? heroProduct.price).toFixed(2)}</span>
              </span>
            )}
          </Link>
        </div>
      </section>

      <section className="service-strip" aria-label="Shopping benefits">
        <div className="service-inner">
          {features.map((feature) => (
            <div className="service-item" key={feature.title}>
              <feature.icon aria-hidden="true" />
              <div><strong>{feature.title}</strong><span>{feature.desc}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space">
        <div className="section-wrap">
          <div className="section-heading">
            <div><span className="section-eyebrow">Browse by Category</span><h2>Shop by category</h2></div>
            <Link to="/products" className="text-link">View all <FiArrowRight /></Link>
          </div>
          <div className="category-grid">
            {categoriesLoading && categories.length === 0 ? (
              Array.from({ length: 5 }, (_, index) => <div className="category-tile product-skeleton" key={index} />)
            ) : categoriesError ? (
              <div className="catalog-message"><strong>Categories unavailable.</strong><span>Check the connection and try again.</span></div>
            ) : categories.length === 0 ? (
              <div className="catalog-message"><strong>New categories coming soon.</strong><Link to="/products">Browse all phones <FiArrowRight /></Link></div>
            ) : categories.slice(0, 5).map((category: Category) => (
                <Link key={category._id} to={`/products?category=${category._id}`} className="category-tile">
                  {category.image?.path ? (
                    <img src={mediaUrl(category.image.path)} alt={category.name} />
                  ) : null}
                  <span>{category.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="section-space" style={{ background: "var(--dark-3)" }}>
        <div className="section-wrap">
          <div className="section-heading">
            <div><span className="section-eyebrow">Editor's Choice</span><h2>Featured Flagships</h2></div>
            <Link to="/products?featured=true" className="text-link">See all <FiArrowRight /></Link>
          </div>
          {featuredError
            ? <div className="catalog-message"><strong>Couldn't load featured phones.</strong><span>Check connection and refresh.</span></div>
            : <ProductGrid products={featured} loading={featuredLoading} columns={4} />}
        </div>
      </section>

      <section className="editorial-band">
        <div className="editorial-copy">
          <span className="section-eyebrow">Just Launched</span>
          <h2>The latest arrivals are here.</h2>
          <p>Be first to own next-generation devices with breakthrough camera systems, all-day battery life, and stunning displays.</p>
          <Link to="/products?new_arrival=true" className="button-primary">Shop New Arrivals <FiArrowRight /></Link>
        </div>
        <div className="editorial-image">
          <img
            src={newArrivalsData?.data?.[0]?.cover_image?.path
              ? mediaUrl(newArrivalsData.data[0].cover_image.path)
              : "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1100&q=85"}
            alt={newArrivalsData?.data?.[0]?.name ?? "Latest smartphone technology"}
            loading="lazy"
          />
        </div>
      </section>

      <section className="section-space">
        <div className="section-wrap">
          <div className="section-heading">
            <div><span className="section-eyebrow">Fresh Drops</span><h2>New arrivals</h2></div>
            <Link to="/products?new_arrival=true" className="text-link">Shop all <FiArrowRight /></Link>
          </div>
          {newArrivalsError
            ? <div className="catalog-message"><strong>New arrivals unavailable.</strong><span>Reconnect and refresh.</span></div>
            : <ProductGrid products={newArrivalsData?.data || []} loading={newArrivalsLoading} columns={4} />}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <Link to="/" className="header-brand"><span className="brand-mark">P</span><span>PhoneVault</span></Link>
              <p className="footer-brand-copy">Your destination for premium smartphones. Genuine devices, expert curation, and seamless delivery.</p>
            </div>
            <div className="footer-column">
              <h2>Explore</h2>
              <Link to="/products">All Phones</Link>
              <Link to="/products?featured=true">Flagships</Link>
              <Link to="/products?new_arrival=true">New Arrivals</Link>
            </div>
            <div className="footer-column">
              <h2>Account</h2>
              <Link to="/profile">Profile</Link>
              <Link to="/orders">Order History</Link>
              <Link to="/wishlist">Wishlist</Link>
            </div>
            <div className="footer-column">
              <h2>Support</h2>
              <Link to="/cart">Shopping Bag</Link>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Create Account</Link>
            </div>
          </div>
          <div className="footer-bottom"><span>© 2026 PhoneVault. Premium Mobile Commerce.</span><span>All rights reserved.</span></div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;