"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Pizza } from "@/app/types";

type CartItem = {
  pizza: Pizza;
  quantity: number;
};

const CART_STORAGE_KEY = "pizzaria-system-cart";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPizza(value: unknown): value is Pizza {
  if (!isRecord(value)) return false;

  return (
    (typeof value.id === "string" ||
      (typeof value.id === "number" && Number.isFinite(value.id))) &&
    typeof value.nome === "string" &&
    typeof value.descricao === "string" &&
    typeof value.preco === "number" &&
    Number.isFinite(value.preco) &&
    typeof value.imagemAlt === "string" &&
    typeof value.imagem === "string" &&
    (value.review === undefined ||
      (typeof value.review === "number" && Number.isFinite(value.review)))
  );
}

function isCartItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    isPizza(value.pizza) &&
    typeof value.quantity === "number" &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0
  );
}

function isCart(value: unknown): value is CartItem[] {
  return Array.isArray(value) && value.every(isCartItem);
}

type CartContextValue = {
  items: CartItem[];
  total: number;
  isHydrated: boolean;
  addItem: (pizza: Pizza) => void;
  decrementItem: (pizzaId: Pizza["id"]) => void;
  removeItem: (pizzaId: Pizza["id"]) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

        if (storedCart) {
          try {
            const parsedCart: unknown = JSON.parse(storedCart);

            if (isCart(parsedCart)) {
              setItems(parsedCart);
            } else {
              console.error(
                "O carrinho salvo no navegador tem um formato inválido e será substituído.",
              );
            }
          } catch (error) {
            console.error(
              "Erro ao interpretar o carrinho salvo no navegador:",
              error,
            );
          }
        }
      } catch (error) {
        console.error("Erro ao ler o carrinho salvo no navegador:", error);
      } finally {
        setIsHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Erro ao salvar o carrinho no navegador:", error);
    }
  }, [items, isHydrated]);

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

  const decrementItem = (pizzaId: Pizza["id"]) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.pizza.id === pizzaId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
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
      value={{
        items,
        total,
        isHydrated,
        addItem,
        decrementItem,
        removeItem,
        clearCart,
      }}
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
