"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { FiLogIn, FiShoppingCart } from "react-icons/fi";

export default function Header() {
  const { openSidebar, user } = useAuth();
  const { items } = useCart();
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <section
      className="relative h-[800px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/banner-top.jpg')`,
      }}
      aria-labelledby="hero-title"
    >
      {/* 1. CABEÇALHO */}
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center">
          <Image
            src="/images/logo-pizzaria.png"
            alt="Logotipo Pizza System"
            width={200}
            height={52}
            className="object-contain"
            priority
          />
        </a>
        <nav
          aria-label="Navegação Principal"
          className="flex items-center gap-3"
        >
          <button
            type="button"
            onClick={() => openSidebar("account")}
            aria-label={
              user
                ? `Abrir conta de ${user.name}`
                : "Entrar ou criar uma conta"
            }
            title={user ? `Conta de ${user.name}` : "Entrar"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 hover:text-neutral-300"
          >
            {user ? (
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold"
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <FiLogIn size={22} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openSidebar("cart")}
            aria-label={
              itemCount > 0
                ? `Abrir carrinho com ${itemCount} ${
                    itemCount === 1 ? "item" : "itens"
                  }`
                : "Abrir carrinho vazio"
            }
            title="Carrinho"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 hover:text-neutral-300"
          >
            <FiShoppingCart size={22} aria-hidden="true" />
            {itemCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </nav>
      </header>
      <h1
        id="hero-title"
        className="text-4xl md:text-5xl font-extrabold text-white tracking-wide text-center"
      >
        Cardápio Pizza System
      </h1>
    </section>
  );
}
