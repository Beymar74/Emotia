"use client";
import { useRouter } from 'next/navigation';
import { CalendarHeart, Sparkles } from 'lucide-react';

export default function SpecialDateCard() {
  const router = useRouter();
  return (
    <div className="md:col-span-2 bg-gradient-to-br from-[#8E1B3A] to-[#5A0F24] rounded-3xl p-8 text-[#FFFFFF] relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#AB3A50] rounded-full mix-blend-multiply filter blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-[#F5E6D0] mb-4 font-medium tracking-wide text-sm uppercase">
          <CalendarHeart className="w-5 h-5" /> Próxima fecha especial
        </div>
        <h2 className="text-3xl font-bold mb-2">Aniversario de tus papás</h2>
        <p className="text-[#F5E6D0]/90 text-lg mb-8 max-w-md">Faltan 12 días. He preparado sugerencias únicas para esta ocasión.</p>
        <button
          onClick={() => router.push('/dashboard/advisor?q=Sugerencias para el aniversario de mis papás')}
          className="bg-[#F5E6D0] text-[#5A0F24] px-6 py-3 rounded-xl font-bold hover:bg-[#FFFFFF] flex items-center gap-2 transition-transform hover:-translate-y-1 shadow-md">
          <Sparkles className="w-5 h-5 text-[#8E1B3A]" /> Ver sugerencias de la IA
        </button>
      </div>
    </div>
  );
}
