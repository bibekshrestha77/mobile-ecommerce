import { Link } from "react-router";
import NavBar from "../components/header";
import { FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";

const LandingPage = () => {
  const features = [
    {
      icon: FiShoppingBag,
      title: "Wide Selection",
      description: "Browse thousands of products across multiple categories and brands",
    },
    {
      icon: FiTruck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep",
    },
    {
      icon: FiShield,
      title: "Secure Payments",
      description: "Safe and secure checkout with multiple payment options",
    },
    {
      icon: FiRefreshCw,
      title: "Easy Returns",
      description: "Hassle-free returns and exchanges within 30 days",
    },
  ];

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Amazing <span className="text-blue-600">Products</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Find the best deals on electronics, fashion, home goods, and more.
            Quality products at unbeatable prices.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 rounded-2xl p-8 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers and discover the best products
            at the best prices.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;