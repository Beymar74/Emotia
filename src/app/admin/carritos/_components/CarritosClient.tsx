"use client";

import { useState, useTransition } from "react";
import { Search, Bell, Loader2, CheckCircle2 } from "lucide-react";
import { enviarRecordatorioCarrito } from "../actions";

interface CarritoItem {
  id: number;
  usuario_id: number;
  usuario: string;
  email: string;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at: string;
  mensaje: string | null;
  empaque: boolean;
}

interface Props {
  items: CarritoItem[];
}

function formatFecha(isoStr: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date(isoStr));
}

function RecuperarBtn({ usuarioId, nombre }: { usuarioId: number; nombre: string }) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    startTransition(async () => {
      await enviarRecordatorioCarrito(usuarioId, nombre.split(" ")[0]);
      setSent(true);
    });
  };

  if (sent) {
    return (
      <span className="flex items-center gap-1 text-xs text-[#2D7A47] font-medium">
        <CheckCircle2 size={13} /> Enviado
      </span>
    );
  }

  return (
    <button
      onClick={handleSend}
      disabled={isPending}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] font-bold hover:bg-[#8E1B3A] hover:text-white transition-all disabled:opacity-50"
    >
      {isPending ? <Loader2 size={12} className="animate-spin" /> : <Bell size={12} />}
      Recordatorio
    </button>
  );
}

export default function CarritosClient({ items }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEmpaque, setFiltroEmpaque] = useState("");

  // Agrupar usuarios únicos para el panel de recuperación
  const usuariosMap = new Map<number, { id: number; nombre: string; email: string; items: number; subtotal: number }>();
  for (const item of items) {
    if (!usuariosMap.has(item.usuario_id)) {
      usuariosMap.set(item.usuario_id, { id: item.usuario_id, nombre: item.usuario, email: item.email, items: 0, subtotal: 0 });
    }
    const u = usuariosMap.get(item.usuario_id)!;
    u.items += item.cantidad;
    u.subtotal += item.subtotal;
  }
  const usuariosConCarrito = Array.from(usuariosMap.values());

  const filtrados = items.filter((item) => {
    const q = busqueda.toLowerCase();
    const coincideBusqueda =
      !q ||
      item.usuario.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.producto.toLowerCase().includes(q);

    const coincideEmpaque =
      filtroEmpaque === "" ||
      (filtroEmpaque === "si" && item.empaque) ||
      (filtroEmpaque === "no" && !item.empaque);

    return coincideBusqueda && coincideEmpaque;
  });

  return (
    <div className="space-y-5">
      {/* Panel de recuperación */}
      {usuariosConCarrito.length > 0 && (
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10">
          <div className="px-5 py-4 border-b border-[#8E1B3A]/10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#5A0F24]">Recuperación de carritos</h2>
              <p className="text-xs text-[#7A5260] mt-0.5">Envía un recordatorio en la app a usuarios con carrito abandonado.</p>
            </div>
            <span className="text-xs bg-[#8E1B3A]/8 text-[#8E1B3A] px-3 py-1 rounded-full font-bold">
              {usuariosConCarrito.length} {usuariosConCarrito.length === 1 ? "usuario" : "usuarios"}
            </span>
          </div>
          <div className="divide-y divide-[#8E1B3A]/5">
            {usuariosConCarrito.map((u) => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5A0F24] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {u.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2A0E18] truncate">{u.nombre}</p>
                    <p className="text-xs text-[#7A5260] truncate">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#5A0F24]">Bs {u.subtotal.toFixed(2)}</p>
                    <p className="text-xs text-[#7A5260]">{u.items} uds</p>
                  </div>
                  <RecuperarBtn usuarioId={u.id} nombre={u.nombre} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de ítems */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10">
        <div className="px-5 py-4 border-b border-[#8E1B3A]/10 flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="font-serif text-xl font-semibold text-[#5A0F24] flex-1">Detalle de carritos</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5260]/50" size={15} />
              <input
                type="text"
                placeholder="Usuario, email o producto…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full sm:w-64 bg-[#FDFBF9] text-sm border border-[#8E1B3A]/10 rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#8E1B3A]/20"
              />
            </div>
            <select
              value={filtroEmpaque}
              onChange={(e) => setFiltroEmpaque(e.target.value)}
              className="text-xs font-semibold border border-[#8E1B3A]/10 rounded-xl px-4 py-2 outline-none text-[#7A5260] bg-[#FDFBF9] cursor-pointer hover:border-[#8E1B3A]/30"
            >
              <option value="">Empaque: todos</option>
              <option value="si">Con empaque especial</option>
              <option value="no">Sin empaque</option>
            </select>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="py-12 text-center text-[#7A5260] text-sm italic">
            No se encontraron ítems con esa búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr>
                  {["Usuario", "Producto", "Cant.", "Precio unit.", "Subtotal", "Mensaje", "Empaque", "Agregado"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((item) => (
                  <tr key={item.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#2A0E18]">{item.usuario}</p>
                      <p className="text-xs text-[#7A5260]">{item.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A0F24] font-semibold max-w-[180px] truncate">{item.producto}</td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-[#2A0E18]">{item.cantidad}</td>
                    <td className="px-4 py-3 text-sm text-[#7A5260]">Bs {item.precio_unitario.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#5A0F24]">Bs {item.subtotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs text-[#7A5260] max-w-[120px] truncate">
                      {item.mensaje ?? <span className="text-[#B0B0B0]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.empaque ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-[#FFF3E0] text-[#E65100]">Sí</span>
                      ) : (
                        <span className="text-[#B0B0B0] text-xs">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#7A5260]">{formatFecha(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-5 py-3 border-t border-[#8E1B3A]/5 text-xs text-[#7A5260]">
          {filtrados.length} de {items.length} ítems
        </div>
      </div>
    </div>
  );
}
