export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Tipo específico para respuestas de API que devuelven paginación directamente
export interface ApiPaginatedResponse<T> {
  data: T[];
  total: number | string;
  page: number | string;
  limit: number | string;
  totalPages: number | string;
}
