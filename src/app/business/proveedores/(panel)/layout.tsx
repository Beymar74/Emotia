import React from "react";

import ProveedorPanelShell from "./_components/ProveedorPanelShell";

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
    <ProveedorPanelShell datosNegocio={datosNegocio}>
      {children}
    </ProveedorPanelShell>
  );
}