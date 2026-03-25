"use client";
import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, User, ChevronDown } from 'lucide-react';

const ESTADOS = ['Todos', 'Pendiente', 'Preparando', 'En Tránsito', 'Entregado'];

const MOCK_PEDIDOS = [
  { id: '#EM-2041', producto: 'Caja Sorpresa Spa Botánico', cliente: 'Beymar M.', direccion: 'Av. 6 de Agosto, Sopocachi', fecha: '12 Mar 2026', monto: 175, estado: 'En Tránsito', notas: 'Mensaje: Con mucho cariño para mamá' },
  { id: '#EM-2038', producto: 'Kit Café de Altura Local', cliente: 'Andrea S.', direccion: 'Calle Comercio 123, Centro', fecha: '10 Mar 2026', monto: 165, estado: 'Preparando', notas: '' },
  { id: '#EM-2035', producto: 'Terrario Geométrico', cliente: 'Carlos R.', direccion: 'Zona Sur, Calacoto', fecha: '08 Mar 2026', monto: 100, estado: 'Entregado', notas: 'Empaque premium' },
  { id: '#EM-2030', producto: 'Caja Sorpresa Spa Botánico', cliente: 'Liliana P.', direccion: 'El Alto, Ciudad Satélite', fecha: '05 Mar 2026', monto: 175, estado: 'Pendiente', notas: '' },
];

const ESTADO_CONFIG: Record<string, { color: string, bg: string, icon: any }> = {
  'Pendiente':   { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  'Preparando':  { color: 'text-[#8E1B3A]', bg: 'bg-[#F5E6D0]/50 border-[#BC9968]/30', icon: Package },
  'En Tránsito': { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: Truck },
  'Entregado':   { color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
};

const SIGUIENTE_ESTADO: Record<string, string> = {
  'Pendiente': 'Preparando',
  'Preparando': 'En Tránsito',
  'En Tránsito': 'Entregado',
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState(MOCK_PEDIDOS);
  const [filtro, setFiltro] = useState('Todos');

  const filtrados = filtro === 'Todos' ? pedidos : pedidos.filter(p => p.estado === filtro);

  const avanzarEstado = (id: string) => {
    setPedidos(prev => prev.map(p => {
      if (p.id !== id || !SIGUIENTE_ESTADO[p.estado]) return p;
      return { ...p, estado: SIGUIENTE_ESTADO[p.estado] };
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#5A0F24] mb-1">Pedidos Recibidos</h1>
        <p className="text-[#5C3A2E] text-sm">{filtrados.length} pedidos {filtro !== 'Todos' ? `en estado "${filtro}"` : 'en total'}</p>
      </div>

      {/* Filtros */}
      <div className="flex overflow-x-auto gap-3 pb-3 mb-8">
        {ESTADOS.map(e => (
          <button key={e} onClick={() => setFiltro(e)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${filtro === e ? 'bg-[#8E1B3A] text-white border-[#8E1B3A]' : 'bg-white text-[#5C3A2E] border-[#F5E6D0] hover:border-[#BC9968]'}`}>
            {e}
          </button>
        ))}
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-5">
        {filtrados.map(p => {
          const cfg = ESTADO_CONFIG[p.estado];
          const Icon = cfg.icon;
          const siguiente = SIGUIENTE_ESTADO[p.estado];
          return (
            <div key={p.id} className={`bg-[#FFFFFF] rounded-2xl p-6 border ${cfg.bg} shadow-sm`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${cfg.bg} border ${cfg.bg} shrink-0`}>
                    <Icon className={`w-6 h-6 ${cfg.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5C3A2E] text-lg leading-tight">{p.producto}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <span className="text-sm font-bold text-[#8E1B3A]">{p.id}</span>
                      <span className="text-sm text-[#B0B0B0] flex items-center gap-1"><User className="w-3 h-3" />{p.cliente}</span>
                      <span className="text-sm text-[#B0B0B0]">{p.fecha}</span>
                    </div>
                    <p className="text-xs text-[#B0B0B0] mt-1">📍 {p.direccion}</p>
                    {p.notas && <p className="text-xs text-[#8E1B3A] mt-1 italic">💬 {p.notas}</p>}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <p className="text-2xl font-extrabold text-[#5A0F24]">{p.monto} Bs</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cfg.color} ${cfg.bg}`}>{p.estado}</span>
                  {siguiente && (
                    <button onClick={() => avanzarEstado(p.id)}
                      className="flex items-center gap-1 bg-[#8E1B3A] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#5A0F24] transition-colors shadow-sm">
                      Marcar: {siguiente} <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-[#F5E6D0] mx-auto mb-4" />
          <p className="text-[#B0B0B0] font-medium">No hay pedidos en este estado.</p>
        </div>
      )}
    </div>
  );
}
