import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiArrowRight, FiHeart, FiTrash2 } from "react-icons/fi";
import { clearWishlist, getWishlist } from "../api/wishlist.api";
import type { WishlistItem } from "../api/wishlist.api";
import ProductGrid from "../components/product/product-grid";
import NavBar from "../components/header";
import AuthRequired, { isAuthError } from "../components/auth-required";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["wishlist"], queryFn: getWishlist });
  const rawItems = data?.data;
  const items: WishlistItem[] = Array.isArray(rawItems) ? rawItems : [];

  const clearMutation = useMutation({
    mutationFn: clearWishlist,
    onSuccess: () => {
      toast.success("Wishlist cleared");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (mutationError: unknown) => {
      toast.error(mutationError instanceof Error ? mutationError.message : "Couldn’t clear your wishlist.");
    },
  });

  return (
    <main className="site-shell commerce-page">
      <NavBar />
      <div className="section-wrap section-space">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">The good ones you saved</span>
            <h1 className="page-title">Your wishlist</h1>
          </div>
          {items.length > 0 && (
            <button type="button" className="button-outline" disabled={clearMutation.isPending} onClick={() => clearMutation.mutate()}>
              <FiTrash2 /> Clear all
            </button>
          )}
        </div>

        {error ? (
          isAuthError(error)
            ? <AuthRequired title="Sign in to see your wishlist" message="Your saved favorites will be waiting here." />
            : <div className="empty-state"><h2>Your wishlist couldn’t load</h2><p>Check your connection and try again.</p><Link to="/products" className="button-dark">Browse the collection <FiArrowRight /></Link></div>
        ) : isLoading ? (
          <ProductGrid products={[]} loading columns={4} />
        ) : items.length === 0 ? (
          <div className="empty-state section-space">
            <FiHeart style={{ width: 34, height: 34, margin: "0 auto 18px", color: "#81867c" }} />
            <h2>A little room for favorites.</h2>
            <p>Tap the heart on anything you love and it’ll be waiting here.</p>
            <Link to="/products" className="button-dark">Find something lovely <FiArrowRight /></Link>
          </div>
        ) : (
          <>
            <p className="listing-count" style={{ marginBottom: 20 }}>{items.length} saved {items.length === 1 ? "find" : "finds"}</p>
            <ProductGrid products={items.map((item) => item.product)} columns={4} />
          </>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;