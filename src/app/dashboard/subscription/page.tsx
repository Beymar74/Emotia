"use client";
import { Crown, Sparkles, Star, Check } from 'lucide-react';

export default function SubscriptionPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-[#F5E6D0] rounded-full mb-6 shadow-sm">
          <Crown className="w-8 h-8 text-[#BC9968]" />
        </div>
        <h1 className="text-4xl font-extrabold text-[#5A0F24] mb-4">Emotia <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BC9968] to-[#8E1B3A]">VIP</span></h1>
        <p className="text-lg text-[#5C3A2E]">Lleva tus experiencias de regalo a otro nivel con beneficios exclusivos, asesoría prioritaria y envíos gratuitos garantizados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-[#FFFFFF] border border-[#F5E6D0] rounded-3xl p-8 flex flex-col shadow-sm">
          <h3 className="text-xl font-bold text-[#5C3A2E] mb-2">Plan Esencial</h3>
          <p className="text-4xl font-extrabold text-[#5A0F24] mb-6">Gratis</p>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-start gap-3 text-[#5C3A2E]"><Check className="w-5 h-5 text-[#B0B0B0] shrink-0" /> Asesoría IA estándar</li>
            <li className="flex items-start gap-3 text-[#5C3A2E]"><Check className="w-5 h-5 text-[#B0B0B0] shrink-0" /> Personalización básica</li>
            <li className="flex items-start gap-3 text-[#5C3A2E]"><Check className="w-5 h-5 text-[#B0B0B0] shrink-0" /> Seguimiento de pedidos</li>
          </ul>
          <button className="w-full py-4 rounded-xl font-bold border-2 border-[#F5E6D0] text-[#5C3A2E] bg-gray-50 cursor-default">Plan Actual</button>
        </div>

        <div className="bg-gradient-to-br from-[#8E1B3A] to-[#5A0F24] rounded-3xl p-8 flex flex-col shadow-xl relative overflow-hidden md:-translate-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#AB3A50] rounded-full mix-blend-multiply filter blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-4 right-6 bg-[#BC9968] text-[#FFFFFF] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">Recomendado</div>
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-xl font-bold text-[#F5E6D0] mb-2 flex items-center gap-2">Emotia VIP <Sparkles className="w-4 h-4 text-[#BC9968]" /></h3>
            <p className="text-4xl font-extrabold text-[#FFFFFF] mb-2">49 Bs <span className="text-lg font-medium text-[#F5E6D0]/80">/ mes</span></p>
            <p className="text-[#F5E6D0]/80 text-sm mb-6">O paga 490 Bs al año (Ahorra 2 meses)</p>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-[#FFFFFF]"><Star className="w-5 h-5 text-[#BC9968] shrink-0 fill-[#BC9968]" /> Envíos gratis en todos tus pedidos</li>
              <li className="flex items-start gap-3 text-[#FFFFFF]"><Star className="w-5 h-5 text-[#BC9968] shrink-0 fill-[#BC9968]" /> Asesoría IA Avanzada (Agendas)</li>
              <li className="flex items-start gap-3 text-[#FFFFFF]"><Star className="w-5 h-5 text-[#BC9968] shrink-0 fill-[#BC9968]" /> Empaques Premium exclusivos gratis</li>
              <li className="flex items-start gap-3 text-[#FFFFFF]"><Star className="w-5 h-5 text-[#BC9968] shrink-0 fill-[#BC9968]" /> Gana el doble de Emotia Points</li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold bg-[#BC9968] text-[#5A0F24] hover:bg-[#F5E6D0] transition-colors shadow-lg">Actualizar a VIP</button>
          </div>
        </div>
      </div>
    </main>
  );
}
