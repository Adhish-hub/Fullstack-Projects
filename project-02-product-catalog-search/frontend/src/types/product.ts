export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  data: Product[];
  meta: ProductMeta;
}

export interface ProductSearchParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page: number;
  limit: number;
  sortBy: "name" | "price" | "createdAt";
  sortOrder: "asc" | "desc";
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  imageUrl?: string;
}
