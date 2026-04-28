"use client";

import { useState, useTransition } from "react";
import { cambiarEstadoPedido } from "../actions";

const ESTADOS = [
  { valor: "pendiente",      label: "Pendiente",      color: "bg-[#FFF3CD] text-[#856404]" },
  { valor: "confirmado",     label: "Confirmado",     color: "bg-[#E3F2FD] text-[#0D47A1]" },
  { valor: "en_preparacion", label: "En preparación", color: "bg-[#F3E5F5] text-[#6A1B9A]" },
  { valor: "enviado",        label: "Enviado",        color: "bg-[#E0F7FA] text-[#006064]" },
  { valor: "entregado",      label: "Entregado",      color: "bg-[#EEF8F0] text-[#2D7A47]" },
  { valor: "cancelado",      label: "Cancelado",      color: "bg-[#FBF0F0] text-[#A32D2D]" },
];

export default function CambiarEstadoBtn({
  pedidoId,
  estadoActual,
}: {
  pedidoId: number;
  estadoActual: string;
}) {
  const [estado, setEstado] = useState(estadoActual);
  const [mensaje, setMensaje] = useState("");
  const [isPending, startTransition] = useTransition();

  const estadoInfo = ESTADOS.find((e) => e.valor === estado) ?? ESTADOS[0];

  const handleChange = (nuevoEstado: string) => {
    if (nuevoEstado === estado) return;
    startTransition(async () => {
      const result = await cambiarEstadoPedido(pedidoId, nuevoEstado);
      if ("error" in result) {
        setMensaje(result.error ?? "Ocurrió un error al actualizar el estado.");
      } else {
        setEstado(nuevoEstado);
        setMensaje("Estado actualizado correctamente.");
        setTimeout(() => setMensaje(""), 3000);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ESTADOS.map((e) => (
          <button
            key={e.valor}
            onClick={() => handleChange(e.valor)}
            disabled={isPending || e.valor === estado}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
              e.valor === estado
                ? `${e.color} border-transparent ring-2 ring-offset-1 ring-[#8E1B3A]/30`
                : "border-[#8E1B3A]/15 text-[#7A5260] hover:bg-[#FAF3EC]"
            } disabled:opacity-60`}
          >
            {e.label}
          </button>
        ))}
      </div>
      {mensaje && (
        <p className="text-xs text-[#2D7A47] bg-[#EEF8F0] px-3 py-1.5 rounded-lg">
          {mensaje}
        </p>
      )}
    </div>
  );
}
