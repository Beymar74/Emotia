"use client";
import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, User, ArrowRight } from 'lucide-react';
import TrackingModal from '../components/modals/TrackingModal';

const MOCK_ORDERS = [
  { id: '#EM-2041', title: 'Caja Sorpresa Spa Botánico', recipient: 'María (Mamá)', date: '12 Mar 2026', status: 'En Tránsito', Icon: Truck, color: 'bg-[#BC9968]', textColor: 'text-[#BC9968]', progress: 2 },
  { id: '#EM-2038', title: 'Kit Café de Altura Local', recipient: 'Carlos (Amigo)', date: '10 Mar 2026', status: 'Preparando', Icon: Package, color: 'bg-[#8E1B3A]', textColor: 'text-[#8E1B3A]', progress: 1 },
  { id: '#EM-1990', title: 'Arreglo Floral y Chocolates', recipient: 'Andrea (Novia)', date: '28 Feb 2026', status: 'Entregado', Icon: CheckCircle, color: 'bg-[#E5E7EB]', textColor: 'text-[#B0B0B0]', progress: 3 },
];

export default function OrdersPage() {
  const [trackingOrder, setTrackingOrder] = useState<any>(null);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#5A0F24] mb-2">Mis Pedidos</h1>
        <p className="text-[#5C3A2E]">Revisa el historial y estado de todos tus regalos enviados.</p>
      </div>
      <div className="space-y-6">
        {MOCK_ORDERS.map((order, i) => (
          <div key={i} className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#F5E6D0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className={`p-4 rounded-xl text-[#FFFFFF] ${order.color} shadow-sm`}>
                <order.Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#5C3A2E] text-lg">{order.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-semibold text-[#8E1B3A]">{order.id}</span>
                  <span className="text-sm text-[#B0B0B0] flex items-center gap-1"><User className="w-3 h-3" /> {order.recipient}</span>
                  <span className="text-sm text-[#B0B0B0] items-center gap-1 hidden sm:flex"><Clock className="w-3 h-3" /> {order.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full md:w-auto gap-4 border-t border-[#F5E6D0] md:border-t-0 pt-4 md:pt-0">
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold border border-current ${order.textColor}`}>{order.status}</div>
              <button onClick={() => setTrackingOrder(order)} className="text-[#AB3A50] font-semibold text-sm hover:underline flex items-center gap-1">
                Ver Detalles <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {trackingOrder && <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}
    </main>
  );
}
