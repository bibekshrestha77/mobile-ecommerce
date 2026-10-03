import { Link } from "react-router";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import type { Product } from "../../api/product.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCartQuantity } from "../../api/cart.api";
import { toggleWishlist } from "../../api/wishlist.api";
import toast from "react-hot-toast";
import { mediaUrl } from "../../utils/media";
import { effectivePrice, discountPercent } from "../../utils/pricing";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: () => addCartQuantity(product._id, 1, product.stock),
    onSuccess: () => {
      toast.success(`${product.name} added to your bag`);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Please sign in to add items to your bag.";
      toast.error(message);
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: () => toggleWishlist(product._id),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Please sign in to save favorites.";
      toast.error(message);
    },
  });

  const discount = discountPercent(product);
  const price = effectivePrice(product);

  return (
    <article className="product-card">
      <div className="product-media">
        <Link to={`/products/${product._id}`} className="product-image-link" tabIndex={-1} aria-hidden="true">
          {product.cover_image?.path ? (
            <img src={mediaUrl(product.cover_image.path)} alt="" loading="lazy" />
          ) : (
            <span className="product-image-fallback">{product.category?.name ?? "Northstar"}</span>
          )}
        </Link>

        <div className="product-badges" aria-label="Product highlights">
          {product.is_featured && <span className="product-badge">Staff pick</span>}
          {product.new_arrival && <span className="product-badge">Just in</span>}
          {discount > 0 && <span className="product-badge sale">Save {discount}%</span>}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlistMutation.mutate()}
          disabled={toggleWishlistMutation.isPending}
          className="product-favorite"
          aria-label={`Save ${product.name} to your wishlist`}
          title="Save to wishlist"
        >
          <FiHeart />
        </button>

        <button
          type="button"
          onClick={() => addToCartMutation.mutate()}
          disabled={addToCartMutation.isPending || product.stock === 0}
          className="product-quick-add"
        >
          <FiShoppingBag />
          {product.stock === 0 ? "Out of stock" : addToCartMutation.isPending ? "Adding…" : "Add to bag"}
        </button>
      </div>

      <div className="product-info">
        <div className="product-meta">
          <span>{product.category?.name || "Everyday"}</span>
          <span>{product.brand?.name || "Northstar"}</span>
        </div>
        <Link to={`/products/${product._id}`} className="product-title">{product.name}</Link>
        <div className="product-price-row">
          <span className="product-price">${price.toFixed(2)}</span>
          {discount > 0 && <span className="product-original-price">${product.price.toFixed(2)}</span>}
        </div>
        <div className="product-stock">
          {product.stock === 0 ? "Currently unavailable" : product.stock < 10 ? `Only ${product.stock} left` : "Ready to ship"}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;