import { Pagination } from "./Pagination";
import { PageSizeSelector } from "./PageSizeSelector";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 20, 50],
  className = "",
}: PaginationControlsProps) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {totalItems !== undefined ? (
            <>
              Mostrando <strong>{itemsPerPage}</strong> por página •{" "}
              <strong>{totalItems}</strong> elementos totales
            </>
          ) : (
            <span>Controla la paginación de la lista.</span>
          )}
        </div>

        <PageSizeSelector
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          options={pageSizeOptions}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
