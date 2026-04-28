"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProveedoresRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Lógica futura: Si hay token, ir a /home. Si no, ir a /login.
    // Por ahora, lo mandamos al login para que el flujo sea natural.
    router.replace("/business/proveedores/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FCFAF8] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3D0A1A]"></div>
    </div>
  );
}