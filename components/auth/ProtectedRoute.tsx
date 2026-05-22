"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated || !token) {
      router.push("/auth/login");
    } else if (roles && user && !roles.includes(user.role)) {
      router.push("/dashboard"); // Or a forbidden page
    }
  }, [isAuthenticated, token, user, roles, router, mounted]);

  if (!mounted || !isAuthenticated || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-medical-green animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
