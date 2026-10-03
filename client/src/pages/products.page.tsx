import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft, FiArrowRight, FiFilter, FiSearch, FiX } from "react-icons/fi";
import ProductGrid from "../components/product/product-grid";
import { getProducts } from "../api/product.api";
import type { ProductsResponse } from "../api/product.api";
import { getCategories } from "../api/category.api";
import type { Category } from "../api/category.api";
import { getBrands } from "../api/brand.api";
import type { Brand } from "../api/brand.api";
import NavBar from "../components/header";

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const isFeatured = searchParams.get("featured") === "true";
  const newArrival = searchParams.get("new_arrival") === "true";
  const [searchDraft, setSearchDraft] = useState(search);

  const { data, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ["products", page, search, category, brand, minPrice, maxPrice, sortBy, sortOrder, isFeatured, newArrival],
    queryFn: () => getProducts({
      page,
      limit: 12,
      search,
      category,
      brand,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
      is_featured: isFeatured || undefined,
      new_arrival: newArrival || undefined,
    }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ limit: 100 }),
  });
  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands({ limit: 100 }),
  });

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const updateSort = (value: string) => {
    const [by, order] = value.split("-");
    const next = new URLSearchParams(searchParams);
    next.set("sortBy", by);
    next.set("sortOrder", order);
    next.set("page", "1");
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchDraft("");
    setSearchParams({});
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateFilter("search", searchDraft.trim());
  };

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
  const brands = Array.isArray(brandsData?.data) ? brandsData.data : [];
  const products = data?.data ?? [];
  const pagination = data?.pagination;
  const activeFiltersCount = [search, category, brand, minPrice, maxPrice].filter(Boolean).length;
  const categoryName = categories.find((item: Category) => item._id === category)?.name;
  const title = search
    ? `Results for “${search}”`
    : categoryName || (isFeatured ? "Staff picks" : newArrival ? "New arrivals" : "All products");
  const totalPages = pagination?.totalPages ?? 1;
  const pageStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, index) => pageStart + index);

  return (
    <main className="site-shell listing-page">
      <NavBar />
      <section className="listing-top">
        <div className="listing-top-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span><span>Shop</span>
          </nav>
          <div className="listing-title-row">
            <div>
              <span className="section-eyebrow">The PhoneVault collection</span>
              <h1>{title}</h1>
              <p>{pagination ? `${pagination.total} premium devices to explore` : "Find something powerful and beautiful."}</p>
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        className={`mobile-filter-backdrop${showFilters ? " is-open" : ""}`}
        aria-label="Close filters"
        onClick={() => setShowFilters(false)}
      />

      <div className="listing-layout">
        <aside className={`filter-panel${showFilters ? " is-open" : ""}`} aria-label="Product filters">
          <div className="filter-heading">
            <h2>Refine your search</h2>
            <button type="button" className="icon-button mobile-filter-close" aria-label="Close filters" onClick={() => setShowFilters(false)}>
              <FiX />
            </button>
            {activeFiltersCount > 0 && (
              <button type="button" className="text-link" onClick={clearFilters}>Clear</button>
            )}
          </div>

          <div className="filter-group">
            <h3>Category</h3>
            <div className="filter-options">
              <label className="filter-option"><input type="radio" name="category" checked={!category} onChange={() => updateFilter("category", "")} />All categories</label>
              {categories.map((item: Category) => (
                <label className="filter-option" key={item._id}>
                  <input type="radio" name="category" checked={category === item._id} onChange={() => updateFilter("category", item._id)} />
                  {item.name}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Maker</h3>
            <div className="filter-options">
              <label className="filter-option"><input type="radio" name="brand" checked={!brand} onChange={() => updateFilter("brand", "")} />All makers</label>
              {brands.map((item: Brand) => (
                <label className="filter-option" key={item._id}>
                  <input type="radio" name="brand" checked={brand === item._id} onChange={() => updateFilter("brand", item._id)} />
                  {item.name}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Price range</h3>
            <div className="price-fields">
              <input aria-label="Minimum price" type="number" min="0" placeholder="Min $" value={minPrice} onChange={(event) => updateFilter("minPrice", event.target.value)} />
              <input aria-label="Maximum price" type="number" min="0" placeholder="Max $" value={maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)} />
            </div>
          </div>

          <div className="filter-group">
            <h3>Curated for you</h3>
            <label className="filter-option"><input type="checkbox" checked={isFeatured} onChange={(event) => updateFilter("featured", event.target.checked ? "true" : "")} />Staff picks</label>
            <label className="filter-option" style={{ marginTop: 10 }}><input type="checkbox" checked={newArrival} onChange={(event) => updateFilter("new_arrival", event.target.checked ? "true" : "")} />New arrivals</label>
          </div>
        </aside>

        <section aria-label="Products">
          <div className="listing-toolbar">
            <span className="listing-count">
              {pagination ? `${products.length} of ${pagination.total} items` : isLoading ? "Finding your next device…" : `${products.length} items`}
            </span>
            <div className="listing-toolbar-actions">
              <button type="button" className="mobile-filter-button" onClick={() => setShowFilters(true)}>
                <FiFilter /> Filters{activeFiltersCount > 0 ? ` · ${activeFiltersCount}` : ""}
              </button>
              <form className="listing-search" role="search" onSubmit={submitSearch}>
                <FiSearch aria-hidden="true" />
                <input aria-label="Search products" type="search" placeholder="Search" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} />
              </form>
              <select
                className="toolbar-select"
                aria-label="Sort products"
                value={`${sortBy}-${sortOrder}`}
                onChange={(event) => updateSort(event.target.value)}
              >
                <option value="createdAt-desc">Recently added</option>
                <option value="createdAt-asc">Oldest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {error ? (
            <div className="empty-state">
              <h2>We couldn&apos;t load the collection</h2>
              <p>Check that the shop service is running, then try again.</p>
              <Link to="/" className="button-primary"><FiArrowLeft /> Back to PhoneVault</Link>
            </div>
          ) : (
            <>
              <ProductGrid products={products} loading={isLoading} columns={4} />
              {pagination && pagination.totalPages > 1 && (
                <nav className="pagination" aria-label="Product pages">
                  <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => updateFilter("page", String(page - 1))}><FiArrowLeft /></button>
                  {pageNumbers.map((pageNumber) => (
                    <button
                      type="button"
                      key={pageNumber}
                      aria-current={page === pageNumber ? "page" : undefined}
                      onClick={() => updateFilter("page", String(pageNumber))}
                    >{pageNumber}</button>
                  ))}
                  <button type="button" aria-label="Next page" disabled={page >= pagination.totalPages} onClick={() => updateFilter("page", String(page + 1))}><FiArrowRight /></button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductListingPage;