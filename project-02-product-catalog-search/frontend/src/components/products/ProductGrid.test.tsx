import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import type { Product } from "../../types/product";

const products: Product[] = [
  {
    _id: "product-1",
    name: "Wireless Keyboard",
    description: "Mechanical keyboard",
    price: 2499,
    category: "Electronics",
    stock: 10,
    sku: "KEY-001",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: "product-2",
    name: "Gaming Mouse",
    description: "Wireless gaming mouse",
    price: 1499,
    category: "Electronics",
    stock: 0,
    sku: "MOUSE-001",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("ProductGrid", () => {
  it("displays the empty state when there are no products", () => {
    render(
      <MemoryRouter>
        <ProductGrid products={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("renders a card for every product", () => {
    render(
      <MemoryRouter>
        <ProductGrid products={products} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Wireless Keyboard" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Gaming Mouse" }),
    ).toBeInTheDocument();

    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });
});
