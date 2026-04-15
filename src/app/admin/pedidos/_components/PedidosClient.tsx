"use client";

import { useTransition } from "react";
import { cancelarPedido } from "../../actions";

// 1. Definimos la interfaz para las estadísticas
interface Stats {
  totalPedidos: number;
  pendientes: number;
  enCurso: number;
  completados: number;
  cancelados: number;
}

// 2. Actualizamos las Props del componente
interface PedidosClientProps {
  pedidos: any[];
  stats: Stats; // <--- Agregamos esto
}

export default function PedidosClient({ pedidos, stats }: PedidosClientProps) {
  const [isPending, startTransition] = useTransition();

  const onCancelar = (idNum: number) => {
    if (confirm("¿Confirmas la cancelación de este pedido?")) {
      startTransition(async () => {
        await cancelarPedido(idNum);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 3. Ahora puedes usar stats en tu UI si lo necesitas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#8E1B3A]/10">
          <p className="text-xs text-[#7A5260]">Total Pedidos</p>
          <p className="text-2xl font-bold text-[#5A0F24]">{stats.totalPedidos}</p>
        </div>
        {/* Agrega los demás recuadros de stats aquí... */}
      </div>

      <div className="grid gap-4">
        {pedidos.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl border border-[#8E1B3A]/10 flex justify-between items-center">
            <div>
              <p className="font-bold text-[#5A0F24]">{p.id}</p>
              <p className="text-sm text-[#7A5260]">{p.usuario} • {p.producto}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${p.estado === 'cancelado' ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
                {p.estado}
              </span>
              {p.estado !== "cancelado" && (
                <button 
                  disabled={isPending}
                  onClick={() => onCancelar(p.idNum)}
                  className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}