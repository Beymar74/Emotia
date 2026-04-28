"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import Topbar from "./_components/Topbar";
import { obtenerDatosSesionNegocio } from "./actions";

export interface DatosNegocio {
  id?: number;
  nombre: string;
  iniciales: string;
  estado: string;
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [datosNegocio, setDatosNegocio] = useState<DatosNegocio | null>(null);

  useEffect(() => {
    // Llamamos al servidor apenas carga el layout
    obtenerDatosSesionNegocio().then((datos) => {
      if (datos) {
        setDatosNegocio(datos);
      }
    });
  }, []);

  const esRutaAuth = pathname.includes("/login") || pathname.includes("/registro");

  if (esRutaAuth) {
    return <div className="min-h-screen bg-[#FCFAF8]">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-sans overflow-hidden">
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        datosNegocio={datosNegocio} 
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar 
          onMenuToggle={() => setMobileMenuOpen(true)} 
          datosNegocio={datosNegocio} 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}