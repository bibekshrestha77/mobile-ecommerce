import { Link } from "react-router";
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import NavBar from "../../components/header";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Products", value: "156", icon: FiPackage, color: "bg-blue-500", change: "+12%" },
    { label: "Total Users", value: "1,234", icon: FiUsers, color: "bg-green-500", change: "+8%" },
    { label: "Total Orders", value: "89", icon: FiShoppingBag, color: "bg-purple-500", change: "+23%" },
    { label: "Revenue", value: "$12,345", icon: FiDollarSign, color: "bg-orange-500", change: "+18%" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", total: 149.99, status: "delivered", date: "2026-09-25" },
    { id: "ORD-002", customer: "Jane Smith", total: 79.99, status: "shipped", date: "2026-09-24" },
    { id: "ORD-003", customer: "Bob Johnson", total: 199.98, status: "processing", date: "2026-09-23" },
    { id: "ORD-004", customer: "Alice Brown", total: 59.99, status: "pending", date: "2026-09-22" },
  ];

  const topProducts = [
    { name: "Wireless Headphones", sales: 45, revenue: 4499.55 },
    { name: "Smart Watch", sales: 32, revenue: 6399.36 },
    { name: "Bluetooth Speaker", sales: 28, revenue: 2239.72 },
    { name: "Phone Case", sales: 24, revenue: 599.76 },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link
            to="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Product
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <FiTrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">${order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          order.status === "delivered" ? "bg-green-100 text-green-700" :
                          order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                          order.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Top Products</h2>
              <Link to="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">${product.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/products"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <FiPackage className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Products</p>
            </Link>
            <Link
              to="/admin/categories"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <FiShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Categories</p>
            </Link>
            <Link
              to="/admin/brands"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <FiTrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Brands</p>
            </Link>
            <Link
              to="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <FiUsers className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Users</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;