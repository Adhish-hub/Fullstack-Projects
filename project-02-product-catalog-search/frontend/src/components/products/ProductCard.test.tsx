import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProductCard from "./ProductCard";
import type { Product } from "../../types/product";

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

describe("ProductCard", () => {
  it("displays product information", () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();

    expect(screen.getByText("Electronics")).toBeInTheDocument();

    expect(screen.getByText(/2499/)).toBeInTheDocument();
  });
});
