import { Link } from "react-router-dom";
import { Package } from "lucide-react";

import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isInStock = product.stock > 0;

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${product._id}`}>
        <div className="flex h-52 items-center justify-center bg-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <Package className="h-16 w-16 text-gray-400" />
          )}
        </div>
      </Link>

      <div className="p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {product.category}
        </p>

        <Link to={`/products/${product._id}`}>
          <h2 className="mb-2 text-lg font-semibold text-gray-900 hover:text-indigo-600">
            {product.name}
          </h2>
        </Link>

        <p className="mb-4 line-clamp-2 text-sm text-gray-500">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isInStock
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isInStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <p className="mt-3 text-xs text-gray-400">SKU: {product.sku}</p>
      </div>
    </article>
  );
};

export default ProductCard;
