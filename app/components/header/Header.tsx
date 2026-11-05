"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";

export default function Header() {
  const { openSidebar, user } = useAuth();
  const { items } = useCart();
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrolledState = () => {
      const header = document.getElementById("site-header");
      const pizzaCards = document.getElementById("pizza-cards");
      if (!header || !pizzaCards) return;

      const cardsTop = pizzaCards.getBoundingClientRect().top;
      const headerBottom = header.getBoundingClientRect().bottom;

      setIsScrolled(cardsTop <= headerBottom);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    window.addEventListener("resize", updateScrolledState);

    return () => {
      window.removeEventListener("scroll", updateScrolledState);
      window.removeEventListener("resize", updateScrolledState);
    };
  }, []);

  return (
    <section
      className="relative h-[800px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/banner-top.jpg')`,
      }}
      aria-labelledby="hero-title"
    >
      <header
        id="site-header"
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
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
              user ? `Abrir conta de ${user.name}` : "Entrar ou criar uma conta"
            }
            title={user ? `Conta de ${user.name}` : "Entrar"}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
              isScrolled
                ? "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 hover:text-neutral-900"
                : "bg-black/40 text-white hover:bg-black/60 hover:text-neutral-300"
            }`}
          >
            {user ? (
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold"
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <FiUser size={22} aria-hidden="true" />
            )}
          </button>

          {user && (
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
              className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                isScrolled
                  ? "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 hover:text-neutral-900"
                  : "bg-black/40 text-white hover:bg-black/60 hover:text-neutral-300"
              }`}
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
          )}
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
