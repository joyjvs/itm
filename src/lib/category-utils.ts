import { Category } from "../types/category.types";

export const buildCategoryTree = (categories: Category[]): Category[] => {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, {
      ...cat,
      children: cat.children ?? [],
    });
  });

  categories.forEach((cat) => {
    const node = map.get(cat.id);
    if (!node) return;

    if (cat.parentId && map.has(cat.parentId)) {
      const parent = map.get(cat.parentId);
      if (parent) {
        const alreadyLinked = parent.children?.some(
          (child) => child.id === node.id,
        );

        if (!alreadyLinked) {
          parent.children = [...(parent.children ?? []), node];
        }
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const flattenCategoryTree = (
  categories: Category[],
  level = 0,
): Array<Category & { level: number }> => {
  let result: Array<Category & { level: number }> = [];

  categories.forEach((cat) => {
    result.push({ ...cat, level });
    if (cat.children) {
      result = result.concat(flattenCategoryTree(cat.children, level + 1));
    }
  });

  return result;
};
