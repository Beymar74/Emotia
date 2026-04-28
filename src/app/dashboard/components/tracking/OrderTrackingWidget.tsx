"use client";
import { Clock, ChevronRight } from 'lucide-react';

export default function OrderTrackingWidget({ onOpenTracking }: { onOpenTracking: () => void }) {
  return (
    <div className="bg-[#FFFFFF] rounded-3xl p-6 shadow-md border border-[#F5E6D0] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#5C3A2E] text-lg">En Tránsito</h3>
          <div className="bg-[#F5E6D0] text-[#8E1B3A] p-2 rounded-lg"><Clock className="w-5 h-5" /></div>
        </div>
        <div className="space-y-4">
          <div className="border-l-2 border-[#BC9968] pl-4 relative">
            <div className="absolute w-3 h-3 bg-[#BC9968] rounded-full -left-[7px] top-1"></div>
            <p className="font-semibold text-[#000000] text-sm">Caja Sorpresa Spa</p>
            <p className="text-xs text-[#B0B0B0]">Para: María (Mamá)</p>
            <span className="inline-block mt-2 text-xs font-bold text-[#FFFFFF] bg-[#AB3A50] px-2 py-1 rounded-md">El repartidor está en camino</span>
          </div>
        </div>
      </div>
      <button onClick={onOpenTracking} className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#8E1B3A] hover:text-[#5A0F24] transition-colors bg-[#F5E6D0]/30 py-2 rounded-lg hover:bg-[#F5E6D0]">
        Rastrear pedido <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
