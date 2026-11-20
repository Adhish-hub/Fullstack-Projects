import { useState } from "react";
import { X } from "lucide-react";

import type { Product, ProductInput } from "../../types/product";

interface ProductFormProps {
  product?: Product;
  isSubmitting: boolean;
  onSubmit: (data: ProductInput) => void;
  onCancel: () => void;
}

const ProductForm = ({
  product,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    category: product?.category ?? "",
    stock: product?.stock ?? 0,
    sku: product?.sku ?? "",
    imageUrl: product?.imageUrl ?? "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "price" || name === "stock"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      sku: formData.sku.trim(),
      imageUrl: formData.imageUrl?.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {product ? "Edit Product" : "Add New Product"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {product
                ? "Update the product information."
                : "Enter the details of the new product."}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close form"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Product name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              required
              maxLength={1000}
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product"
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Price and stock */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Price (₹) *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Stock Quantity *
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                required
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Category and SKU */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category *
              </label>

              <input
                id="category"
                name="category"
                type="text"
                required
                maxLength={50}
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="sku"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                SKU *
              </label>

              <input
                id="sku"
                name="sku"
                type="text"
                required
                maxLength={50}
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. ELEC-LAP-001"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>

            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl ?? ""}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="mt-1 text-xs text-gray-400">
              Optional. Provide a valid image URL.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : product
                  ? "Save Changes"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
