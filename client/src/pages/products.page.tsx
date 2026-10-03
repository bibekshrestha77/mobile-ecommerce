import { useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FiFilter, FiGrid, FiList, FiX } from "react-icons/fi";
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const isFeatured = searchParams.get("featured") === "true";
  const newArrival = searchParams.get("new_arrival") === "true";

  const { data, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ["products", page, search, category, brand, minPrice, maxPrice, sortBy, sortOrder, isFeatured, newArrival],
    queryFn: () =>
      getProducts({
        page,
        limit: 12,
        search,
        category,
        brand,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy,
        sortOrder,
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

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const categories = categoriesData?.data && Array.isArray(categoriesData.data) ? categoriesData.data : [];
  const brands = brandsData?.data && Array.isArray(brandsData.data) ? brandsData.data : [];
  const products = data?.data || [];
  const pagination = data?.pagination;

  const activeFiltersCount = [search, category, brand, minPrice, maxPrice].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isFeatured ? "Featured Products" : newArrival ? "New Arrivals" : "All Products"}
            </h1>
            {pagination && (
              <p className="text-gray-500 mt-1">
                Showing {products.length} of {pagination.total} products
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => updateFilters("search", e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiFilter className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split("-");
                updateFilters("sortBy", by);
                updateFilters("sortOrder", order);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>

            {/* View Mode */}
            <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <FiX className="w-4 h-4" /> Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!category}
                      onChange={() => updateFilters("category", "")}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-600">All Categories</span>
                  </label>
                  {categories.map((cat: Category) => (
                    <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat._id}
                        onChange={() => updateFilters("category", cat._id)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={!brand}
                      onChange={() => updateFilters("brand", "")}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-600">All Brands</span>
                  </label>
                  {brands.map((b: Brand) => (
                    <label key={b._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        checked={brand === b._id}
                        onChange={() => updateFilters("brand", b._id)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-600">{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateFilters("minPrice", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateFilters("maxPrice", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Featured/New Arrival */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Special</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => updateFilters("featured", e.target.checked ? "true" : "")}
                      className="text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-600">Featured Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newArrival}
                      onChange={(e) => updateFilters("new_arrival", e.target.checked ? "true" : "")}
                      className="text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-600">New Arrivals Only</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {error ? (
              <div className="text-center py-16">
                <p className="text-red-500">Error loading products. Please try again.</p>
              </div>
            ) : (
              <>
                <ProductGrid products={products} loading={isLoading} columns={viewMode === "list" ? 3 : 4} />

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateFilters("page", String(page - 1))}
                        disabled={page <= 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => updateFilters("page", String(i + 1))}
                          className={`px-4 py-2 rounded-lg ${
                            page === i + 1
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => updateFilters("page", String(page + 1))}
                        disabled={page >= pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductListingPage;