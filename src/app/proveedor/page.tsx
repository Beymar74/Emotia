"use client";
import { useUser } from '@stackframe/stack';
import { ShoppingBag, Package, TrendingUp, Star, Clock, CheckCircle, Truck, ArrowRight, DollarSign } from 'lucide-react';
import Link from 'next/link';

const METRICAS = [
  { label: 'Ventas del Mes', valor: '1,240 Bs', icon: DollarSign, color: 'bg-[#8E1B3A]', text: 'text-white' },
  { label: 'Pedidos Activos', valor: '5', icon: ShoppingBag, color: 'bg-[#BC9968]', text: 'text-white' },
  { label: 'Productos Activos', valor: '8', icon: Package, color: 'bg-[#F5E6D0]', text: 'text-[#8E1B3A]' },
  { label: 'Calificación', valor: '4.9 ★', icon: Star, color: 'bg-[#F5E6D0]', text: 'text-[#8E1B3A]' },
];

const PEDIDOS_RECIENTES = [
  { id: '#EM-2041', producto: 'Caja Sorpresa Spa Botánico', cliente: 'Beymar M.', monto: 175, estado: 'En Tránsito', color: 'text-[#BC9968]' },
  { id: '#EM-2038', producto: 'Kit Café de Altura', cliente: 'Andrea S.', monto: 165, estado: 'Preparando', color: 'text-[#8E1B3A]' },
  { id: '#EM-2035', producto: 'Terrario Personalizado', cliente: 'Carlos R.', monto: 100, estado: 'Entregado', color: 'text-green-500' },
];

export default function ProveedorDashboard() {
  const user = useUser();
  const userName = user?.displayName?.split(' ')[0] ?? 'Proveedor';

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Bienvenida */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#5A0F24]">Bienvenido, {userName} 👋</h1>
        <p className="text-[#5C3A2E] mt-1">Aquí tienes el resumen de tu actividad en Emotia.</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {METRICAS.map((m, i) => (
          <div key={i} className={`${m.color} rounded-2xl p-5 shadow-sm`}>
            <m.icon className={`w-6 h-6 ${m.text} mb-3 opacity-80`} />
            <p className={`text-2xl font-extrabold ${m.text}`}>{m.valor}</p>
            <p className={`text-xs font-semibold mt-1 ${m.text} opacity-70`}>{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pedidos recientes */}
        <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl p-6 border border-[#F5E6D0] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#5A0F24]">Pedidos Recientes</h2>
            <Link href="/proveedor/pedidos" className="text-xs font-semibold text-[#8E1B3A] hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {PEDIDOS_RECIENTES.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#F5E6D0]/20 rounded-xl border border-[#F5E6D0]">
                <div>
                  <p className="font-bold text-[#5C3A2E] text-sm">{p.producto}</p>
                  <p className="text-xs text-[#B0B0B0] mt-0.5">{p.id} · {p.cliente}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[#5A0F24] text-sm">{p.monto} Bs</p>
                  <span className={`text-xs font-bold ${p.color}`}>{p.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#F5E6D0] shadow-sm">
          <h2 className="text-xl font-bold text-[#5A0F24] mb-6">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link href="/proveedor/productos" className="flex items-center gap-3 p-4 bg-[#F5E6D0]/30 rounded-xl hover:bg-[#F5E6D0] transition-colors border border-[#F5E6D0]">
              <Package className="w-5 h-5 text-[#8E1B3A]" />
              <span className="font-semibold text-sm text-[#5C3A2E]">Agregar Producto</span>
            </Link>
            <Link href="/proveedor/pedidos" className="flex items-center gap-3 p-4 bg-[#F5E6D0]/30 rounded-xl hover:bg-[#F5E6D0] transition-colors border border-[#F5E6D0]">
              <Clock className="w-5 h-5 text-[#BC9968]" />
              <span className="font-semibold text-sm text-[#5C3A2E]">Pedidos Pendientes</span>
            </Link>
            <Link href="/proveedor/perfil" className="flex items-center gap-3 p-4 bg-[#F5E6D0]/30 rounded-xl hover:bg-[#F5E6D0] transition-colors border border-[#F5E6D0]">
              <TrendingUp className="w-5 h-5 text-[#8E1B3A]" />
              <span className="font-semibold text-sm text-[#5C3A2E]">Ver mi Perfil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
