"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toggleSuspensionProveedor } from "../actions";
import ModalConfirmacion from "@/app/admin/productos/_components/ModalConfirmacion";

export default function BotonesAccionEmpresa({ empresa }: { empresa: any }) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);

  const confirmar = () => {
    startTransition(async () => {
      await toggleSuspensionProveedor(empresa.id, empresa.estado);
      setModalOpen(false);
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/empresas/${empresa.id}/editar`}
          className="text-[11px] px-3 py-1.5 rounded-lg bg-[#FDF5E6] text-[#8C5E08] font-bold hover:bg-[#BC9968] hover:text-white transition-all shadow-sm"
        >
          Editar
        </Link>
        <button
          onClick={() => setModalOpen(true)}
          disabled={isPending}
          className={`text-[11px] px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1 disabled:opacity-60 ${
            empresa.estado === "aprobado"
              ? "bg-[#FBF0F0] text-[#A32D2D] hover:bg-[#A32D2D] hover:text-white"
              : "bg-[#EEF8F0] text-[#2D7A47] hover:bg-[#2D7A47] hover:text-white"
          }`}
        >
          {isPending && <Loader2 size={11} className="animate-spin" />}
          {empresa.estado === "aprobado" ? "Suspender" : "Activar"}
        </button>
      </div>

      <ModalConfirmacion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmar}
        titulo={empresa.estado === "aprobado" ? "Suspender Empresa" : "Activar Empresa"}
        mensaje={
          empresa.estado === "aprobado"
            ? `¿Estás seguro de suspender a "${empresa.nombre_negocio}"? No podrá recibir nuevos pedidos.`
            : `¿Deseas activar nuevamente a "${empresa.nombre_negocio}"? Volverá a estar visible para los clientes.`
        }
        confirmText={empresa.estado === "aprobado" ? "Suspender" : "Activar"}
        isDestructive={empresa.estado === "aprobado"}
      />
    </>
  );
}
