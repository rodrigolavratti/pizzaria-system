"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import type { SidebarPanel } from "@/app/types/auth";
import AccountSidebar from "@/app/components/sidebar/AccountSidebar";
import CartSidebar from "@/app/components/sidebar/CartSidebar";

export default function Sidebar() {
  const { activeSidebar, closeSidebar } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [renderedSidebar, setRenderedSidebar] = useState<SidebarPanel | null>(
    null,
  );

  useEffect(() => {
    let firstFrame: number | undefined;
    let secondFrame: number | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (activeSidebar) {
      firstFrame = requestAnimationFrame(() => {
        setRenderedSidebar(activeSidebar);
        setIsMounted(true);

        secondFrame = requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      firstFrame = requestAnimationFrame(() => {
        setIsVisible(false);
      });

      timeout = setTimeout(() => {
        setIsMounted(false);
        setRenderedSidebar(null);
      }, 500);
    }

    return () => {
      if (firstFrame !== undefined) cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
      if (timeout !== undefined) clearTimeout(timeout);
    };
  }, [activeSidebar]);

  if (!isMounted || !renderedSidebar) return null;

  const title = renderedSidebar === "cart" ? "Meu carrinho" : "Minha conta";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <button
        type="button"
        onClick={closeSidebar}
        aria-label="Fechar painel"
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
        className={`fixed inset-y-0 right-0 z-10 flex w-full max-w-xs transform flex-col border-l border-neutral-800 bg-neutral-900 p-6 text-white shadow-2xl transition-transform duration-500 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex shrink-0 items-center justify-between">
          <h2
            id="sidebar-title"
            className="text-xl font-bold tracking-wide"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            aria-label={`Fechar ${title.toLowerCase()}`}
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {renderedSidebar === "cart" ? <CartSidebar /> : <AccountSidebar />}
        </div>
      </section>
    </div>
  );
}
