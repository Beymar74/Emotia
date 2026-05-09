"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  totalItems: number;
  porPagina: number;
}

export default function Paginacion({ paginaActual, totalPaginas, totalItems, porPagina }: PaginacionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("pagina", String(pageNumber));
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const inicio = (paginaActual - 1) * porPagina + 1;
  const fin = Math.min(paginaActual * porPagina, totalItems);

  const paginas: (number | "...")[] = [];
  if (totalPaginas <= 7) {
    for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
  } else {
    paginas.push(1);
    if (paginaActual > 3) paginas.push("...");
    for (let i = Math.max(2, paginaActual - 1); i <= Math.min(totalPaginas - 1, paginaActual + 1); i++) paginas.push(i);
    if (paginaActual < totalPaginas - 2) paginas.push("...");
    paginas.push(totalPaginas);
  }

  if (totalPaginas <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#8E1B3A]/8">
      <p className="text-xs text-[#7A5260]">
        Mostrando <span className="font-semibold text-[#5A0F24]">{inicio}–{fin}</span> de{" "}
        <span className="font-semibold text-[#5A0F24]">{totalItems}</span> registros
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => router.push(createPageURL(paginaActual - 1))}
          disabled={paginaActual === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#8E1B3A]/15 text-[#7A5260] hover:bg-[#FAF3EC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
          aria-label="Página anterior"
        >
          ‹
        </button>
        {paginas.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-[#7A5260] text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => router.push(createPageURL(p as number))}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === paginaActual
                  ? "bg-[#8E1B3A] text-white"
                  : "border border-[#8E1B3A]/15 text-[#7A5260] hover:bg-[#FAF3EC]"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => router.push(createPageURL(paginaActual + 1))}
          disabled={paginaActual === totalPaginas}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#8E1B3A]/15 text-[#7A5260] hover:bg-[#FAF3EC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
          aria-label="Página siguiente"
        >
          ›
        </button>
      </div>
    </div>
  );
}
