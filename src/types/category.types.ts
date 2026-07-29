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
}

export type CreateCategoryPayload = Pick<
  Category,
  "name" | "description" | "parentId"
>;

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
