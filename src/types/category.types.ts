import type { Product } from "./product.types";

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  parent?: {
    id: string;
    name?: string;
  } | null;
  children?: Category[];
  products?: Product[];
}

export type CreateCategoryPayload = Pick<
  Category,
  "name" | "description" | "parentId"
>;

export interface CategoryFilters {
  name?: string;
  description?: string;
  parentId?: string | null;
  createdAfter?: string;
  createdBefore?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
