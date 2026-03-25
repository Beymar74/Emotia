"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Send } from 'lucide-react';
import { useUser } from '@stackframe/stack';

export default function AIAssistantHero() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();
  const user = useUser();

  // Toma el primer nombre del displayName o email
  const displayName = user?.displayName
    ? user.displayName.split(' ')[0]
    : user?.primaryEmail?.split('@')[0] ?? 'amigo';

  const handleSearch = () => {
    if (prompt.trim()) {
      router.push(`/dashboard/advisor?q=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <section className="text-center mb-16 max-w-3xl mx-auto pt-8">
      <div className="inline-flex items-center gap-2 bg-[#F5E6D0] text-[#8E1B3A] px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-pulse border border-[#BC9968]/30">
        <Sparkles className="w-4 h-4" /> Tu Asesor IA está listo
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-[#5A0F24] mb-4 tracking-tight">
        Hola, {displayName}. <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8E1B3A] to-[#BC9968]">
          ¿A quién vamos a sorprender hoy?
        </span>
      </h1>
      <p className="text-lg text-[#5C3A2E] mb-10 opacity-80">
        Cuéntame la ocasión o el presupuesto. Yo me encargo del resto.
      </p>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8E1B3A] to-[#F5E6D0] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative bg-[#FFFFFF] flex items-center p-2 rounded-full shadow-lg border border-[#F5E6D0] focus-within:ring-4 focus-within:ring-[#F5E6D0] transition-all">
          <div className="pl-4"><Search className="w-6 h-6 text-[#AB3A50]" /></div>
          <input
            type="text"
            className="w-full bg-transparent border-none py-4 px-4 text-lg text-[#000000] placeholder-[#B0B0B0] focus:outline-none"
            placeholder="Ej: Aniversario de mis papás, presupuesto 200 Bs..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="bg-[#8E1B3A] hover:bg-[#5A0F24] text-[#FFFFFF] px-6 py-4 rounded-full font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <span className="hidden sm:inline">Asesorarme</span><Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
