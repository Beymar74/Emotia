"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Store, ChevronDown, Loader2 } from "lucide-react";

interface Props {
  empresas: { id: number; nombre_negocio: string }[];
}

export default function EmpresaFilter({ empresas }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentEmpresa = searchParams.get("empresa") || "todas";
  const [isOpen, setIsOpen] = useState(false);

  const opciones = [
    { id: "todas", label: "Todas las Empresas" },
    ...empresas.map(e => ({ id: e.id.toString(), label: e.nombre_negocio }))
  ];

  const handleSelect = (id: string) => {
    setIsOpen(false);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (id === "todas") {
        params.delete("empresa");
      } else {
        params.set("empresa", id);
      }
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const selectedLabel = opciones.find((o) => o.id === currentEmpresa)?.label || "Todas las Empresas";

  return (
    <div className="relative inline-block text-left z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2 bg-[#FDFBF9] border border-[#8E1B3A]/20 rounded-xl text-sm font-medium text-[#5A0F24] hover:bg-[#FAF3EC] transition-colors shadow-sm disabled:opacity-70"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin text-[#8E1B3A]" /> : <Store className="w-4 h-4 text-[#8E1B3A]" />}
        <span className="max-w-[150px] truncate">{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-[#7A5260] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 max-h-64 overflow-y-auto custom-scrollbar rounded-xl bg-white shadow-xl border border-[#8E1B3A]/10 py-1 z-30 animate-fade-in origin-top-right">
            {opciones.map((opcion) => (
              <button
                key={opcion.id}
                onClick={() => handleSelect(opcion.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                  currentEmpresa === opcion.id
                    ? "bg-[#FAF3EC] text-[#5A0F24] font-bold"
                    : "text-[#7A5260] hover:bg-[#FDFBF9] hover:text-[#5A0F24]"
                }`}
              >
                <span className="truncate">{opcion.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Modal de carga mientras se aplican los filtros */}
      {isPending && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-[#8E1B3A]/10 p-6 flex flex-col items-center gap-4 min-w-[250px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#8E1B3A]" />
            <div className="text-center">
              <p className="font-serif text-lg font-bold text-[#5A0F24]">Aplicando filtros...</p>
              <p className="text-sm text-[#7A5260] mt-1">Generando reporte dinámico</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
