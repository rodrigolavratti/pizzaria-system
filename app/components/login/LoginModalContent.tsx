"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/app/context";
import { FirebaseError } from "firebase/app";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginModalContent() {
  const { closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError("");

    const errors = {
      name: mode === "register" && !name.trim() ? "Preencha seu nome." : "",
      email: !email.trim()
        ? "Preencha seu e-mail."
        : emailInputRef.current?.validity.typeMismatch
          ? "Informe um e-mail válido."
          : "",
      password: !password
        ? "Preencha sua senha."
        : mode === "register" &&
            !/^(?=.*\p{Lu})(?=.*[^\p{L}\p{N}\s]).{6,}$/u.test(password)
          ? "A senha deve ter pelo menos 6 caracteres, uma letra maiúscula e um caractere especial."
          : "",
    };
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) return;

    try {
      if (mode === "register") {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (error) {
      console.error("Erro ao autenticar:", error);

      if (
        error instanceof FirebaseError &&
        error.code === "auth/weak-password"
      ) {
        setAuthError("A senha precisa ter pelo menos 6 caracteres.");
        setTimeout(() => setAuthError(""), 5000);
      } else {
        setAuthError(
          "Não foi possível autenticar. Confira os dados e tente novamente.",
        );
        setTimeout(() => setAuthError(""), 5000);
      }
    }
  };

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    setFieldErrors({ name: "", email: "", password: "" });
    setAuthError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-neutral-900 p-6 shadow-2xl border border-neutral-800 text-white">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          ✕
        </button>

        <div className="flex border-b border-neutral-800 mb-6">
          <button
            onClick={() => handleModeChange("login")}
            className={`flex-1 pb-3 text-center font-semibold transition-colors ${
              mode === "login"
                ? "border-b-2 border-red-600 text-red-500"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Entrar
          </button>

          <button
            onClick={() => handleModeChange("register")}
            className={`flex-1 pb-3 text-center font-semibold transition-colors ${
              mode === "register"
                ? "border-b-2 border-red-600 text-red-500"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((current) => ({ ...current, name: "" }));
                }}
                placeholder="Nome Completo"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-red-500"
              />
              {fieldErrors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-400">
                  {fieldErrors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              required
              ref={emailInputRef}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((current) => ({ ...current, email: "" }));
              }}
              placeholder="seuemail@exemplo.com"
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-red-500"
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                required
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((current) => ({ ...current, password: "" }));
                }}
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-12 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                aria-label={
                  isPasswordVisible ? "Ocultar senha" : "Mostrar senha"
                }
                aria-pressed={isPasswordVisible}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-white"
              >
                {isPasswordVisible ? (
                  <FiEyeOff aria-hidden="true" />
                ) : (
                  <FiEye aria-hidden="true" />
                )}
              </button>
            </div>
            {mode === "register" && !fieldErrors.password && (
              <p className="mt-1 text-sm text-neutral-400">
                A senha deve conter mínimo de 6 caracteres, incluindo uma letra
                maiúscula e um caractere especial.
              </p>
            )}
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {authError && (
            <div
              role="alert"
              className="w-full rounded-lg border border-red-500/40 bg-red-950/60 px-4 py-3 text-sm text-red-200"
            >
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 font-bold rounded-lg transition-colors shadow-lg"
          >
            {mode === "login" ? "Entrar na Conta" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
