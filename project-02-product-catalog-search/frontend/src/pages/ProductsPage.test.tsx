import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MemoryRouter } from "react-router-dom";

import ProductsPage from "./ProductsPage";
import { getProducts } from "../services/products.service";
import type { ProductsResponse, Product } from "../types/product";

vi.mock("../services/products.service", () => ({
  getProducts: vi.fn(),
}));

const mockedGetProducts = vi.mocked(getProducts);

const product: Product = {
  _id: "product-123",
  name: "Wireless Headphones",
  description: "Noise cancelling headphones",
  price: 2499,
  category: "Electronics",
  stock: 10,
  sku: "HEADPHONE-001",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const response: ProductsResponse = {
  data: [product],
  meta: {
    total: 11,
    page: 1,
    limit: 10,
    totalPages: 2,
    hasNextPage: true,
    hasPreviousPage: false,
  },
};

function renderProductsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("ProductsPage", () => {
  beforeEach(() => {
    mockedGetProducts.mockReset();
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays products returned by the service", async () => {
    mockedGetProducts.mockResolvedValue(response);

    renderProductsPage();

    expect(await screen.findByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("11").closest("p")).toHaveTextContent(
      "Showing 1 of 11 products",
    );
  });

  it("displays the empty state when the service returns no products", async () => {
    mockedGetProducts.mockResolvedValue({
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    renderProductsPage();

    expect(await screen.findByText("No products found")).toBeInTheDocument();
  });

  it("displays an error and allows the user to retry", async () => {
    mockedGetProducts
      .mockRejectedValueOnce(new Error("API unavailable"))
      .mockResolvedValueOnce(response);

    renderProductsPage();

    expect(
      await screen.findByText("Unable to load products"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Try again/i }));

    expect(await screen.findByText("Wireless Headphones")).toBeInTheDocument();
  });

  it("requests products again when the category changes", async () => {
    mockedGetProducts.mockResolvedValue(response);

    renderProductsPage();

    await screen.findByText("Wireless Headphones");

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Electronics" },
    });

    await waitFor(() => {
      expect(mockedGetProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          category: "Electronics",
          page: 1,
        }),
      );
    });
  });

  it("requests the next page when pagination is used", async () => {
    mockedGetProducts.mockResolvedValue(response);

    renderProductsPage();

    await screen.findByText("Wireless Headphones");

    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    await waitFor(() => {
      expect(mockedGetProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 2,
        }),
      );
    });
  });
});
