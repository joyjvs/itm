export interface Banner {
  id: string;
  name: string;
  description?: string;
  link?: string;
  imageUrl: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannersResponse {
  data: Banner[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
