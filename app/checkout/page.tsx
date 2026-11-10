"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/app/context/CartContext";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMapPin,
  FiMessageCircle,
} from "react-icons/fi";
import { formatPhone } from "@/app/utils/format-phone";

const WHATSAPP_PHONE = "5541992673992";

type Fulfillment = "delivery" | "pickup";

type FieldErrors = {
  name: string;
  phone: string;
  address: string;
  payment: string;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function Checkout() {
  const { items, total, isHydrated, clearCart } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    name: "",
    phone: "",
    address: "",
    payment: "",
  });
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setFieldErrors((current) => ({ ...current, phone: "" }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const payment = String(formData.get("payment") ?? "");
    const phoneDigits = phone.replace(/\D/g, "");
    const errors: FieldErrors = {
      name: name ? "" : "Preencha seu nome.",
      phone: !phone
        ? "Preencha seu telefone."
        : /^\d{10,11}$/.test(phoneDigits)
          ? ""
          : "Informe um telefone válido com DDD.",
      address:
        fulfillment === "delivery" && !address
          ? "Preencha o endereço de entrega."
          : "",
      payment: payment ? "" : "Selecione uma forma de pagamento.",
    };
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) return;

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
    const orderWhatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(orderWhatsappUrl, "_blank");

    if (whatsappWindow) {
      whatsappWindow.opener = null;
    }
    clearCart();
    setWhatsappUrl(orderWhatsappUrl);
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

  if (whatsappUrl && items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8 text-white">
        <section
          aria-labelledby="order-ready-heading"
          className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center sm:p-10"
        >
          <FiCheckCircle
            aria-hidden="true"
            className="mx-auto h-14 w-14 text-emerald-500"
          />
          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Pedido preparado
          </p>
          <h1
            id="order-ready-heading"
            className="mt-2 text-3xl font-bold sm:text-4xl"
          >
            Falta confirmar no WhatsApp
          </h1>
          <p className="mt-4 text-neutral-300">
            Abrimos uma conversa com os detalhes do pedido. Revise a mensagem e
            envie pelo WhatsApp para concluir seu pedido.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-bold transition-colors hover:bg-emerald-700"
            >
              <FiMessageCircle size={20} aria-hidden="true" />
              Abrir WhatsApp
            </a>
            <Link
              href="/#pizza-cards"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 px-5 py-3 font-semibold text-neutral-200 transition-colors hover:bg-neutral-800"
            >
              <FiArrowLeft aria-hidden="true" />
              Voltar ao cardápio
            </Link>
          </div>
        </section>
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
              noValidate
              className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-7"
            >
              <section aria-labelledby="customer-heading">
                <h2 id="customer-heading" className="text-xl font-semibold">
                  Seus dados
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-neutral-300"
                    >
                      Nome
                    </label>
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={
                        fieldErrors.name ? "name-error" : undefined
                      }
                      onChange={() =>
                        setFieldErrors((current) => ({
                          ...current,
                          name: "",
                        }))
                      }
                      placeholder="Seu nome"
                      className={`mt-2 w-full rounded-lg border bg-neutral-950 px-3 py-3 text-white outline-none transition focus:border-red-500 ${
                        fieldErrors.name ? "border-red-500" : "border-neutral-700"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-400">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-neutral-300"
                    >
                      Telefone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      aria-invalid={Boolean(fieldErrors.phone)}
                      aria-describedby={
                        fieldErrors.phone ? "phone-error" : undefined
                      }
                      placeholder="(00) 00000-0000"
                      className={`mt-2 w-full rounded-lg border bg-neutral-950 px-3 py-3 text-white outline-none transition focus:border-red-500 ${
                        fieldErrors.phone
                          ? "border-red-500"
                          : "border-neutral-700"
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p
                        id="phone-error"
                        className="mt-1 text-sm text-red-400"
                      >
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
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
                      onChange={() => {
                        setFulfillment("delivery");
                        setFieldErrors((current) => ({
                          ...current,
                          address: "",
                        }));
                      }}
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
                      onChange={() => {
                        setFulfillment("pickup");
                        setFieldErrors((current) => ({
                          ...current,
                          address: "",
                        }));
                      }}
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
                  <div className="mt-4">
                    <label
                      htmlFor="address"
                      className="text-sm font-medium text-neutral-300"
                    >
                      Endereço de entrega
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      required
                      rows={3}
                      aria-invalid={Boolean(fieldErrors.address)}
                      aria-describedby={
                        fieldErrors.address ? "address-error" : undefined
                      }
                      onChange={() =>
                        setFieldErrors((current) => ({
                          ...current,
                          address: "",
                        }))
                      }
                      placeholder="Rua, número, bairro e complemento"
                      className={`mt-2 w-full resize-y rounded-lg border bg-neutral-950 px-3 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500 ${
                        fieldErrors.address
                          ? "border-red-500"
                          : "border-neutral-700"
                      }`}
                    />
                    {fieldErrors.address && (
                      <p
                        id="address-error"
                        className="mt-1 text-sm text-red-400"
                      >
                        {fieldErrors.address}
                      </p>
                    )}
                  </div>
                )}
              </section>

              <section aria-labelledby="payment-heading">
                <h2 id="payment-heading" className="text-xl font-semibold">
                  Forma de pagamento
                </h2>
                <div className="mt-4">
                  <label
                    htmlFor="payment"
                    className="text-sm font-medium text-neutral-300"
                  >
                    Pagamento
                  </label>
                  <select
                    id="payment"
                    name="payment"
                    required
                    defaultValue=""
                    aria-invalid={Boolean(fieldErrors.payment)}
                    aria-describedby={
                      fieldErrors.payment ? "payment-error" : undefined
                    }
                    onChange={() =>
                      setFieldErrors((current) => ({
                        ...current,
                        payment: "",
                      }))
                    }
                    className={`mt-2 w-full rounded-lg border bg-neutral-950 px-3 py-3 text-white outline-none transition focus:border-red-500 ${
                      fieldErrors.payment
                        ? "border-red-500"
                        : "border-neutral-700"
                    }`}
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
                  {fieldErrors.payment && (
                    <p
                      id="payment-error"
                      className="mt-1 text-sm text-red-400"
                    >
                      {fieldErrors.payment}
                    </p>
                  )}
                </div>
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
