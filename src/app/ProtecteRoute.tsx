"use client"
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("http://localhost:3000"); // Redirigir al login si no hay token
    }
  }, [token, router]);

  return token ? <>{children}</> : null;
};

export default ProtectedRoute;
