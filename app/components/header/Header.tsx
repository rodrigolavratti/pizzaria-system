"use client";

import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

export default function Header() {
  const { openSidebar, user } = useAuth();

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
            src="/images/logo-imagem.png"
            alt="Logotipo Pizza System"
            width={200}
            height={52}
            className="object-contain"
            priority
          />
        </a>
        <nav aria-label="Navegação Principal">
          <button
            type="button"
            onClick={openSidebar}
            aria-label="Abrir Menu"
            className="flex items-center gap-2 p-2 text-white transition-colors hover:text-neutral-300 bg-black/40 hover:bg-black/60 rounded-full px-4"
          >
            {/* Ícone de Usuário/Menu */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            {/* Se logado, mostra o nome do usuário */}
            {user ? (
              <span className="text-sm font-medium max-w-[120px] truncate">
                {user.name}
              </span>
            ) : (
              <span className="text-sm font-medium hidden sm:inline">
                Entrar
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
