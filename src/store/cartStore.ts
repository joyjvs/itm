import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartStore, CartItem } from "../types/cart.types";
import { Product } from "../types/product.types";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product: Product, quantity: number) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.productId === product.id,
        );

        let newItems: CartItem[];

        if (existingItem) {
          // Si ya existe, actualizar cantidad (sin superar stock)
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            product.stock,
          );
          newItems = items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: newQuantity }
              : item,
          );
        } else {
          // Nuevo item
          const newItem: CartItem = {
            id: crypto.randomUUID(), // o usar Date.now() para IDs únicos
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: Math.min(quantity, product.stock),
            stock: product.stock,
          };
          newItems = [...items, newItem];
        }

        // Recalcular totales
        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalPrice = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        set({ items: newItems, totalItems, totalPrice });
      },

      removeItem: (productId: string) => {
        const newItems = get().items.filter(
          (item) => item.productId !== productId,
        );
        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalPrice = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        set({ items: newItems, totalItems, totalPrice });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 0) return;
        const { items } = get();
        const item = items.find((i) => i.productId === productId);
        if (!item) return;

        // Limitar por stock
        const newQuantity = Math.min(quantity, item.stock);
        if (newQuantity === 0) {
          // Si cantidad es 0, eliminar el item
          get().removeItem(productId);
          return;
        }

        const newItems = items.map((i) =>
          i.productId === productId ? { ...i, quantity: newQuantity } : i,
        );
        const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
        const totalPrice = newItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0,
        );
        set({ items: newItems, totalItems, totalPrice });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
    }),
    {
      name: "cart-storage", // clave en localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
