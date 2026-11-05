"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";

export default function AccountSidebar() {
  const { user, openAuthModal, closeSidebar, logout } = useAuth();
  const { clearCart } = useCart();

  const handleLogout = async () => {
    await logout();
    clearCart();
  };

  return (
    <div className="flex h-full flex-col">
      {user ? (
        <>
          <div className="mb-6 flex items-center space-x-3 rounded-xl border border-neutral-700/50 bg-neutral-800/80 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-lg font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-semibold leading-tight">
                {user.name}
              </p>
              <p className="truncate text-xs text-neutral-400">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-2 font-medium text-neutral-300">
            <a
              href="#cardapio"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              🍕 Cardápio Completo
            </a>
            <a
              href="#pedidos"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              📦 Meus Pedidos
            </a>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto w-full rounded-lg border border-neutral-700/50 bg-neutral-800 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-neutral-700"
          >
            Sair da Conta
          </button>
        </>
      ) : (
        <div className="rounded-xl border border-neutral-700/50 bg-neutral-800/60 p-4 text-center">
          <p className="mb-4 text-sm text-neutral-300">
            Faça login para realizar seus pedidos e ver seu histórico.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-bold shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700"
          >
            Entrar / Cadastrar
          </button>
        </div>
      )}
    </div>
  );
}
