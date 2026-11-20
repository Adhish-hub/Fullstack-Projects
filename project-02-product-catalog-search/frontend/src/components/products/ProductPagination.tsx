import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

const ProductPagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: ProductPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Product pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-4"
    >
      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <span className="text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default ProductPagination;
