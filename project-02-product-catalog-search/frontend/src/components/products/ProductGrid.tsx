import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
        <h3 className="text-lg font-semibold text-gray-700">
          No products found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          There are currently no products to display.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
