import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FiPackage, FiChevronRight, FiAlertCircle } from "react-icons/fi";
import NavBar from "../components/header";
import AuthRequired, { isAuthError } from "../components/auth-required";
import { getOrders } from "../api/order.api";
import type { Order, OrderStatus } from "../api/order.api";

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const OrdersPage = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const orders: Order[] = data?.data ?? [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
          {isAuthError(error) ? (
            <AuthRequired
              title="Sign in to view your orders"
              message="Sign in to see your order history and track deliveries."
            />
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Unable to load your orders
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

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
          {isFetching && (
            <span className="text-sm text-gray-400">Refreshing…</span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order</p>
                      <p className="font-semibold text-gray-900">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-2">
                      {order.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item._id}
                          className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                        >
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-end">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    View Details <FiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrdersPage;
