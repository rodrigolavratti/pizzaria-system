"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/app/context/CartContext";
import { FiArrowLeft, FiMapPin, FiMessageCircle } from "react-icons/fi";

const WHATSAPP_PHONE = "5511999999999";

type Fulfillment = "delivery" | "pickup";

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function Checkout() {
  const { items, total, isHydrated } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const payment = String(formData.get("payment") ?? "");

    const orderLines = items.map(
      ({ pizza, quantity }) =>
        `• ${quantity}x ${pizza.nome} — ${formatCurrency(pizza.preco * quantity)}`,
    );
    const message = [
      "Olá! Gostaria de fazer este pedido:",
      "",
      ...orderLines,
      "",
      `*Total: ${formatCurrency(total)}*`,
      "",
      `*Nome:* ${name}`,
      `*Telefone:* ${phone}`,
      `*Recebimento:* ${fulfillment === "delivery" ? "Entrega" : "Retirada no local"}`,
      ...(fulfillment === "delivery" ? [`*Endereço:* ${address}`] : []),
      `*Pagamento:* ${payment}`,
    ].join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (whatsappWindow) {
      whatsappWindow.opener = null;
    } else {
      window.location.assign(whatsappUrl);
    }
  };

  if (!isHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-4 text-center"
        >
          <span
            aria-hidden="true"
            className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-red-500"
          />
          <p className="text-sm text-neutral-300">Carregando seu carrinho...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-white sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#pizza-cards"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-300 transition-colors hover:text-white"
        >
          <FiArrowLeft aria-hidden="true" />
          Voltar ao cardápio
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-400">
            Quase lá
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Finalizar pedido
          </h1>
          <p className="mt-2 max-w-2xl text-neutral-400">
            Confira os itens, informe seus dados e envie o pedido pelo WhatsApp.
          </p>
        </header>

        {items.length === 0 ? (
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center sm:p-10">
            <p className="text-lg font-semibold">Seu carrinho está vazio.</p>
            <p className="mt-2 text-sm text-neutral-400">
              Escolha algumas pizzas no cardápio para continuar.
            </p>
            <Link
              href="/#pizza-cards"
              className="mt-6 inline-flex rounded-lg bg-red-600 px-5 py-3 text-sm font-bold transition-colors hover:bg-red-700"
            >
              Ver cardápio
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-7"
            >
              <section aria-labelledby="customer-heading">
                <h2 id="customer-heading" className="text-xl font-semibold">
                  Seus dados
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-neutral-300">
                    Nome
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-3 text-white outline-none transition focus:border-red-500"
                    />
                  </label>
                  <label className="text-sm font-medium text-neutral-300">
                    Telefone
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-3 text-white outline-none transition focus:border-red-500"
                    />
                  </label>
                </div>
              </section>

              <section aria-labelledby="fulfillment-heading">
                <h2 id="fulfillment-heading" className="text-xl font-semibold">
                  Como deseja receber?
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 p-4 has-[:checked]:border-red-500">
                    <input
                      type="radio"
                      name="fulfillment"
                      value="delivery"
                      checked={fulfillment === "delivery"}
                      onChange={() => setFulfillment("delivery")}
                      className="accent-red-600"
                    />
                    <span>
                      <span className="block font-medium">Entrega</span>
                      <span className="mt-1 block text-xs text-neutral-400">
                        Receba no seu endereço
                      </span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 p-4 has-[:checked]:border-red-500">
                    <input
                      type="radio"
                      name="fulfillment"
                      value="pickup"
                      checked={fulfillment === "pickup"}
                      onChange={() => setFulfillment("pickup")}
                      className="accent-red-600"
                    />
                    <span>
                      <span className="block font-medium">Retirada</span>
                      <span className="mt-1 block text-xs text-neutral-400">
                        Retire no local
                      </span>
                    </span>
                  </label>
                </div>

                {fulfillment === "delivery" && (
                  <label className="mt-4 block text-sm font-medium text-neutral-300">
                    Endereço de entrega
                    <textarea
                      name="address"
                      autoComplete="street-address"
                      required
                      rows={3}
                      placeholder="Rua, número, bairro e complemento"
                      className="mt-2 w-full resize-y rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500"
                    />
                  </label>
                )}
              </section>

              <section aria-labelledby="payment-heading">
                <h2 id="payment-heading" className="text-xl font-semibold">
                  Forma de pagamento
                </h2>
                <label className="mt-4 block text-sm font-medium text-neutral-300">
                  Pagamento
                  <select
                    name="payment"
                    required
                    defaultValue=""
                    className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-3 text-white outline-none transition focus:border-red-500"
                  >
                    <option value="" disabled>
                      Selecione uma forma de pagamento
                    </option>
                    <option value="Pix">Pix</option>
                    <option value="Cartão na entrega/retirada">
                      Cartão na entrega/retirada
                    </option>
                    <option value="Dinheiro na entrega/retirada">
                      Dinheiro na entrega/retirada
                    </option>
                  </select>
                </label>
              </section>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3.5 font-bold transition-colors hover:bg-emerald-700"
              >
                <FiMessageCircle size={20} aria-hidden="true" />
                Enviar pedido pelo WhatsApp
              </button>
              <p className="text-center text-xs text-neutral-500">
                O pedido será enviado somente depois que você confirmar a
                mensagem no WhatsApp.
              </p>
            </form>

            <aside className="h-fit rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-7">
              <h2 className="text-xl font-semibold">Resumo do pedido</h2>
              <ul className="mt-5 divide-y divide-neutral-800">
                {items.map(({ pizza, quantity }) => (
                  <li
                    key={pizza.id}
                    className="flex items-start justify-between gap-4 py-4 first:pt-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{pizza.nome}</p>
                      <p className="mt-1 text-sm text-neutral-400">
                        {quantity} {quantity === 1 ? "unidade" : "unidades"}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium">
                      {formatCurrency(pizza.preco * quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-2 border-t border-neutral-700 pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <p className="mt-2 flex items-start gap-2 text-xs text-neutral-500">
                  <FiMapPin className="mt-0.5 shrink-0" aria-hidden="true" />O
                  valor de entrega, se houver, será confirmado pela pizzaria no
                  WhatsApp.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
