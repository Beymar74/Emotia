"use client";
import { X, Package, Truck, CheckCircle } from 'lucide-react';

type TrackingOrder = {
  id: string;
  title: string;
  recipient: string;
  progress?: number;
};

export default function TrackingModal({ order, onClose }: { order: TrackingOrder | null, onClose: () => void }) {
  if (!order) return null;
  const progress = order.progress ?? 2;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5A0F24]/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-8 animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#5A0F24]">Rastreo de Pedido</h2>
          <button onClick={onClose} className="p-2 bg-[#F5E6D0] rounded-full text-[#8E1B3A] hover:bg-[#BC9968] hover:text-[#FFFFFF] transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-[#F5E6D0]/30 rounded-xl p-4 mb-6 sm:mb-8 border border-[#F5E6D0]">
          <p className="text-sm text-[#B0B0B0] font-medium">Pedido {order.id}</p>
          <p className="font-bold text-[#5C3A2E]">{order.title}</p>
          <p className="text-xs text-[#8E1B3A] font-semibold mt-1">Para: {order.recipient}</p>
        </div>

        <div className="space-y-6 sm:space-y-8 relative">
          {/* Línea de fondo */}
          <div className="absolute top-5 left-5 w-0.5 h-[calc(100%-2.5rem)] bg-[#F5E6D0]"></div>
          {/* Línea de progreso */}
          <div
            className="absolute top-5 left-5 w-0.5 bg-gradient-to-b from-[#8E1B3A] to-[#BC9968] transition-all duration-1000"
            style={{ height: progress === 1 ? '0%' : progress === 2 ? '50%' : '100%' }}
          ></div>

          {/* Paso 1 */}
          <div className="relative flex items-center gap-4 sm:gap-6">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FFFFFF] ${progress >= 1 ? 'bg-[#8E1B3A] text-[#FFFFFF]' : 'bg-[#E5E7EB] text-[#9CA3AF]'} shadow shrink-0 z-10 transition-colors duration-500`}>
              <Package className="w-5 h-5" />
            </div>
            <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#F5E6D0] shadow-sm flex-1">
              <div className={`font-bold ${progress >= 1 ? 'text-[#5A0F24]' : 'text-[#B0B0B0]'}`}>Preparando Regalo</div>
              {progress >= 1 && <div className="text-xs text-[#B0B0B0]">Personalizando y empacando</div>}
            </div>
          </div>

          {/* Paso 2 */}
          <div className="relative flex items-center gap-4 sm:gap-6">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FFFFFF] ${progress >= 2 ? 'bg-[#BC9968] text-[#FFFFFF]' : 'bg-[#E5E7EB] text-[#9CA3AF]'} shadow shrink-0 z-10 transition-colors duration-500`}>
              <Truck className={`w-5 h-5 ${progress === 2 ? 'animate-pulse' : ''}`} />
            </div>
            <div className={`p-4 rounded-xl shadow-sm flex-1 ${progress === 2 ? 'bg-[#F5E6D0]/50 border border-[#BC9968]/50' : 'bg-[#FFFFFF] border border-[#F5E6D0]'}`}>
              <div className={`font-bold ${progress >= 2 ? 'text-[#8E1B3A]' : 'text-[#B0B0B0]'}`}>En Tránsito</div>
              {progress === 2 && <div className="text-xs text-[#5C3A2E] font-medium mt-1">El repartidor está en camino.</div>}
            </div>
          </div>

          {/* Paso 3 */}
          <div className="relative flex items-center gap-4 sm:gap-6">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FFFFFF] ${progress === 3 ? 'bg-[#10B981] text-[#FFFFFF]' : 'bg-[#E5E7EB] text-[#9CA3AF]'} shadow shrink-0 z-10 transition-colors duration-500`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="p-4 flex-1">
              <div className={`font-bold ${progress === 3 ? 'text-[#10B981]' : 'text-[#B0B0B0]'}`}>Entregado</div>
              {progress === 3 && <div className="text-xs text-[#B0B0B0]">El paquete llegó a su destino</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
