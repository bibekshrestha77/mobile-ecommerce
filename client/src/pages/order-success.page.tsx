import { Link, useLocation, useParams } from "react-router";
import { FiArrowRight, FiCheck, FiPackage } from "react-icons/fi";
import NavBar from "../components/header";

type OrderSuccessState = { orderNumber?: string; total?: number };

const OrderSuccessPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as OrderSuccessState | null;
  const orderNumber = state?.orderNumber;
  const total = state?.total;

  return (
    <main className="site-shell success-page">
      <NavBar />
      <section className="success-content">
        <div className="success-icon"><FiCheck /></div>
        <span className="section-eyebrow">A good choice</span>
        <h1>Your order is in.</h1>
        <p className="success-copy">Thanks for shopping with Northstar. We&apos;ve saved the details and you can follow along from your account.</p>

        <div className="success-summary">
          <div><span>Order number</span><strong>{orderNumber || id || "Confirmed"}</strong></div>
          {total != null && <div><span>Order total</span><strong>${total.toFixed(2)}</strong></div>}
          <div><span>Next step</span><strong>We&apos;ll get it ready</strong></div>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="button-dark"><FiPackage /> View your orders</Link>
          <Link to="/products" className="text-link">Keep exploring <FiArrowRight /></Link>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccessPage;