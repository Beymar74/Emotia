"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { cancelarPedido } from "../../actions";
import ModalConfirmar from "../../_components/ModalConfirmar";

interface Stats {
  totalPedidos: number;
  pendientes: number;
  enCurso: number;
  completados: number;
  cancelados: number;
}

interface Pedido {
  id: string;
  idNum: number;
  usuario: string;
  proveedor: string;
  producto: string;
  monto: string;
  fecha: string;
  estado: string;
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

export default function PedidosClient({
  pedidos,
  stats,
}: {
  pedidos: Pedido[];
  stats: Stats;
}) {
  const [filtro, setFiltro] = useState("todos");
  const [pedidoACancelar, setPedidoACancelar] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtrados =
    filtro === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtro);

  const confirmarCancelacion = () => {
    if (pedidoACancelar === null) return;
    startTransition(async () => {
      await cancelarPedido(pedidoACancelar);
      setPedidoACancelar(null);
    });
  };

  return (
    <div className="space-y-6">
      {/* Modal de confirmación personalizado */}
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

      {/* Stats */}
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
            onClick={() => setFiltro(s.key)}
            className={`bg-white p-4 rounded-xl border text-left transition-all ${
              filtro === s.key
                ? "border-[#8E1B3A]/40 shadow-md"
                : "border-[#8E1B3A]/10 hover:shadow-sm"
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
        <div className="px-5 py-4 border-b border-[#8E1B3A]/10 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-[#5A0F24]">
            {filtro === "todos" ? "Todos los pedidos" : `Pedidos: ${ESTADO_LABEL[filtro] ?? filtro}`}
          </h2>
          <span className="text-xs text-[#7A5260]">
            {filtrados.length} resultado{filtrados.length !== 1 ? "s" : ""}
          </span>
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
            {filtrados.map((p) => (
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
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      ESTADO_BADGE[p.estado] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
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
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-[#7A5260]">
                  No hay pedidos con ese filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}