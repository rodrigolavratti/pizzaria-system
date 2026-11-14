"use client";

import { useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/admin/dashboard");
    } catch (error) {
      console.error("Erro no login administrativo:", error);

      if (
        error instanceof FirebaseError &&
        error.code === "auth/too-many-requests"
      ) {
        setErrorMessage(
          "Muitas tentativas. Aguarde um pouco e tente novamente.",
        );
      } else {
        setErrorMessage("E-mail ou senha inválidos.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl sm:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-500">
          Pizzaria System
        </p>

        <h1 className="text-2xl font-bold">Acesso administrativo</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Entre com a conta autorizada para gerenciar o painel.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-neutral-200"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
              placeholder="admin@exemplo.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-neutral-200"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none transition focus:border-red-500"
              placeholder="Sua senha"
            />
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-red-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AdminLoginPage;
