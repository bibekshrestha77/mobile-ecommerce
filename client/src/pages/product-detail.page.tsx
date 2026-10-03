import { useState } from "react";
import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiArrowRight, FiHeart, FiMinus, FiPlus, FiRefreshCw, FiShield, FiTruck } from "react-icons/fi";
import { getProductById, getProducts } from "../api/product.api";
import { addCartQuantity } from "../api/cart.api";
import { toggleWishlist } from "../api/wishlist.api";
import ProductGrid from "../components/product/product-grid";
import NavBar from "../components/header";
import toast from "react-hot-toast";
import { mediaUrl } from "../utils/media";
import { effectivePrice, discountPercent } from "../utils/pricing";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });
  const product = data?.data;
  const { data: relatedData } = useQuery({
    queryKey: ["related-products", product?.category?._id],
    queryFn: () => getProducts({ category: product?.category?._id, limit: 4 }),
    enabled: Boolean(product?.category?._id),
  });

  const addMutation = useMutation({
    mutationFn: () => addCartQuantity(id!, quantity, product?.stock),
    onSuccess: () => {
      toast.success(`${product?.name} added to your bag`);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (mutationError: unknown) => {
      toast.error(mutationError instanceof Error ? mutationError.message : "Please sign in to add this item.");
    },
  });
  const wishlistMutation = useMutation({
    mutationFn: () => toggleWishlist(id!),
    onSuccess: (response) => {
      toast.success(response.message || "Saved to your wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (mutationError: unknown) => {
      toast.error(mutationError instanceof Error ? mutationError.message : "Please sign in to save favorites.");
    },
  });

  if (isLoading) {
    return <main className="site-shell"><NavBar /><div className="section-wrap section-space"><div className="product-detail-layout"><div className="product-media product-skeleton" /><div><div className="product-skeleton-line" /><div className="product-skeleton-line" /><div className="product-skeleton-line price" /></div></div></div></main>;
  }

  if (error || !product) {
    return (
      <main className="site-shell">
        <NavBar />
        <div className="empty-state section-space">
          <h1>We couldn&apos;t find that one</h1>
          <p>The device may have moved or sold out. There are plenty more to discover.</p>
          <Link to="/products" className="button-primary">Browse all phones <FiArrowRight /></Link>
        </div>
      </main>
    );
  }

  const images = [product.cover_image, ...(product.images || [])].filter((image) => Boolean(image?.path));
  const relatedProducts = (relatedData?.data || []).filter((item) => item._id !== product._id).slice(0, 4);
  const discount = discountPercent(product);

  return (
    <main className="site-shell commerce-page">
      <NavBar />
      <div className="section-wrap" style={{ paddingTop: 22 }}>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>/</span><Link to="/products">Shop</Link>
          {product.category && <><span>/</span><Link to={`/products?category=${product.category._id}`}>{product.category.name}</Link></>}
          <span>/</span><span aria-current="page">{product.name}</span>
        </nav>
      </div>

      <section className="product-detail-layout">
        <div className="detail-gallery">
          {images.length > 1 && (
            <div className="detail-thumbnails" aria-label="Product images">
              {images.map((image, index) => (
                <button
                  key={`${image.path}-${index}`}
                  type="button"
                  className="detail-thumbnail"
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={mediaUrl(image.path)} alt="" />
                </button>
              ))}
            </div>
          )}
          <div className="detail-main-image">
            {images[selectedImage] ? (
              <img src={mediaUrl(images[selectedImage].path)} alt={product.name} />
            ) : <span className="product-image-fallback">{product.category?.name ?? "PhoneVault"}</span>}
          </div>
        </div>

        <div className="detail-info">
          <Link className="detail-category" to={`/products?category=${product.category?._id ?? ""}`}>
            {product.brand?.name ?? "PhoneVault"} {product.category?.name ? ` / ${product.category.name}` : ""}
          </Link>
          <h1>{product.name}</h1>
          <div className="detail-price-row">
            <span className="detail-price">${effectivePrice(product).toFixed(2)}</span>
            {discount > 0 && <><span className="product-original-price">${product.price.toFixed(2)}</span><span className="product-badge sale">Save {discount}%</span></>}
          </div>
          <div className={`stock-line${product.stock <= 0 ? " out-of-stock" : ""}`}>
            <span className="stock-dot" />
            {product.stock <= 0 ? "Currently unavailable" : product.stock < 10 ? `Only ${product.stock} left in stock` : "In stock and ready to ship"}
          </div>
          <p className="detail-description">{product.description}</p>

          <div className="quantity-stepper" aria-label="Choose quantity">
            <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><FiMinus /></button>
            <span aria-live="polite">{quantity}</span>
            <button type="button" aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}><FiPlus /></button>
          </div>

          <div className="detail-actions">
            <button type="button" className="button-primary" disabled={product.stock <= 0 || addMutation.isPending} onClick={() => addMutation.mutate()}>
              <FiArrowRight />{addMutation.isPending ? "Adding to bag…" : "Add to bag"}
            </button>
            <button type="button" className="icon-button" aria-label="Save to wishlist" title="Save to wishlist" disabled={wishlistMutation.isPending} onClick={() => wishlistMutation.mutate()}>
              <FiHeart />
            </button>
          </div>

          <div className="detail-promises">
            <div className="detail-promise"><FiTruck /><span>Free shipping on all premium devices</span></div>
            <div className="detail-promise"><FiShield /><span>1-Year Manufacturer Warranty</span></div>
            <div className="detail-promise"><FiRefreshCw /><span>Order details saved in your account</span></div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section-wrap section-space">
          <div className="section-heading"><div><span className="section-eyebrow">More good finds</span><h2>You might also like</h2></div><Link to="/products" className="text-link">Explore all <FiArrowRight /></Link></div>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </main>
  );
};

export default ProductDetailPage;