"use client";

import { useState } from "react";
import AddToCartButton from "@/app/components/menu-pizzas/add-to-cart-button/AddToCartButton";
import { pizzas } from "@/app/constants";
import Image from "next/image";

export default function MenuSection() {
  const [pizzaSelecionada, setPizzaSelecionada] = useState<
    (typeof pizzas)[number] | null
  >(null);

  return (
    <>
      <section
        className="relative z-10 -mt-24 px-6 py-16"
        aria-labelledby="menu-title"
      >
        <div className="mx-auto max-w-7xl">
          <ul
            id="pizza-cards"
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {pizzas.map((pizza) => (
              <li key={pizza.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white text-neutral-900 shadow-lg">
                  <div className="relative h-80 w-full">
                    <button
                      type="button"
                      onClick={() => setPizzaSelecionada(pizza)}
                      aria-label={`Ampliar imagem: ${pizza.imagemAlt}`}
                      className="relative block h-full w-full cursor-pointer"
                    >
                      <Image
                        src={pizza.imagem}
                        alt={pizza.imagemAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </button>
                  </div>

                  <div className="flex grow flex-col justify-between p-6">
                    <div>
                      <div className="mb-2 flex justify-between items-center gap-2">
                        <h3 className="text-xl font-bold">{pizza.nome}</h3>

                        {typeof pizza.review === "number" &&
                          pizza.review >= 0 &&
                          pizza.review <= 5 && (
                            <span
                              role="img"
                              aria-label={`Avaliação: ${pizza.review.toLocaleString("pt-BR")} de 5`}
                              className="flex shrink-0 text-xl leading-none"
                            >
                              {Array.from({ length: 5 }, (_, index) => {
                                const preenchimento = Math.min(
                                  100,
                                  Math.max(0, (pizza.review || 0) - index) *
                                    100,
                                );

                                return (
                                  <span
                                    key={index}
                                    aria-hidden="true"
                                    className="relative inline-block text-neutral-300"
                                  >
                                    ★
                                    <span
                                      className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-amber-400"
                                      style={{ width: `${preenchimento}%` }}
                                    >
                                      ★
                                    </span>
                                  </span>
                                );
                              })}
                            </span>
                          )}
                      </div>

                      <p className="mb-4 text-sm text-neutral-600">
                        {pizza.descricao}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                      <span className="text-2xl font-bold text-black-900">
                        R$ {pizza.preco.toFixed(2).replace(".", ",")}
                      </span>
                      <AddToCartButton pizza={pizza} />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {pizzaSelecionada && (
        <div
          role="presentation"
          onClick={() => setPizzaSelecionada(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Imagem ampliada: ${pizzaSelecionada.imagemAlt}`}
            onClick={(event) => event.stopPropagation()}
            className="relative h-[80vh] w-full max-w-5xl"
          >
            <button
              type="button"
              onClick={() => setPizzaSelecionada(null)}
              aria-label="Fechar imagem ampliada"
              className="absolute right-2 top-2 z-10 rounded-full bg-black/70 px-3 py-2 text-xl text-white hover:bg-black"
            >
              ✕
            </button>

            <Image
              src={pizzaSelecionada.imagem}
              alt={pizzaSelecionada.imagemAlt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
