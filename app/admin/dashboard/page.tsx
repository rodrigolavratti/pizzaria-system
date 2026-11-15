"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createPizza,
  deletePizza,
  listPizzas,
  setPizzaAvailability,
  updatePizza,
} from "@/app/lib/pizza-service";
import type { Pizza, PizzaInput } from "@/app/types/pizza";
import Image from "next/image";

type PizzaFormValues = {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  available: boolean;
};

const isLocalImagePath = (path: string) =>
  path.startsWith("/images/") &&
  !path.includes("..") &&
  !path.includes("\\") &&
  /\.(jpe?g|png|webp)$/i.test(path);

const EMPTY_FORM: PizzaFormValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  available: true,
};

const AdminDashboardPage = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [form, setForm] = useState<PizzaFormValues>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [pendingPizzaId, setPendingPizzaId] = useState<string | null>(null);

  const loadPizzas = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      setPizzas(await listPizzas());
    } catch (error) {
      console.error("Erro ao carregar pizzas:", error);
      setLoadError("Não foi possível carregar as pizzas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    listPizzas()
      .then((loadedPizzas) => {
        if (isActive) setPizzas(loadedPizzas);
      })
      .catch((error: unknown) => {
        console.error("Erro ao carregar pizzas:", error);
        if (isActive) {
          setLoadError("Não foi possível carregar as pizzas. Tente novamente.");
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const openNewPizzaForm = () => {
    setEditingPizza(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setPageMessage("");
    setIsFormOpen(true);
  };

  const openEditPizzaForm = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setForm({
      name: pizza.name,
      description: pizza.description,
      price: String(pizza.price),
      category: pizza.category,
      imageUrl: pizza.imageUrl,
      available: pizza.available,
    });
    setFormError("");
    setPageMessage("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPizza(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setPageMessage("");

    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Informe um preço válido, igual ou maior que zero.");
      return;
    }

    const imageUrl = form.imageUrl.trim();
    if (!isLocalImagePath(imageUrl)) {
      setFormError(
        "Informe o caminho de uma imagem JPEG, PNG ou WebP dentro de /images/.",
      );
      return;
    }

    setIsSaving(true);

    try {
      const pizzaInput: PizzaInput = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category.trim(),
        imageUrl,
        available: form.available,
      };

      if (editingPizza) {
        const updatedPizza = await updatePizza(editingPizza.id, pizzaInput);
        setPizzas((currentPizzas) =>
          currentPizzas.map((pizza) =>
            pizza.id === updatedPizza.id ? updatedPizza : pizza,
          ),
        );

        setPageMessage("Pizza atualizada com sucesso.");
      } else {
        const newPizza = await createPizza(pizzaInput);
        setPizzas((currentPizzas) => [newPizza, ...currentPizzas]);
        setPageMessage("Pizza cadastrada com sucesso.");
      }

      closeForm();
    } catch (error) {
      console.error("Erro ao salvar pizza:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a pizza. Tente novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvailabilityChange = async (pizza: Pizza) => {
    setPendingPizzaId(pizza.id);
    setPageMessage("");
    setLoadError("");

    try {
      await setPizzaAvailability(pizza.id, !pizza.available);
      setPizzas((currentPizzas) =>
        currentPizzas.map((currentPizza) =>
          currentPizza.id === pizza.id
            ? { ...currentPizza, available: !pizza.available }
            : currentPizza,
        ),
      );
    } catch (error) {
      console.error("Erro ao alterar disponibilidade:", error);
      setLoadError("Não foi possível alterar a disponibilidade.");
    } finally {
      setPendingPizzaId(null);
    }
  };

  const handleDelete = async (pizza: Pizza) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${pizza.name}"?`,
    );
    if (!confirmed) return;

    setPendingPizzaId(pizza.id);
    setPageMessage("");
    setLoadError("");

    try {
      await deletePizza(pizza.id);
      setPizzas((currentPizzas) =>
        currentPizzas.filter((currentPizza) => currentPizza.id !== pizza.id),
      );
      if (editingPizza?.id === pizza.id) closeForm();
      setPageMessage("Pizza excluída com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir pizza:", error);
      setLoadError("Não foi possível excluir a pizza. Tente novamente.");
    } finally {
      setPendingPizzaId(null);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-500">
              Pizzaria System
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">Gestão de pizzas</h1>
            <p className="mt-2 text-neutral-400">
              Cadastre e gerencie os produtos do cardápio.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewPizzaForm}
            className="rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-800"
          >
            Nova pizza
          </button>
        </header>

        {pageMessage && (
          <p
            role="status"
            className="mb-6 rounded-lg border border-green-800 bg-green-950/50 px-4 py-3 text-sm text-green-300"
          >
            {pageMessage}
          </p>
        )}

        {isFormOpen && (
          <section
            aria-labelledby="pizza-form-title"
            className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="pizza-form-title" className="text-xl font-semibold">
                  {editingPizza ? "Editar pizza" : "Cadastrar pizza"}
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Preencha as informações do produto.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="text-sm text-neutral-400 transition-colors hover:text-white disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="pizza-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Nome
                </label>
                <input
                  id="pizza-name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="pizza-category"
                  className="mb-2 block text-sm font-medium"
                >
                  Categoria
                </label>
                <input
                  id="pizza-category"
                  required
                  maxLength={60}
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="pizza-price"
                  className="mb-2 block text-sm font-medium"
                >
                  Preço (R$)
                </label>
                <input
                  id="pizza-price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="pizza-image"
                  className="mb-2 block text-sm font-medium"
                >
                  Caminho da imagem
                </label>
                <input
                  id="pizza-image"
                  type="text"
                  required
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      imageUrl: event.target.value,
                    }))
                  }
                  placeholder="/images/pizza-calabresa.jpeg"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 outline-none focus:border-red-500"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Adicione o arquivo pelo editor dentro de public/images e
                  informe o caminho começando com /images/.
                </p>
                {isLocalImagePath(form.imageUrl.trim()) && (
                  <div className="relative mt-3 aspect-video max-w-xs overflow-hidden rounded-lg bg-neutral-800">
                    <Image
                      src={form.imageUrl.trim()}
                      alt={`Prévia da imagem${form.name ? ` de ${form.name}` : ""}`}
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="pizza-description"
                  className="mb-2 block text-sm font-medium"
                >
                  Descrição
                </label>
                <textarea
                  id="pizza-description"
                  required
                  rows={3}
                  maxLength={500}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="w-full resize-y rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-neutral-200 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      available: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-red-600"
                />
                Disponível no cardápio
              </label>

              {formError && (
                <p role="alert" className="text-sm text-red-400 md:col-span-2">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold transition-colors hover:bg-red-800 disabled:cursor-wait disabled:opacity-60"
                >
                  {isSaving
                    ? "Salvando..."
                    : editingPizza
                      ? "Salvar alterações"
                      : "Cadastrar pizza"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSaving}
                  className="rounded-lg border border-neutral-700 px-5 py-3 text-sm font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        <section
          aria-labelledby="pizzas-title"
          className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
        >
          <div className="border-b border-neutral-800 px-6 py-5">
            <h2 id="pizzas-title" className="text-lg font-semibold">
              Pizzas cadastradas
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              {pizzas.length} {pizzas.length === 1 ? "pizza cadastrada" : "pizzas cadastradas"}
            </p>
          </div>

          {loadError && (
            <div
              role="alert"
              className="flex flex-col gap-3 border-b border-neutral-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-red-400">{loadError}</p>
              <button
                type="button"
                onClick={() => void loadPizzas()}
                disabled={isLoading}
                className="text-left text-sm font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                Tentar novamente
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-neutral-800/60 text-neutral-300">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Preço
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Disponibilidade
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-800">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-neutral-400"
                    >
                      Carregando pizzas...
                    </td>
                  </tr>
                ) : pizzas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-neutral-400"
                    >
                      Nenhuma pizza cadastrada.
                    </td>
                  </tr>
                ) : (
                  pizzas.map((pizza) => (
                    <tr key={pizza.id} className="text-neutral-200">
                      <td className="px-6 py-4 font-medium">{pizza.name}</td>
                      <td className="px-6 py-4 text-neutral-400">
                        {pizza.category}
                      </td>
                      <td className="px-6 py-4">
                        {pizza.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            pizza.available
                              ? "rounded-full bg-green-950 px-3 py-1 text-xs font-medium text-green-300"
                              : "rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-400"
                          }
                        >
                          {pizza.available ? "Disponível" : "Indisponível"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEditPizzaForm(pizza)}
                            disabled={pendingPizzaId !== null || isSaving}
                            className="font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleAvailabilityChange(pizza)}
                            disabled={pendingPizzaId !== null || isSaving}
                            className="font-medium text-neutral-300 hover:text-white disabled:opacity-50"
                          >
                            {pendingPizzaId === pizza.id
                              ? "Aguarde..."
                              : pizza.available
                                ? "Desativar"
                                : "Ativar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(pizza)}
                            disabled={pendingPizzaId !== null || isSaving}
                            className="font-medium text-red-500 hover:text-red-400 disabled:opacity-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
