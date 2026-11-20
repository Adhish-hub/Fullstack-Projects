import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { productQueryKeys } from "../lib/query-keys";

import { Plus, Pencil, Trash2, Package, RefreshCw } from "lucide-react";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/products.service";

import type {
  Product,
  ProductInput,
  ProductSearchParams,
} from "../types/product";

import ProductForm from "../components/products/ProductForm";
import ProductPagination from "../components/products/ProductPagination";

const initialFilters: ProductSearchParams = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const AdminProductsPage = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<ProductSearchParams>(initialFilters);

  const [searchInput, setSearchInput] = useState("");
  
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

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined,
  );

  const [feedback, setFeedback] = useState("");

  // FETCH PRODUCTS
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: productQueryKeys.list(filters),
    queryFn: () => getProducts(filters),
  });

  // CREATE PRODUCT MUTATION
  const createMutation = useMutation({
    mutationFn: createProduct,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      });

      setFeedback("Product created successfully.");
      closeForm();
    },
  });

  // UPDATE PRODUCT MUTATION
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      productData,
    }: {
      id: string;
      productData: ProductInput;
    }) => updateProduct(id, productData),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      });

      setFeedback("Product updated successfully.");
      closeForm();
    },
  });

  // DELETE PRODUCT MUTATION
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      });

      setFeedback("Product deleted successfully.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const mutationError =
    createMutation.error ?? updateMutation.error ?? deleteMutation.error;

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleCreate = () => {
    setFeedback("");
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setFeedback("");
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSubmit = (productData: ProductInput) => {
    setFeedback("");

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct._id,
        productData,
      });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setFeedback("");
    deleteMutation.mutate(product._id);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

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

  

  if (isPending && !data) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-gray-500">Loading admin products...</p>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-red-600">
          Unable to load products
        </h1>

        <p className="mt-2 text-sm text-gray-500">{error.message}</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* HEADER */}
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Administration
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create, update and manage your product inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </section>

      {/* SUMMARY */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-indigo-600" />

            <div>
              <p className="text-sm text-gray-500">Total Products</p>

              <p className="text-2xl font-bold text-gray-900">
                {data?.meta.total ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            In-stock products on this page
          </p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {data?.data.filter((product) => product.stock > 0).length ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            Out-of-stock products on this page
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {data?.data.filter((product) => product.stock === 0).length ?? 0}
          </p>
        </div>
      </section>

      {/* FEEDBACK */}
      {feedback && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {feedback}
        </div>
      )}

      {mutationError && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {mutationError.message}
        </div>
      )}

      {/* SEARCH */}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <label
          htmlFor="admin-search"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Search products
        </label>

        <input
          id="admin-search"
          type="search"
          value={searchInput}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search by product name, description or SKU..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </section>

      {/* PRODUCT TABLE */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Products</h2>

          {isFetching && (
            <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
          )}
        </div>

        {data?.data.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-4 font-semibold text-gray-800">
              No products found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">SKU</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data?.data.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="h-11 w-11 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}

                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {product.sku}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} units`
                          : "Out of stock"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          aria-label={`Edit ${product.name}`}
                          className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={deleteMutation.isPending}
                          onClick={() => handleDelete(product)}
                          aria-label={`Delete ${product.name}`}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* PAGINATION */}
      {data && data.meta.total > 0 && (
        <ProductPagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          hasNextPage={data.meta.hasNextPage}
          hasPreviousPage={data.meta.hasPreviousPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* CREATE / EDIT FORM */}
      {isFormOpen && (
        <ProductForm
          key={editingProduct?._id ?? "new-product"}
          product={editingProduct}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </main>
  );
};

export default AdminProductsPage;
