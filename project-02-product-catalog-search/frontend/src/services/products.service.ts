import api from "../lib/axios";

import type {
  Product,
  ProductInput,
  ProductsResponse,
  ProductSearchParams,
} from "../types/product";

// GET ALL PRODUCTS
export const getProducts = async (
  params?: ProductSearchParams,
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("/products", {
    params,
  });

  return response.data;
};

// GET PRODUCT BY ID
export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);

  return response.data;
};

// CREATE PRODUCT
export const createProduct = async (
  productData: ProductInput,
): Promise<Product> => {
  const response = await api.post<Product>("/products", productData);

  return response.data;
};

// UPDATE PRODUCT
export const updateProduct = async (
  id: string,
  productData: ProductInput,
): Promise<Product> => {
  const response = await api.patch<Product>(`/products/${id}`, productData);

  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id: string): Promise<Product> => {
  const response = await api.delete<Product>(`/products/${id}`);

  return response.data;
};
