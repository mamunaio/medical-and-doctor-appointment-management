"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-medical-green">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-black uppercase tracking-widest text-sm">Injaazh HMS Loading...</p>
      </div>
    </div>
  );
}
