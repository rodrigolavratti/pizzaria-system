"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Pizza } from "@/app/types";

type CartItem = {
  pizza: Pizza;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  total: number;
  addItem: (pizza: Pizza) => void;
  removeItem: (pizzaId: Pizza["id"]) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (pizza: Pizza) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.pizza.id === pizza.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.pizza.id === pizza.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { pizza, quantity: 1 }];
    });
  };

  const removeItem = (pizzaId: Pizza["id"]) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.pizza.id !== pizzaId),
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, item) => sum + item.pizza.preco * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{ items, total, addItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }

  return context;
}
