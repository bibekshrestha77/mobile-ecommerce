import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiHeart, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { getWishlist, clearWishlist, toggleWishlist } from "../api/wishlist.api";
import type { WishlistItem } from "../api/wishlist.api";
import { addToCart } from "../api/cart.api";
import NavBar from "../components/header";
import AuthRequired, { isAuthError } from "../components/auth-required";
import toast from "react-hot-toast";
import { mediaUrl } from "../utils/media";
import { effectivePrice } from "../utils/pricing";

const WishlistPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  type WishlistResponse = { data?: WishlistItem[] };

  const toggleMutation = useMutation({
    mutationFn: (productId: string) => toggleWishlist(productId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update wishlist");
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearWishlist,
    onSuccess: () => {
      toast.success("Wishlist cleared");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to clear wishlist");
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addToCart(productId, 1),
    onSuccess: () => {
      toast.success("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add to cart");
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          {isAuthError(error) ? (
            <AuthRequired
              title="Sign in to view your wishlist"
              message="Save items you love to your wishlist — sign in to see them."
            />
          ) : (
            <div className="text-center">
              <p className="text-red-500 mb-2">Error loading wishlist</p>
              <p className="text-gray-500 mb-8">
                {(error as any)?.message || "Please try again later"}
              </p>
              <Link to="/products" className="text-blue-600 hover:text-blue-700">
                Continue shopping
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  const wishlistItems = (data as WishlistResponse)?.data || [];
  const isEmpty = wishlistItems.length === 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
          {!isEmpty && (
            <button
              onClick={() => clearMutation.mutate()}
              disabled={clearMutation.isPending}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-16">
            <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love to your wishlist</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">{wishlistItems.length} item(s) saved</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Link to={`/products/${item.product?._id}`}>
                      <img
                        src={mediaUrl(item.product?.cover_image?.path) || "/placeholder-product.jpg"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Remove Button */}
                    <button
                      onClick={() => toggleMutation.mutate(item.product?._id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <FiHeart className="w-5 h-5 text-red-500 fill-red-500" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Link to={`/products/${item.product?._id}`}>
                      <p className="text-xs text-blue-600 font-medium mb-1">
                        {item.product?.category?.name}
                      </p>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {item.product?.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${item.product ? effectivePrice(item.product).toFixed(2) : "0.00"}
                      </span>
                      <button
                        onClick={() => addToCartMutation.mutate(item.product?._id)}
                        disabled={addToCartMutation.isPending || item.product?.stock === 0}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="Add to cart"
                      >
                        <FiShoppingBag className="w-5 h-5" />
                      </button>
                    </div>

                    {item.product?.stock === 0 && (
                      <p className="text-xs text-red-600 font-medium mt-2">Out of Stock</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;