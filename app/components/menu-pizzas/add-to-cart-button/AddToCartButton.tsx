"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Pizza } from "@/app/types";
import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({ pizza }: { pizza: Pizza }) {
  const { user, openAuthModal, openSidebar } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { addItem } = useCart();

  const handleClick = () => {
    /*     if (!user) {
      setIsLoginOpen(true);
      return;
    } */

    addItem(pizza);
    openSidebar("cart");
  };

  return (
    <>
      <button
        onClick={handleClick}
        type="button"
        className="bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
      >
        Adicionar ao carrinho
      </button>

      {/* {isLoginOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-prompt-title"
            className="relative w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLoginOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 transition-colors hover:text-white"
              aria-label="Fechar aviso"
            >
              ✕
            </button>

            <h2 id="login-prompt-title" className="mb-2 pr-6 text-xl font-bold">
              Faça login para continuar
            </h2>
            <p className="mb-6 text-sm text-neutral-300">
              Entre na sua conta para adicionar pizzas ao carrinho e continuar
              sua compra.
            </p>

            <button
              type="button"
              onClick={() => {
                setIsLoginOpen(false);
                openAuthModal("login");
              }}
              className="w-full rounded-lg bg-red-600 py-3 font-bold transition-colors hover:bg-red-700"
            >
              Fazer login
            </button>
          </div>
        </div>
      )} */}
    </>
  );
}
