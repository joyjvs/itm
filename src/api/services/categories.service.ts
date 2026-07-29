import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../../types/category.types";
import { buildCategoryTree } from "../../lib/category-utils";

const normalizeCategory = (item: any): Category => ({
  id: item.id,
  name: item.name,
  description: item.description,
  parentId: item.parent?.id ?? null,
  parent: item.parent ? { id: item.parent.id, name: item.parent.name } : null,
  children: (item.children ?? []).map(normalizeCategory),
});

export const categoriesService = {
  getAll: async (page = 1, limit = 100): Promise<Category[]> => {
    const response = await apiClient.get(ENDPOINTS.CATEGORIES.LIST, {
      params: { page, limit },
    });

    const rawData = response.data?.data ?? [];

    return rawData.map(normalizeCategory);
  },

  getTree: async (): Promise<Category[]> => {
    const list = await categoriesService.getAll(1, 100);
    return buildCategoryTree(list);
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(ENDPOINTS.CATEGORIES.DETAIL(id));
    return normalizeCategory(response.data);
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const response = await apiClient.post(ENDPOINTS.CATEGORIES.CREATE, payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<Category> => {
    const response = await apiClient.patch(
      ENDPOINTS.CATEGORIES.UPDATE(id),
      payload,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.CATEGORIES.DELETE(id));
  },
};
