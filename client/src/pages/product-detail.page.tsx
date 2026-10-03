import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiHeart,
  FiShoppingBag,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiChevronRight,
} from "react-icons/fi";
import { getProductById, getProducts } from "../api/product.api";
import { addToCart } from "../api/cart.api";
import { toggleWishlist } from "../api/wishlist.api";
import ProductGrid from "../components/product/product-grid";
import NavBar from "../components/header";
import toast from "react-hot-toast";
import { mediaUrl } from "../utils/media";
import { effectivePrice, discountPercent } from "../utils/pricing";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["related-products", data?.data?.category?._id],
    queryFn: () =>
      getProducts({
        category: data?.data?.category?._id,
        limit: 4,
      }),
    enabled: !!data?.data?.category?._id,
  });

  type RelatedProduct = { _id: string; name: string; price: number; stock: number; cover_image?: { path: string }; category?: { _id: string; name: string } };

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(id!, quantity),
    onSuccess: () => {
      toast.success("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add to cart");
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: () => toggleWishlist(id!),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update wishlist");
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data?.data) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/products" className="text-blue-600 hover:text-blue-700">
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  const product = data.data;
  const images = [product.cover_image, ...(product.images || [])].filter(Boolean);
  const relatedProducts = (relatedData?.data || []).filter((p: RelatedProduct) => p._id !== product._id).slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <FiChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <FiChevronRight className="w-4 h-4" />
          <Link to={`/products?category=${product.category?._id}`} className="hover:text-blue-600">
            {product.category?.name}
          </Link>
          <FiChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-white rounded-xl overflow-hidden mb-4">
              <img
                src={mediaUrl(images[selectedImage]?.path) || "/placeholder-product.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-blue-600" : "border-gray-200"
                    }`}
                  >
                    <img src={mediaUrl(img?.path)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Brand */}
            <div className="flex items-center gap-2 mb-4">
              <Link
                to={`/products?category=${product.category?._id}`}
                className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100"
              >
                {product.category?.name}
              </Link>
              <Link
                to={`/products?brand=${product.brand?._id}`}
                className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
              >
                {product.brand?.name}
              </Link>
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-3xl font-bold text-gray-900">
                ${effectivePrice(product).toFixed(2)}
              </span>
              {discountPercent(product) > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                    -{discountPercent(product)}% OFF
                  </span>
                </>
              )}
              {product.stock > 0 && product.stock < 10 && (
                <span className="text-sm text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                  Only {product.stock} left in stock
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-red-600 font-medium">
                  <span className="w-2 h-2 bg-red-600 rounded-full" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <FiMinus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending || product.stock === 0}
                className="flex-1 min-w-[200px] bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="w-5 h-5" />
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </button>

              <button
                onClick={() => toggleWishlistMutation.mutate()}
                disabled={toggleWishlistMutation.isPending}
                className="p-3 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-6 h-6 text-gray-600 hover:text-red-500" />
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiTruck className="w-5 h-5 text-blue-600" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiShield className="w-5 h-5 text-blue-600" />
                <span>Secure payment with SSL encryption</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiRefreshCw className="w-5 h-5 text-blue-600" />
                <span>30-day easy returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;