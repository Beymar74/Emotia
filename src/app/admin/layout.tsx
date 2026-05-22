"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@stackframe/stack";
import Sidebar from "./_components/Sidebar";
import Topbar from "./_components/Topbar";
import Breadcrumbs from "./_components/Breadcrumbs";
import AdminLoadingScreen from "./_components/AdminLoadingScreen";

const LABEL_MAP: Record<string, string> = {
  admin: "Inicio",
  usuarios: "Centro de Cuentas",
  empresas: "Empresas",
  actividad: "Actividad",
  rendimiento: "Rendimiento",
  productos: "Catálogo de Productos",
  categorias: "Categorías",
  personalizacion: "Tarjetas",
  pedidos: "Pedidos",
  carritos: "Carritos Abandonados",
  pagos: "Métodos de Pago",
  reportes: "Reportes",
  configuracion: "Configuración",
  notificaciones: "Notificaciones",
  recordatorios: "Recordatorios",
  calificaciones: "Reseñas",
  ventas: "Ventas",
  calidad: "Calidad de Servicio",
  clientes: "Clientes",
  global: "Métricas Globales",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  const [timerDone, setTimerDone] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), 10_000);
    return () => clearTimeout(t);
  }, []);

  if (!timerDone) {
    const displayName = user?.displayName || user?.primaryEmail?.split("@")[0] || null;
    return <AdminLoadingScreen userName={displayName} />;
  }

  // Generar migas de pan dinámicas
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    // Si el segmento es un número (ID de base de datos) lo mostramos como "Detalle" o el ID
    const isId = !isNaN(Number(seg));
    const label = isId ? `Detalle #${seg}` : (LABEL_MAP[seg] || seg.charAt(0).toUpperCase() + seg.slice(1));
    return { label, href };
  });

  return (
    <div className="flex min-h-screen bg-[#FAF3EC]">
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 pt-14 sm:pt-16">
        <Topbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Breadcrumbs crumbs={crumbs} />
          {children}
        </main>
      </div>
    </div>
  );
}
