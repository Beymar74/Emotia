"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cancelarPedido } from "../../actions";
import ModalConfirmar from "../../_components/ModalConfirmar";

interface Stats {
  totalPedidos: number;
  pendientes:   number;
  enCurso:      number;
  completados:  number;
  cancelados:   number;
}

interface Pedido {
  id:       string;
  idNum:    number;
  usuario:  string;
  proveedor: string;
  producto: string;
  monto:    string;
  fecha:    string;
  estado:   string;
}

const ESTADO_BADGE: Record<string, string> = {
  pendiente:      "bg-[#FFF3CD] text-[#856404]",
  en_preparacion: "bg-[#F3E5F5] text-[#6A1B9A]",
  en_camino:      "bg-[#E0F7FA] text-[#006064]",
  completado:     "bg-[#EEF8F0] text-[#2D7A47]",
  cancelado:      "bg-[#FBF0F0] text-[#A32D2D]",
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente:      "Pendiente",
  en_preparacion: "En preparación",
  en_camino:      "En camino",
  completado:     "Completado",
  cancelado:      "Cancelado",
};

// Mapeo de filtro UI → valor BD para URL
const FILTRO_BD: Record<string, string> = {
  todos:          "todos",
  pendiente:      "pendiente",
  en_preparacion: "en_preparacion",
  en_camino:      "enviado",
  completado:     "entregado",
  cancelado:      "cancelado",
};

export default function PedidosClient({
  pedidos,
  stats,
  estadoFiltroActivo = "todos",
  busquedaInicial = "",
}: {
  pedidos: Pedido[];
  stats: Stats;
  estadoFiltroActivo?: string;
  busquedaInicial?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pedidoACancelar, setPedidoACancelar] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const cambiarFiltro = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("estado", FILTRO_BD[key] ?? key);
    params.set("pagina", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const confirmarCancelacion = () => {
    if (pedidoACancelar === null) return;
    startTransition(async () => {
      await cancelarPedido(pedidoACancelar);
      setPedidoACancelar(null);
    });
  };

  // Determinar filtro UI activo desde el valor BD recibido
  const filtroUI = Object.entries(FILTRO_BD).find(([, v]) => v === estadoFiltroActivo)?.[0] ?? "todos";

  return (
    <div className="space-y-6">
      <ModalConfirmar
        abierto={pedidoACancelar !== null}
        titulo="Cancelar pedido"
        mensaje={`¿Estás seguro de que deseas cancelar el pedido #${String(pedidoACancelar ?? "").padStart(4, "0")}? Esta acción no se puede deshacer.`}
        labelConfirmar="Sí, cancelar"
        labelCancelar="Volver"
        variante="peligro"
        onConfirmar={confirmarCancelacion}
        onCancelar={() => setPedidoACancelar(null)}
      />

      {/* Stats / Filtros */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total",       valor: stats.totalPedidos, key: "todos",          color: "#8E1B3A" },
          { label: "Pendientes",  valor: stats.pendientes,   key: "pendiente",      color: "#856404" },
          { label: "En curso",    valor: stats.enCurso,      key: "en_preparacion", color: "#6A1B9A" },
          { label: "Completados", valor: stats.completados,  key: "completado",     color: "#2D7A47" },
          { label: "Cancelados",  valor: stats.cancelados,   key: "cancelado",      color: "#A32D2D" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => cambiarFiltro(s.key)}
            className={`bg-white p-4 rounded-xl border text-left transition-all ${
              filtroUI === s.key ? "border-[#8E1B3A]/40 shadow-md" : "border-[#8E1B3A]/10 hover:shadow-sm"
            }`}
          >
            <div className="h-[3px] rounded-full mb-2 w-8" style={{ background: s.color }} />
            <p className="text-xs text-[#7A5260]">{s.label}</p>
            <p className="text-2xl font-bold text-[#5A0F24]">{s.valor}</p>
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-x-auto">
        <div className="px-5 py-4 border-b border-[#8E1B3A]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-lg font-semibold text-[#5A0F24]">
              {filtroUI === "todos" ? "Todos los pedidos" : `Pedidos: ${ESTADO_LABEL[filtroUI] ?? filtroUI}`}
            </h2>
            <span className="text-xs text-[#7A5260] bg-[#FAF3EC] px-2 py-1 rounded-full font-medium">
              {pedidos.length} en esta página
            </span>
          </div>
          <input
            type="text"
            placeholder="Buscar ID, cliente o producto..."
            defaultValue={busquedaInicial}
            onChange={(e) => {
              const v = e.target.value;
              clearTimeout((window as any).__pedBusq);
              (window as any).__pedBusq = setTimeout(() => {
                startTransition(() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (v) params.set("q", v); else params.delete("q");
                  params.set("pagina", "1");
                  router.push(`${pathname}?${params.toString()}`);
                });
              }, 400);
            }}
            className="text-sm border border-[#8E1B3A]/15 rounded-lg px-3 py-2 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18] bg-[#FDFBF9] hover:bg-white transition-colors w-full sm:w-72"
          />
        </div>
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr>
              {["ID", "Cliente", "Proveedor", "Producto", "Monto", "Fecha", "Estado", "Acciones"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr
                key={p.id}
                className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/pedidos/${p.idNum}`}
                    className="text-sm font-bold text-[#8E1B3A] hover:underline font-mono"
                  >
                    {p.id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-[#2A0E18]">{p.usuario}</td>
                <td className="px-4 py-3 text-sm text-[#7A5260]">{p.proveedor}</td>
                <td className="px-4 py-3 text-sm text-[#7A5260] max-w-[160px] truncate">{p.producto}</td>
                <td className="px-4 py-3 text-sm font-semibold text-[#5A0F24]">{p.monto}</td>
                <td className="px-4 py-3 text-sm text-[#7A5260]">{p.fecha}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${ESTADO_BADGE[p.estado] ?? "bg-gray-100 text-gray-600"}`}>
                    {ESTADO_LABEL[p.estado] ?? p.estado}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/pedidos/${p.idNum}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#FAF3EC] text-[#8C5E08] font-medium hover:opacity-80 transition-opacity"
                    >
                      Ver detalle
                    </Link>
                    {p.estado !== "cancelado" && p.estado !== "completado" && (
                      <button
                        disabled={isPending}
                        onClick={() => setPedidoACancelar(p.idNum)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#FBF0F0] text-[#A32D2D] font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 bg-[#FAF3EC] rounded-full flex items-center justify-center text-[#BC9968]">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[#7A5260]">No se encontraron pedidos</p>
                    <p className="text-xs text-[#7A5260]/70">No hay pedidos que coincidan con el estado seleccionado.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de carga mientras se aplican los filtros de búsqueda / estados */}
      {isPending && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-[#8E1B3A]/10 p-6 flex flex-col items-center gap-4 min-w-[250px]">
            <div className="w-8 h-8 border-4 border-[#8E1B3A]/30 border-t-[#8E1B3A] rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-serif text-lg font-bold text-[#5A0F24]">Aplicando filtros...</p>
              <p className="text-sm text-[#7A5260] mt-1">Buscando pedidos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
