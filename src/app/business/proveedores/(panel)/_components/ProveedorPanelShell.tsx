"use client";

import { useState } from "react";
import Sidebar from "../../_components/Sidebar";
import Topbar from "../../_components/Topbar";
import type { DatosNegocio } from "../layout";

export default function ProveedorPanelShell({
  children,
  datosNegocio,
}: {
  children: React.ReactNode;
  datosNegocio: DatosNegocio;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-sans overflow-hidden">
      {sidebarOpen && (
        <Sidebar
            datosNegocio={datosNegocio}
            desktopVisible={true}
        />
        )}

        <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        datosNegocio={datosNegocio}
        desktopVisible={false}
        />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          datosNegocio={datosNegocio}
          onMenuToggle={() => {
            if (window.innerWidth >= 1024) {
              setSidebarOpen((prev) => !prev);
            } else {
              setMobileOpen(true);
            }
          }}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}