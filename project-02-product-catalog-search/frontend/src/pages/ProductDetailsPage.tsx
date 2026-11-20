import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package } from "lucide-react";

import { getProductById } from "../services/products.service";

import { productQueryKeys } from "../lib/query-keys";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: productQueryKeys.detail(id ?? ""),
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });

  if (isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Unable to load product
        </h2>

        <p className="mt-2 text-sm text-gray-500">{error.message}</p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isInStock = product.stock > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid gap-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
        <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full max-h-125 w-full object-cover"
            />
          ) : (
            <Package className="h-24 w-24 text-gray-400" />
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            {product.category}
          </p>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <p className="mt-5 leading-7 text-gray-600">{product.description}</p>

          <p className="mt-8 text-3xl font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                isInStock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </span>

            <span className="text-sm text-gray-500">
              {product.stock} units available
            </span>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">Product SKU</p>

            <p className="mt-1 font-medium text-gray-900">{product.sku}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
