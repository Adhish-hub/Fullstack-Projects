import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

import { getProducts } from "../services/products.service";

import type { ProductSearchParams } from "../types/product";

import ProductGrid from "../components/products/ProductGrid";
import ProductFilters from "../components/products/ProductFilters";
import ProductPagination from "../components/products/ProductPagination";

const initialFilters: ProductSearchParams = {
  search: undefined,
  category: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  inStock: undefined,
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const ProductsPage = () => {
  const [filters, setFilters] = useState<ProductSearchParams>(initialFilters);

  const [searchInput, setSearchInput] = useState("");

  // Debounce the search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((previous) => ({
        ...previous,
        search: searchInput.trim() || undefined,
        page: 1,
      }));
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Fetch products using the current filters
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    placeholderData: keepPreviousData,
  });

  // Update an individual filter
  const handleFilterChange = <K extends keyof ProductSearchParams>(
    key: K,
    value: ProductSearchParams[K],
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      page: 1,
    }));
  };

  // Reset every filter
  const handleReset = () => {
    setSearchInput("");
    setFilters({ ...initialFilters });
  };

  // Change the current page
  const handlePageChange = (page: number) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Initial loading state
  if (isPending && !data) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError && !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Unable to load products
        </h2>

        <p className="mt-2 text-sm text-gray-500">{error.message}</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page heading */}
      <section className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Explore our collection
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Our Products
        </h1>

        <p className="mt-3 max-w-2xl text-gray-500">
          Discover products across different categories. Search, filter and find
          exactly what you need.
        </p>
      </section>

      {/* Search and filters */}
      <ProductFilters
        filters={filters}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Results information */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {data?.data.length ?? 0}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {data?.meta.total ?? 0}
          </span>{" "}
          products
        </p>

        {isFetching && (
          <p className="text-sm text-indigo-600">Updating results...</p>
        )}
      </div>

      {/* Product results */}
      <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
        <ProductGrid products={data?.data ?? []} />
      </div>

      {/* Pagination */}
      {data && data.meta.total > 0 && (
        <ProductPagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          hasNextPage={data.meta.hasNextPage}
          hasPreviousPage={data.meta.hasPreviousPage}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

export default ProductsPage;
