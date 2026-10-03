import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiArrowRight, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { addToCart, getCart, removeFromCart } from "../api/cart.api";
import type { CartItem } from "../api/cart.api";
import NavBar from "../components/header";
import AuthRequired, { isAuthError } from "../components/auth-required";
import toast from "react-hot-toast";
import { mediaUrl } from "../utils/media";
import { effectivePrice } from "../utils/pricing";

const CartPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["cart"], queryFn: getCart });
  const cart = data?.data;
  const items = cart?.items ?? [];

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      quantity <= 0 ? removeFromCart(productId) : addToCart(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: (mutationError: unknown) => {
      toast.error(mutationError instanceof Error ? mutationError.message : "We couldn’t update your bag.");
    },
  });

  if (isLoading) {
    return <main className="site-shell"><NavBar /><div className="section-wrap section-space"><div className="product-skeleton" style={{ height: 230 }} /></div></main>;
  }

  if (error) {
    return (
      <main className="site-shell">
        <NavBar />
        <div className="section-wrap section-space">
          <h1 className="page-title">Your bag</h1>
          {isAuthError(error)
            ? <AuthRequired title="Sign in to see your bag" message="Your bag is saved to your account, ready when you are." />
            : <div className="empty-state"><h2>Your bag isn’t available right now</h2><p>Check your connection to the shop and try again.</p><Link to="/products" className="button-primary">Keep browsing <FiArrowRight /></Link></div>}
        </div>
      </main>
    );
  }

  const subtotal = cart?.total_amount ?? 0;
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 5;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const estimatedTotal = subtotal + shipping + tax;

  return (
    <main className="site-shell commerce-page">
      <NavBar />
      <div className="section-wrap" style={{ paddingTop: 42 }}>
        <span className="section-eyebrow">Saved for later? Your bag is ready.</span>
        <h1 className="page-title">Your bag <span style={{ color: "var(--text-3)", fontSize: 15, fontWeight: 500 }}>({items.length})</span></h1>
      </div>

      {items.length === 0 ? (
        <div className="section-wrap empty-state section-space">
          <FiShoppingBag style={{ width: 36, height: 36, margin: "0 auto 18px", color: "var(--text-3)" }} />
          <h2>Nothing in your bag. Yet.</h2>
          <p>Take a look around. Your next favorite device might be one click away.</p>
          <Link to="/products" className="button-primary">Explore the collection <FiArrowRight /></Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section aria-label="Items in your bag">
            {items.map((item: CartItem) => {
              const product = item.product;
              const price = effectivePrice(product);
              return (
                <article className="cart-item" key={item._id || product._id}>
                  <Link to={`/products/${product._id}`}>
                    {product.cover_image?.path
                      ? <img className="cart-item-image" src={mediaUrl(product.cover_image.path)} alt={product.name} />
                      : <div className="cart-item-image product-image-fallback">PhoneVault</div>}
                  </Link>
                  <div className="cart-item-copy">
                    <Link to={`/products/${product._id}`}><h2>{product.name}</h2></Link>
                    <p>{product.brand?.name ?? product.category?.name ?? "PhoneVault"}</p>
                    <p style={{ marginTop: 6 }}>${price.toFixed(2)} each</p>
                    <div className="cart-item-controls">
                      <div className="quantity-stepper" aria-label={`Quantity for ${product.name}`}>
                        <button
                          type="button"
                          aria-label={`Remove one ${product.name}`}
                          disabled={updateMutation.isPending}
                          onClick={() => updateMutation.mutate({ productId: product._id, quantity: item.quantity - 1 })}
                        ><FiMinus /></button>
                        <span aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Add one ${product.name}`}
                          disabled={updateMutation.isPending || item.quantity >= product.stock}
                          onClick={() => updateMutation.mutate({ productId: product._id, quantity: item.quantity + 1 })}
                        ><FiPlus /></button>
                      </div>
                      <span className="cart-item-total">${(price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="icon-button cart-remove"
                    aria-label={`Remove ${product.name} from bag`}
                    title="Remove item"
                    disabled={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ productId: product._id, quantity: 0 })}
                  ><FiTrash2 /></button>
                </article>
              );
            })}
            <Link to="/products" className="text-link" style={{ marginTop: 22 }}>Keep exploring <FiArrowRight /></Link>
          </section>

          <aside className="cart-summary" aria-label="Order summary">
            <h2>A quick summary</h2>
            <div className="summary-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-line"><span>Shipping</span><span>{shipping === 0 ? "On us" : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-line"><span>Estimated tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="summary-total"><span>Estimated total</span><span>${estimatedTotal.toFixed(2)}</span></div>
            <Link to="/checkout" className="button-primary">Continue to checkout <FiArrowRight /></Link>
            <p className="cart-summary-note">Final totals are confirmed at checkout. Free shipping on orders over $50.</p>
          </aside>
        </div>
      )}
    </main>
  );
};

export default CartPage;