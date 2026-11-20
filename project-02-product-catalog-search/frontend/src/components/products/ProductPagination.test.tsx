import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ProductPagination from "./ProductPagination";

describe("ProductPagination", () => {
  it("does not render when there is only one page", () => {
    const { container } = render(
      <ProductPagination
        currentPage={1}
        totalPages={1}
        hasNextPage={false}
        hasPreviousPage={false}
        onPageChange={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("displays the current page and total pages", () => {
    render(
      <ProductPagination
        currentPage={2}
        totalPages={5}
        hasNextPage
        hasPreviousPage
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("requests the previous page", () => {
    const onPageChange = vi.fn();

    render(
      <ProductPagination
        currentPage={2}
        totalPages={5}
        hasNextPage
        hasPreviousPage
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Previous/i }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("requests the next page", () => {
    const onPageChange = vi.fn();

    render(
      <ProductPagination
        currentPage={2}
        totalPages={5}
        hasNextPage
        hasPreviousPage
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables Previous on the first page", () => {
    render(
      <ProductPagination
        currentPage={1}
        totalPages={3}
        hasNextPage
        hasPreviousPage={false}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
  });

  it("disables Next on the last page", () => {
    render(
      <ProductPagination
        currentPage={3}
        totalPages={3}
        hasNextPage={false}
        hasPreviousPage
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
  });
});
