import { Link, useParams, useLocation } from "react-router";
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from "react-icons/fi";
import NavBar from "../components/header";

const OrderSuccessPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as {
    state?: { orderNumber?: string; total?: number };
  };
  const orderNumber = location.state?.orderNumber;
  const total = location.state?.total;

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your purchase. Your order has been received.
          </p>
          <p className="text-gray-500 mb-2">
            Order ID:{" "}
            <span className="font-mono font-semibold text-gray-900">
              {orderNumber || id}
            </span>
          </p>
          {total != null && (
            <p className="text-gray-500 mb-8">
              Total charged:{" "}
              <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
            </p>
          )}

          {/* Order Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="font-semibold text-gray-900 mb-6">Order Status</h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-900">Confirmed</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-2">
                  <FiPackage className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Processing</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-2">
                  <FiTruck className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Shipped</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-2">
                  <FiHome className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Delivered</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to={id ? `/orders/${id}` : "/orders"}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {id ? "View This Order" : "View Orders"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;