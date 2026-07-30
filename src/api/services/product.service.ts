import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Product,
  ProductsResponse,
} from "../../types/product.types";

export const productsService = {
  getAll: async (
    //lters: ProductFilters = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<ProductsResponse> => {
    const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
      params: { page, limit },
    });

    const data: Product[] = response.data?.data ?? [];
    const pagination = response.data?.pagination ?? {};

    return {
      data,
      meta: {
        currentPage: pagination.page ?? page,
        itemsPerPage: pagination.limit ?? limit,
        totalItems: pagination.total ?? data.length,
        totalPages: pagination.totalPages ?? 1,
        hasNextPage: pagination.hasNext ?? false,
        hasPrevPage: pagination.hasPrev ?? false,
      },
    };
  },

  create: async (formData: FormData): Promise<Product> => {
    const response = await apiClient.post(ENDPOINTS.PRODUCTS.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData): Promise<Product> => {
    const response = await apiClient.patch(
      ENDPOINTS.PRODUCTS.UPDATE(id),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(ENDPOINTS.PRODUCTS.DETAIL(id));
    return response.data;
  },
};
