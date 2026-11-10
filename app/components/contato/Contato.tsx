"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiMapPin,
  FiClock,
  FiPhone,
  FiNavigation,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import {
  checkIsPizzeriaOpen,
  getCurrentDayGroup,
} from "@/app/components/contato/utils/time-open";
import { AddressMap } from "@/app/constants/address-map";

export default function Contato() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<string | null>(null);
  const mapButtonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState({
    isOpen: false,
    message: "Carregando...",
  });

  const address = AddressMap.addressMap;
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
  const embeddedMapUrl = `${mapUrl}&output=embed`;

  useEffect(() => {
    const updateStatus = () => {
      setStatus(checkIsPizzeriaOpen());
      setCurrentGroup(getCurrentDayGroup());
    };

    updateStatus();

    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isMapOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMapOpen(false);
        mapButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMapOpen]);

  return (
    <section
      aria-label="Informações de Contato e Horários"
      className="w-full py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          {status.isOpen ? (
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full mb-3 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {status.message}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-full mb-3 border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              {status.message}
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Informações de Contato e Horários
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-xl mx-auto">
            Venha nos visitar ou faça seu pedido diretamente pelo WhatsApp.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <article className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-red-700 group-hover:text-white">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Nosso Endereço
              </h3>
              <address className="not-italic text-slate-600 text-sm leading-relaxed">
                Rua das Pizzas, 123 — Bairro Nobre
                <br />
                São Paulo, SP — CEP 01234-567
              </address>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                ref={mapButtonRef}
                type="button"
                onClick={() => setIsMapOpen(true)}
                aria-haspopup="dialog"
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800 transition-colors"
              >
                <FiNavigation className="w-4 h-4" />
                Ver mapa e como chegar
              </button>
            </div>
          </article>

          <article className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-red-700 group-hover:text-white">
                <FiClock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Horários
              </h3>

              <ul className="space-y-2 text-sm">
                {/* Terça a Quinta */}
                <li
                  className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                    currentGroup === "tue-thu"
                      ? "bg-red-50/80 font-semibold border border-red-100 text-red-950"
                      : "text-slate-600"
                  }`}
                >
                  <span>Terça a Quinta</span>
                  <time
                    className={
                      currentGroup === "tue-thu"
                        ? "font-bold text-red-700"
                        : "font-medium text-slate-900"
                    }
                  >
                    18:00 - 23:00
                  </time>
                </li>

                {/* Sexta e Sábado */}
                <li
                  className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                    currentGroup === "fri-sat"
                      ? "bg-red-50/80 font-semibold border border-red-100 text-red-950"
                      : "text-slate-600"
                  }`}
                >
                  <span>Sexta e Sábado</span>
                  <time
                    className={
                      currentGroup === "fri-sat"
                        ? "font-bold text-red-700"
                        : "font-medium text-slate-900"
                    }
                  >
                    18:00 - 00:00
                  </time>
                </li>

                {/* Domingo */}
                <li
                  className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                    currentGroup === "sun"
                      ? "bg-red-50/80 font-semibold border border-red-100 text-red-950"
                      : "text-slate-600"
                  }`}
                >
                  <span>Domingo</span>
                  <time
                    className={
                      currentGroup === "sun"
                        ? "font-bold text-red-700"
                        : "font-medium text-slate-900"
                    }
                  >
                    18:00 - 23:30
                  </time>
                </li>

                {/* Segunda-feira */}
                <li
                  className={`flex justify-between items-center p-2 rounded-lg pt-2.5 border-t border-slate-100 ${
                    currentGroup === "mon"
                      ? "bg-rose-50 font-semibold border border-rose-200 text-rose-950"
                      : "text-slate-400 text-xs"
                  }`}
                >
                  <span>Segunda-feira</span>
                  <span
                    className={
                      currentGroup === "mon"
                        ? "font-bold text-rose-700"
                        : "font-semibold text-slate-400"
                    }
                  >
                    Fechado
                  </span>
                </li>
              </ul>
            </div>
          </article>

          <article className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-red-700 group-hover:text-white">
                <FiPhone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Atendimento
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Dúvidas, reservas de mesas ou pedidos por telefone.
              </p>

              <div className="space-y-1">
                <span className="block text-slate-900 font-bold text-base transition-colors">
                  (11) 99999-9999
                </span>
                <span className="block text-slate-500 text-sm transition-colors">
                  (11) 3333-4444
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
      {isMapOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => {
            setIsMapOpen(false);
            mapButtonRef.current?.focus();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="map-modal-title"
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2
                  id="map-modal-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Como chegar
                </h2>
                <p className="mt-1 text-sm text-slate-600">{address}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMapOpen(false);
                  mapButtonRef.current?.focus();
                }}
                autoFocus
                aria-label="Fechar mapa"
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <FiX className="h-5 w-5" />
              </button>
            </header>
            <div className="min-h-0 flex-1 p-3 sm:p-5">
              <iframe
                title={`Mapa: ${address}`}
                src={embeddedMapUrl}
                className="h-[50vh] min-h-72 w-full rounded-xl border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <footer className="border-t border-slate-100 p-4 text-right sm:px-6">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800"
              >
                <FiExternalLink className="h-4 w-4" />
                Abrir no Google Maps
              </a>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}
