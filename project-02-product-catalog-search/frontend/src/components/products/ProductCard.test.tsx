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
  it("displays the product information", () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Wireless Headphones" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Noise cancelling headphones")).toBeInTheDocument();
    expect(screen.getByText(/₹2,499/)).toBeInTheDocument();
    expect(screen.getByText("SKU: HEADPHONE-001")).toBeInTheDocument();
  });

  it("shows In Stock when stock is greater than zero", () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("shows Out of Stock when stock is zero", () => {
    const outOfStockProduct = { ...product, stock: 0 };

    render(
      <MemoryRouter>
        <ProductCard product={outOfStockProduct} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("renders the product image when imageUrl is provided", () => {
    const productWithImage = {
      ...product,
      imageUrl: "https://example.com/headphones.jpg",
    };

    render(
      <MemoryRouter>
        <ProductCard product={productWithImage} />
      </MemoryRouter>,
    );

    const image = screen.getByRole("img", {
      name: "Wireless Headphones",
    });

    expect(image).toHaveAttribute("src", "https://example.com/headphones.jpg");
  });

  it("renders the placeholder icon when imageUrl is missing", () => {
    const { container } = render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("links the product image and name to the product details route", () => {
    const { container } = render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    const productLinks = container.querySelectorAll(
      'a[href="/products/product-123"]',
    );

    expect(productLinks).toHaveLength(2);
  });
});
