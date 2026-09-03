import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Category,
  CategoryFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../../types/category.types";
import type { PaginatedResponse } from "@/types/pagination.types";
import { buildCategoryTree } from "../../lib/category-utils";
import type { Product, ProductCategory } from "../../types/product.types";

type CategoryApiProduct = {
  id?: string;
  name?: string;
  description?: string;
  price?: number | string;
  stock?: number | string;
  categoryId?: string;
  category?: unknown;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
};

type CategoryApiResponse = {
  id?: string;
  name?: string;
  description?: string;
  parent?: { id?: string; name?: string } | null;
  children?: CategoryApiResponse[];
  products?: CategoryApiProduct[];
  [key: string]: unknown;
};

const normalizeProduct = (product: CategoryApiProduct): Product => ({
  id: product.id ?? "",
  name: product.name ?? "",
  description: product.description,
  price: Number(product.price ?? 0),
  stock: Number(product.stock ?? 0),
  categoryId: product.categoryId ?? "",
  category: product.category as ProductCategory,
  images: Array.isArray(product.images) ? product.images : [],
  image:
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : undefined,
  createdAt: product.createdAt ?? new Date().toISOString(),
  updatedAt: product.updatedAt ?? new Date().toISOString(),
});

const normalizeCategory = (item: CategoryApiResponse): Category => {
  const parent = item.parent?.id
    ? { id: item.parent.id, name: item.parent.name ?? undefined }
    : null;

  return {
    id: item.id ?? "",
    name: item.name ?? "",
    description: item.description ?? "",
    parentId: item.parent?.id ?? null,
    parent,
    children: (item.children ?? []).map(normalizeCategory),
    products: (item.products ?? []).map(normalizeProduct),
  };
};

export const categoriesService = {
  getAll: async (
    page = 1,
    limit = 100,
    filters: CategoryFilters = {},
  ): Promise<PaginatedResponse<Category>> => {
    const params: Record<string, unknown> = { page, limit, ...filters };
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== "" && value !== null,
      ),
    );
    const response = await apiClient.get(ENDPOINTS.CATEGORIES.LIST, {
      params: cleanedParams,
    });

    const rawData = response.data?.data ?? [];
    const pagination = response.data?.pagination ?? {};

    return {
      data: rawData.map(normalizeCategory),
      meta: {
        currentPage: pagination.page ?? page,
        itemsPerPage: pagination.limit ?? limit,
        totalItems: pagination.total ?? rawData.length,
        totalPages: pagination.totalPages ?? 1,
        hasNextPage: pagination.hasNext ?? false,
        hasPrevPage: pagination.hasPrev ?? false,
      },
    };
  },

  getWithProducts: async (): Promise<Category[]> => {
    const response = await apiClient.get(ENDPOINTS.CATEGORIES.WITH_PRODUCTS());
    const rawData: CategoryApiResponse[] = Array.isArray(response.data)
      ? response.data
      : [];

    return rawData.map(normalizeCategory);
  },

  getTree: async (): Promise<Category[]> => {
    const list = await categoriesService.getAll(1, 100);
    return buildCategoryTree(list.data);
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
