import React from "react";

import Sidebar from "../_components/Sidebar";
import Topbar from "../_components/Topbar";

import { obtenerDatosNegocioActual } from "@/lib/auth-proveedor";

export interface DatosNegocio {
  id?: number;
  nombre: string;
  iniciales: string;
  estado: string;
  logo?: string | null;
}

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const datosNegocio = await obtenerDatosNegocioActual();

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-sans overflow-hidden">
      <Sidebar datosNegocio={datosNegocio} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar datosNegocio={datosNegocio} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}