import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import NavBar from "../components/header";
import AuthRequired, { isAuthError } from "../components/auth-required";
import { getOrder } from "../api/order.api";
import type { OrderStatus } from "../api/order.api";
import { mediaUrl } from "../utils/media";

const getStatusColor = (status: OrderStatus | string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "PAID":
      return "bg-blue-100 text-blue-700";
    case "SHIPPED":
      return "bg-indigo-100 text-indigo-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id!),
    enabled: !!id,
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mb-6"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          {isAuthError(error) ? (
            <AuthRequired
              title="Sign in to view this order"
              message="Sign in to see your order details."
            />
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {(error as any)?.response?.status === 404
                  ? "Order not found"
                  : "Unable to load this order"}
              </h2>
              <p className="text-gray-500 mb-6">
                {(error as any)?.response?.data?.message ||
                  (error as any)?.message ||
                  "Please try again later"}
              </p>
              <button
                onClick={() => refetch()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  const addr = order.shipping_address;

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mb-6"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {order.order_number}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              {order.is_paid && (
                <p className="text-xs text-green-600 mt-2 flex items-center justify-end gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5" />
                  Paid on {formatDate(order.paid_at)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiPackage className="w-5 h-5 text-blue-600" />
              Items ({order.items.length})
            </h2>

            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 py-4">
                  <img
                    src={mediaUrl(item.image?.path) || "/placeholder-product.jpg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {order.shipping_cost === 0 ? "Free" : `$${order.shipping_cost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & payment */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-blue-600" />
                Shipping Address
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {addr.first_name} {addr.last_name}
                <br />
                {addr.address}
                <br />
                {addr.city}, {addr.state} {addr.zip_code}
                <br />
                {addr.country}
                {addr.phone && (
                  <>
                    <br />
                    {addr.phone}
                  </>
                )}
                <br />
                <span className="text-gray-400">{addr.email}</span>
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5 text-blue-600" />
                Payment
              </h2>
              <p className="text-sm text-gray-600">
                {order.payment_method === "card"
                  ? `Card ending in ${order.card_last4 || "****"}`
                  : "Cash on delivery"}
              </p>
            </div>

            <Link
              to="/products"
              className="block text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailPage;
