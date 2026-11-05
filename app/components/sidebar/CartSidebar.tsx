"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

export default function CartSidebar() {
  const { items, total, addItem, decrementItem, removeItem, clearCart } =
    useCart();
  const { closeSidebar } = useAuth();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-700 bg-neutral-800/60 p-4 text-center">
        <p className="text-sm text-neutral-300">Seu carrinho está vazio.</p>
        <button
          type="button"
          onClick={closeSidebar}
          className="mt-4 w-full rounded-lg bg-red-600 py-2.5 text-sm font-bold transition-colors hover:bg-red-700"
        >
          Ver cardápio
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 space-y-3">
        {items.map(({ pizza, quantity }) => (
          <li
            key={pizza.id}
            className="rounded-xl border border-neutral-700 bg-neutral-800 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{pizza.nome}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrementItem(pizza.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-600 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
                      aria-label={`Diminuir quantidade de ${pizza.nome}`}
                    >
                      <FiMinus size={14} aria-hidden="true" />
                    </button>
                    <span className="min-w-4 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => addItem(pizza)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-600 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
                      aria-label={`Aumentar quantidade de ${pizza.nome}`}
                    >
                      <FiPlus size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeItem(pizza.id)}
                className="rounded p-1 text-red-400 transition-colors hover:bg-neutral-700 hover:text-red-300"
                aria-label={`Remover ${pizza.nome} do carrinho`}
              >
                <FiTrash2 size={18} aria-hidden="true" />
              </button>
            </div>

            <p className="mt-3 text-right font-semibold">
              {(pizza.preco * quantity).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-5 shrink-0 border-t border-neutral-700 pt-4">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span>
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="mt-3 w-full rounded-lg border border-neutral-700 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-800"
        >
          Limpar carrinho
        </button>

        <Link
          href="/checkout"
          onClick={closeSidebar}
          className="mt-3 flex w-full items-center justify-center rounded-lg bg-red-600 py-3 text-sm font-bold transition-colors hover:bg-red-700"
        >
          Finalizar Pedido
        </Link>
      </div>
    </div>
  );
}
