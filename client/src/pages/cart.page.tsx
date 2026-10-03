import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { getCart, removeFromCart, clearCart } from "../api/cart.api";
import type { Cart } from "../api/cart.api";
import NavBar from "../components/header";
import AuthRequired, { isAuthError } from "../components/auth-required";
import toast from "react-hot-toast";
import { mediaUrl } from "../utils/media";
import { effectivePrice } from "../utils/pricing";

const CartPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  type CartResponse = { data?: Cart };

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),
    onSuccess: () => {
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove item");
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      toast.success("Cart cleared");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to clear cart");
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          {isAuthError(error) ? (
            <AuthRequired
              title="Sign in to view your cart"
              message="Your cart is saved to your account. Sign in to see your items."
            />
          ) : (
            <div className="text-center">
              <p className="text-red-500 mb-2">Error loading cart</p>
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

  const cart = (data as CartResponse)?.data || { items: [], total_amount: 0 };
  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {isEmpty ? (
          <div className="text-center py-16">
            <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">{items.length} item(s) in cart</p>
                <button
                  onClick={() => clearMutation.mutate()}
                  disabled={clearMutation.isPending}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>

              {items.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
                >
                  {/* Image */}
                  <Link to={`/products/${item.product?._id}`} className="flex-shrink-0">
                    <img
                      src={mediaUrl(item.product?.cover_image?.path) || "/placeholder-product.jpg"}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product?._id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      ${item.product ? effectivePrice(item.product).toFixed(2) : "0.00"} each
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">
                          ${(item.product ? effectivePrice(item.product) * item.quantity : 0).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeMutation.mutate(item.product?._id)}
                          disabled={removeMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cart.total_amount?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{cart.total_amount >= 50 ? "Free" : "$5.00"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>
                      ${((cart.total_amount || 0) + (cart.total_amount >= 50 ? 0 : 5)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <FiArrowRight />
                </Link>

                <Link
                  to="/products"
                  className="block text-center text-blue-600 hover:text-blue-700 font-medium mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;