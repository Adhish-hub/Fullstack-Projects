import { Search, RotateCcw } from "lucide-react";

import type { ProductSearchParams } from "../../types/product";

interface ProductFiltersProps {
  filters: ProductSearchParams;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onFilterChange: <K extends keyof ProductSearchParams>(
    key: K,
    value: ProductSearchParams[K],
  ) => void;
  onReset: () => void;
}

const ProductFilters = ({
  filters,
  searchInput,
  onSearchInputChange,
  onFilterChange,
  onReset,
}: ProductFiltersProps) => {
  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Find Products</h2>
          <p className="text-sm text-gray-500">
            Search and refine your product results.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label
            htmlFor="product-search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search products
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              id="product-search"
              type="search"
              value={searchInput}
              onChange={(event) => onSearchInputChange(event.target.value)}
              placeholder="Search by name, description or SKU..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <input
            id="category"
            type="text"
            value={filters.category ?? ""}
            onChange={(event) =>
              onFilterChange("category", event.target.value || undefined)
            }
            placeholder="Enter category"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Stock */}
        <div>
          <label
            htmlFor="stock"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Availability
          </label>

          <select
            id="stock"
            value={
              filters.inStock === undefined ? "all" : String(filters.inStock)
            }
            onChange={(event) => {
              const value = event.target.value;

              onFilterChange(
                "inStock",
                value === "all" ? undefined : value === "true",
              );
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All products</option>
            <option value="true">In stock</option>
            <option value="false">Out of stock</option>
          </select>
        </div>

        {/* Minimum price */}
        <div>
          <label
            htmlFor="min-price"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Minimum price (₹)
          </label>

          <input
            id="min-price"
            type="number"
            min="0"
            step="0.01"
            value={filters.minPrice ?? ""}
            onChange={(event) =>
              onFilterChange(
                "minPrice",
                event.target.value === ""
                  ? undefined
                  : Number(event.target.value),
              )
            }
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Maximum price */}
        <div>
          <label
            htmlFor="max-price"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Maximum price (₹)
          </label>

          <input
            id="max-price"
            type="number"
            min="0"
            step="0.01"
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              onFilterChange(
                "maxPrice",
                event.target.value === ""
                  ? undefined
                  : Number(event.target.value),
              )
            }
            placeholder="No maximum"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Sort field */}
        <div>
          <label
            htmlFor="sort-by"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Sort by
          </label>

          <select
            id="sort-by"
            value={filters.sortBy}
            onChange={(event) =>
              onFilterChange(
                "sortBy",
                event.target.value as ProductSearchParams["sortBy"],
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="createdAt">Newest</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>

        {/* Sort order */}
        <div>
          <label
            htmlFor="sort-order"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Sort order
          </label>

          <select
            id="sort-order"
            value={filters.sortOrder}
            onChange={(event) =>
              onFilterChange(
                "sortOrder",
                event.target.value as ProductSearchParams["sortOrder"],
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default ProductFilters;
