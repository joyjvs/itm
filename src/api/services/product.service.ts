import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Product,
  ProductsResponse,
  ProductFilters,
} from "../../types/product.types";

export const productsService = {
  getAll: async (
    page: number = 1,
    limit: number = 10,
    filters: ProductFilters = {},
  ): Promise<ProductsResponse> => {
    const params: Record<string, unknown> = { page, limit, ...filters };
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== "" && value !== null,
      ),
    );

    const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
      params: cleanedParams,
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
    console.log(response);
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
