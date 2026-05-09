"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Calendar, ChevronDown, Loader2 } from "lucide-react";

export default function DashboardFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentRango = searchParams.get("rango") || "historico";
  const [isOpen, setIsOpen] = useState(false);

  const opciones = [
    { id: "historico", label: "Histórico (Todos los tiempos)" },
    { id: "hoy", label: "Hoy" },
    { id: "7dias", label: "Últimos 7 días" },
    { id: "30dias", label: "Últimos 30 días" },
    { id: "este_mes", label: "Este Mes" },
  ];

  const handleSelect = (id: string) => {
    setIsOpen(false);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (id === "historico") {
        params.delete("rango");
      } else {
        params.set("rango", id);
      }
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const selectedLabel = opciones.find((o) => o.id === currentRango)?.label || "Histórico";

  return (
    <div className="relative inline-block text-left z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#8E1B3A]/20 rounded-xl text-sm font-medium text-[#5A0F24] hover:bg-[#FAF3EC] transition-colors shadow-sm disabled:opacity-70"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin text-[#8E1B3A]" /> : <Calendar className="w-4 h-4 text-[#8E1B3A]" />}
        {selectedLabel}
        <ChevronDown className={`w-4 h-4 text-[#7A5260] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-[#8E1B3A]/10 py-1 z-20 animate-fade-in origin-top-right">
            {opciones.map((opcion) => (
              <button
                key={opcion.id}
                onClick={() => handleSelect(opcion.id)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentRango === opcion.id
                    ? "bg-[#FAF3EC] text-[#5A0F24] font-bold"
                    : "text-[#7A5260] hover:bg-[#FDFBF9] hover:text-[#5A0F24]"
                }`}
              >
                {opcion.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
