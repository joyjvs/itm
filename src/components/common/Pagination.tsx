import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisible = 5;
  let visiblePages = pages;

  if (totalPages > maxVisible) {
    const start = Math.max(
      1,
      Math.min(currentPage - 2, totalPages - maxVisible + 1),
    );
    const end = Math.min(totalPages, start + maxVisible - 1);
    visiblePages = pages.slice(start - 1, end);
  }

  return (
    <nav
      className={`flex flex-wrap justify-center items-center gap-2 mt-4 ${className}`}
      aria-label="Paginación"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded border border-gray-300 bg-white text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {visiblePages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded border text-sm ${
            page === currentPage
              ? "border-primary bg-primary text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Ir a la página ${page}`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded border border-gray-300 bg-white text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
