"use client";

import { useEffect } from "react";

interface ModalConfirmarProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  labelConfirmar?: string;
  labelCancelar?: string;
  variante?: "peligro" | "advertencia" | "info";
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalConfirmar({
  abierto,
  titulo,
  mensaje,
  labelConfirmar = "Confirmar",
  labelCancelar = "Cancelar",
  variante = "peligro",
  onConfirmar,
  onCancelar,
}: ModalConfirmarProps) {
  // Cerrar con Escape
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancelar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  const colores = {
    peligro:     { icono: "🗑️", btn: "bg-[#8E1B3A] hover:bg-[#6B1229]", borde: "border-[#8E1B3A]/20", linea: "#8E1B3A" },
    advertencia: { icono: "⚠️", btn: "bg-[#BC9968] hover:bg-[#9e7d50]", borde: "border-[#BC9968]/20", linea: "#BC9968" },
    info:        { icono: "ℹ️", btn: "bg-[#5A0F24] hover:bg-[#3d0918]", borde: "border-[#5A0F24]/20", linea: "#5A0F24" },
  }[variante];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancelar}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-sm border ${colores.borde} overflow-hidden`}
      >
        {/* Línea superior de color */}
        <div className="h-1 w-full" style={{ background: colores.linea }} />

        <div className="p-6">
          {/* Icono + Título */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${colores.linea}15` }}
            >
              {colores.icono}
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2A0E18]">
                {titulo}
              </h2>
              <p className="text-sm text-[#7A5260] mt-1 leading-relaxed">
                {mensaje}
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancelar}
              className="flex-1 border border-[#8E1B3A]/20 text-sm px-4 py-2.5 rounded-xl text-[#7A5260] hover:bg-[#FAF3EC] transition-colors font-medium"
            >
              {labelCancelar}
            </button>
            <button
              onClick={onConfirmar}
              className={`flex-1 text-white text-sm px-4 py-2.5 rounded-xl font-medium transition-colors ${colores.btn}`}
            >
              {labelConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
