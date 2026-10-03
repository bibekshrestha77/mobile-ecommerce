import { Link } from "react-router";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import type { Product } from "../../api/product.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../../api/cart.api";
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
    mutationFn: () => addToCart(product._id, 1),
    onSuccess: () => {
      toast.success("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add to cart");
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: () => toggleWishlist(product._id),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update wishlist");
    },
  });

  const discount = discountPercent(product);
  const price = effectivePrice(product);

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/products/${product._id}`}>
          <img
            src={mediaUrl(product.cover_image?.path) || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_featured && (
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}
          {product.new_arrival && (
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlistMutation.mutate()}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Add to wishlist"
        >
          <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>

        {/* Quick Add to Cart */}
        <button
          onClick={() => addToCartMutation.mutate()}
          disabled={addToCartMutation.isPending || product.stock === 0}
          className="absolute bottom-3 left-3 right-3 bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FiShoppingBag className="w-4 h-4" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
            {product.category?.name || "Uncategorized"}
          </span>
          <span className="text-xs text-gray-500">
            {product.brand?.name || "Unknown Brand"}
          </span>
        </div>

        {/* Name */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <span className="text-xs text-orange-600 font-medium">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;