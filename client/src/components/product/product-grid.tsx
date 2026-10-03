import type { Product } from "../../api/product.api";
import ProductCard from "./product-card";
import type { CSSProperties } from "react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: 2 | 3 | 4 | 5;
}

const ProductGrid = ({ products, loading = false, columns = 4 }: ProductGridProps) => {
  if (loading) {
    return (
      <div className="product-grid" style={{ "--columns": columns } as CSSProperties} aria-label="Loading products">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="product-card">
            <div className="product-media product-skeleton" />
            <div className="product-info">
              <div className="product-skeleton-line short" />
              <div className="product-skeleton-line" />
              <div className="product-skeleton-line price" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h3>Nothing here just yet</h3>
        <p>Try another search or browse the full collection.</p>
      </div>
    );
  }

  return (
    <div className="product-grid" style={{ "--columns": columns } as CSSProperties}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;