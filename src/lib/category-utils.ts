import { Category } from "../types/category.types";

export const buildCategoryTree = (categories: Category[]): Category[] => {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  const nodes = categories.map((cat) => {
    const node: Category = {
      ...cat,
      children: [],
      parent: cat.parent
        ? {
            id: cat.parent.id,
            name: cat.parent.name,
          }
        : null,
    };
    console.log("node", node);

    if (cat.parentId && !node.parent) {
      node.parent = { id: cat.parentId };
    }

    map.set(node.id, node);
    return node;
  });

  nodes.forEach((node) => {
    if (node.parentId) {
      const parent = map.get(node.parentId);

      if (parent) {
        console.log("parent", parent);
        const parentRef = parent.parent
          ? { id: parent.id, name: parent.name }
          : { id: parent.id };

        node.parent = node.parent ?? parentRef;

        const alreadyLinked = parent.children?.some(
          (child) => child.id === node.id,
        );

        if (!alreadyLinked) {
          parent.children = [...(parent.children ?? []), node];
        }
      } else {
        roots.push(node);
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
