import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiLock, FiCreditCard, FiMapPin, FiUser } from "react-icons/fi";
import { getCart } from "../api/cart.api";
import type { Cart, CartItem } from "../api/cart.api";
import { createOrder } from "../api/order.api";
import NavBar from "../components/header";
import AuthRequired, { isAuthError } from "../components/auth-required";
import toast from "react-hot-toast";
import { mediaUrl } from "../utils/media";
import { effectivePrice } from "../utils/pricing";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { data: cartData, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  type CartResponse = { data?: Cart };
  const cart = (cartData as CartResponse)?.data;

  const [formData, setFormData] = useState({
    // Shipping
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    // Payment
    cardNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear the error as soon as the user edits the field
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  /** Validate shipping (step 1) or payment (step 2) fields */
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) errs.firstName = "First name is required";
      if (!formData.lastName.trim()) errs.lastName = "Last name is required";
      if (!formData.email.trim()) {
        errs.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = "Enter a valid email address";
      }
      if (!formData.address.trim()) errs.address = "Address is required";
      if (!formData.city.trim()) errs.city = "City is required";
      if (!formData.state.trim()) errs.state = "State is required";
      if (!formData.zipCode.trim()) {
        errs.zipCode = "ZIP / postal code is required";
      } else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(formData.zipCode)) {
        errs.zipCode = "Enter a valid ZIP / postal code";
      }
    }

    if (currentStep === 2) {
      if (paymentMethod === "card") {
        const digits = formData.cardNumber.replace(/\s+/g, "");
        if (!digits) {
          errs.cardNumber = "Card number is required";
        } else if (!/^\d{13,19}$/.test(digits)) {
          errs.cardNumber = "Enter a valid card number (13–19 digits)";
        }
      }
    }

    setFieldErrors(errs);
    const ok = Object.keys(errs).length === 0;
    if (!ok) toast.error("Please fix the highlighted fields");
    return ok;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Re-validate both steps before placing the order
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    if (!validateStep(2)) {
      setStep(2);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await createOrder({
        shipping_address: {
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip_code: formData.zipCode.trim(),
          country: formData.country,
        },
        payment_method: paymentMethod,
        ...(paymentMethod === "card" ? { card_number: formData.cardNumber } : {}),
      });

      const order = response?.data;
      toast.success("Order placed successfully!");
      // cart is now empty server-side
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(`/order-success/${order?._id}`, {
        state: { orderNumber: order?.order_number, total: order?.total },
      });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to place order. Please try again."));
      setIsProcessing(false);
    }
  };

  const items = cart?.items || [];
  const subtotal = cart?.total_amount || 0;
  const shipping = subtotal >= 50 ? 0 : 5;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <main className="site-shell">
        <NavBar />
        <div className="section-wrap checkout-wrap">
          <div className="animate-pulse space-y-4 pt-8">
            <div className="product-skeleton-line" />
            <div className="product-skeleton" style={{ height: "400px" }} />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="site-shell">
        <NavBar />
        <div className="section-wrap section-space">
          <h1 className="page-title">Checkout</h1>
          {isAuthError(error) ? (
            <AuthRequired
              title="Sign in to check out"
              message="Sign in to complete your order with your saved cart."
            />
          ) : (
            <div className="empty-state">
              <h2 style={{ color: "var(--red)" }}>Unable to load your cart</h2>
              <p>
                {getErrorMessage(error, "Please try again later")}
              </p>
              <Link to="/products" className="button-primary">
                Continue shopping
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="site-shell">
        <NavBar />
        <div className="section-wrap empty-state section-space" style={{ marginTop: 20 }}>
          <h2>Your cart is empty</h2>
          <p>Add some products before checking out</p>
          <Link
            to="/products"
            className="button-primary"
          >
            Browse Phones
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="site-shell commerce-page checkout-page">
      <NavBar />

      <div className="section-wrap checkout-wrap" style={{ paddingTop: 38 }}>
        <span className="section-eyebrow">Almost yours</span>
        <h1 className="page-title" style={{ marginBottom: 28 }}>Checkout</h1>

        {/* Progress Steps */}
        <div className="checkout-progress flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 "}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium ">Shipping</span>
          </div>
          <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 "}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium ">Payment</span>
          </div>
          <div className={`w-16 h-0.5 mx-4 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`} />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 "}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium ">Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold  mb-6 flex items-center gap-2">
                    <FiMapPin className="w-5 h-5 text-blue-600" />
                    Shipping Address
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium  mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={fieldErrors.firstName ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium  mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={fieldErrors.lastName ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium  mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={fieldErrors.email ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium  mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={fieldErrors.phone ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      />
                      {fieldErrors.phone && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium  mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className={fieldErrors.address ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      />
                      {fieldErrors.address && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium  mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className={fieldErrors.city ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      />
                      {fieldErrors.city && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium  mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className={fieldErrors.state ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      />
                      {fieldErrors.state && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium  mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className={fieldErrors.zipCode ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      />
                      {fieldErrors.zipCode && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium  mb-1">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={fieldErrors.country ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { goNext() }}
                    className="mt-6 w-full button-primary"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold  mb-6 flex items-center gap-2">
                    <FiCreditCard className="w-5 h-5 text-blue-600" />
                    Payment Method
                  </h2>

                  <div className="payment-choices">
                    <label className={paymentMethod === "cod" ? "payment-choice selected" : "payment-choice"}>
                      <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                      <span><strong>Cash on delivery</strong><small>Pay when your order arrives.</small></span>
                    </label>
                    <label className={paymentMethod === "card" ? "payment-choice selected" : "payment-choice"}>
                      <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                      <span><strong>Card · demo only</strong><small>No payment processor is connected.</small></span>
                    </label>
                  </div>

                  {paymentMethod === "card" && <p className="payment-demo-note">Use test details only. This checkout records an order but does not charge a card.</p>}

                  {paymentMethod === "card" && (
                    <div className="payment-card-field">
                      <label className="block text-sm font-medium  mb-1" htmlFor="cardNumber">Card number</label>
                      <input
                        id="cardNumber"
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        maxLength={23}
                        required
                        className={fieldErrors.cardNumber ? "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-500 focus:ring-red-500" : "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
                      />
                      {fieldErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{fieldErrors.cardNumber}</p>}
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 button-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => goNext()}
                      className="flex-1 button-primary"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold  mb-6 flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-blue-600" />
                    Review Your Order
                  </h2>

                  {/* Shipping Summary */}
                  <div className="mb-6">
                    <h3 className="font-medium  mb-2">Shipping Address</h3>
                    <p className=" text-sm">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zipCode}<br />
                      {formData.country}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="mb-6">
                    <h3 className="font-medium  mb-2">Payment Method</h3>
                    <p className=" text-sm">
                      {paymentMethod === "cod" ? "Cash on delivery" : `Demo card ending in ${formData.cardNumber.replace(/\s+/g, "").slice(-4)}`}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-medium  mb-2">Items ({items.length})</h3>
                    <div className="space-y-3">
                      {items.map((item: CartItem) => (
                        <div key={item._id} className="flex items-center gap-3">
                          <img
                            src={mediaUrl(item.product?.cover_image?.path) || "/placeholder-product.jpg"}
                            alt={item.product?.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium  truncate">
                              {item.product?.name}
                            </p>
                            <p className="text-xs ">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-medium">
                            ${(item.product ? effectivePrice(item.product) * item.quantity : 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 button-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 button-primary flex items-center justify-center gap-2"
                    >
                      <FiLock className="w-4 h-4" />
                      {isProcessing ? "Processing..." : "Place Order"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                <h2 className="font-semibold  mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between ">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between ">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between ">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg ">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm ">
                  <FiLock className="w-4 h-4" />
                  <span>Final stock and totals are confirmed when you place your order.</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;