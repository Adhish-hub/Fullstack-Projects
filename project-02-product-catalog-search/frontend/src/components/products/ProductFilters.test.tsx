import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ProductFilters from "./ProductFilters";
import type { ProductSearchParams } from "../../types/product";

const filters: ProductSearchParams = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

describe("ProductFilters", () => {
  it("renders the search and filter controls", () => {
    render(
      <ProductFilters
        filters={filters}
        searchInput=""
        onSearchInputChange={vi.fn()}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Search products")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Availability")).toBeInTheDocument();
    expect(screen.getByLabelText("Minimum price (₹)")).toBeInTheDocument();
    expect(screen.getByLabelText("Maximum price (₹)")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort by")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort order")).toBeInTheDocument();
  });

  it("sends search input changes to the parent", () => {
    const onSearchInputChange = vi.fn();

    render(
      <ProductFilters
        filters={filters}
        searchInput=""
        onSearchInputChange={onSearchInputChange}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Search products"), {
      target: { value: "keyboard" },
    });

    expect(onSearchInputChange).toHaveBeenCalledWith("keyboard");
  });

  it("converts minimum price input to a number", () => {
    const onFilterChange = vi.fn();

    render(
      <ProductFilters
        filters={filters}
        searchInput=""
        onSearchInputChange={vi.fn()}
        onFilterChange={onFilterChange}
        onReset={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Minimum price (₹)"), {
      target: { value: "500" },
    });

    expect(onFilterChange).toHaveBeenCalledWith("minPrice", 500);
  });

  it("converts availability selection to a boolean", () => {
    const onFilterChange = vi.fn();

    render(
      <ProductFilters
        filters={filters}
        searchInput=""
        onSearchInputChange={vi.fn()}
        onFilterChange={onFilterChange}
        onReset={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Availability"), {
      target: { value: "true" },
    });

    expect(onFilterChange).toHaveBeenCalledWith("inStock", true);
  });

  it("resets filters when Reset filters is clicked", () => {
    const onReset = vi.fn();

    render(
      <ProductFilters
        filters={filters}
        searchInput=""
        onSearchInputChange={vi.fn()}
        onFilterChange={vi.fn()}
        onReset={onReset}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Reset filters/i }));

    expect(onReset).toHaveBeenCalledOnce();
  });
});
