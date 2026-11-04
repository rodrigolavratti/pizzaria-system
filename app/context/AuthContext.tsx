"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, SidebarPanel, User } from "@/app/types/auth";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<SidebarPanel | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isAuthReady, setIsAuthReady] = useState(false);

  const openSidebar = (panel: SidebarPanel) => setActiveSidebar(panel);
  const closeSidebar = () => setActiveSidebar(null);

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setActiveSidebar(null);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          setIsAuthReady(true);
          return;
        }

        setUser({
          name:
            firebaseUser.displayName ??
            firebaseUser.email?.split("@")[0] ??
            "Cliente",
          email: firebaseUser.email ?? "",
        });
        setIsAuthReady(true);
      },
      (error) => {
        console.error("Erro ao observar autenticação Firebase:", error);
        setIsAuthReady(true);
      },
    );
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    closeAuthModal();
  };

  const register = async (name: string, email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(credential.user, { displayName: name });
    setUser({ name, email });
    closeAuthModal();
  };

  const logout = async () => {
    await signOut(auth);
    closeSidebar();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeSidebar,
        isAuthModalOpen,
        authMode,
        openSidebar,
        closeSidebar,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        isAuthReady,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
