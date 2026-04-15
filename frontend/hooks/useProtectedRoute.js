import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/context/AuthContext";

export function useProtectedRoute({ adminOnly = false } = {}) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.loading) {
      return;
    }

    if (!auth.isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (adminOnly && auth.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [adminOnly, auth.isAuthenticated, auth.loading, auth.user?.role, router]);

  return auth;
}
