import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { Banner, BannersResponse } from "@/types/banner.types";

export const bannersService = {
  getAll: async (page = 1, limit = 10): Promise<BannersResponse> => {
    const response = await apiClient.get(ENDPOINTS.BANNERS.LIST, {
      params: { page, limit },
    });
    const pagination = response.data?.pagination ?? {};
    const data: Banner[] = response.data?.data ?? [];

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

  create: async (payload: FormData): Promise<Banner> => {
    const response = await apiClient.post(ENDPOINTS.BANNERS.CREATE, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: string, payload: FormData): Promise<Banner> => {
    const response = await apiClient.patch(
      ENDPOINTS.BANNERS.UPDATE(id),
      payload,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.BANNERS.DELETE(id));
  },
};
