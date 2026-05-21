"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import Topbar from "./_components/Topbar";
import Breadcrumbs from "./_components/Breadcrumbs";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

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
