"use client";

import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";

type AccessStatus = "checking" | "authorized" | "error";

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [status, setStatus] = useState<AccessStatus>("checking");

  useEffect(() => {
    let isActive = true;
    let checkVersion = 0;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const currentVersion = ++checkVersion;

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const verifyAdmin = async () => {
        try {
          const adminDocument = await getDoc(doc(db, "admins", user.uid));

          if (!isActive || currentVersion !== checkVersion) return;

          if (!adminDocument.exists()) {
            await signOut(auth);

            if (isActive && currentVersion === checkVersion) {
              router.replace("/admin/login");
            }
            return;
          }

          setStatus("authorized");
        } catch (error) {
          console.error("Erro ao verificar acesso administrativo:", error);

          if (isActive && currentVersion === checkVersion) {
            setStatus("error");
          }
        }
      };

      void verifyAdmin();
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [router]);

  if (status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-neutral-300">
        <p role="status">Verificando acesso administrativo...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center text-white">
        <p role="alert" className="text-red-400">
          Não foi possível verificar sua autorização.
        </p>
        <Link
          href="/admin/login"
          className="text-sm font-semibold text-red-400 hover:text-red-300"
        >
          Voltar ao login
        </Link>
      </main>
    );
  }

  return children;
};

export default AdminGuard;
