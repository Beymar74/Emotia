"use client";
import { useState, useEffect } from 'react';
import { Star, Gift, ShoppingBag, Trophy, Crown, TrendingUp, Loader2 } from 'lucide-react';

const HISTORY_MOCK = [
  { id: 1, tipo: 'ganado', descripcion: 'Compra: Cena Romántica 2 pax', puntos: +33, fecha: '12 Mar 2026', icon: ShoppingBag },
  { id: 2, tipo: 'ganado', descripcion: 'Compra: Kit Café de Altura', puntos: +15, fecha: '10 Mar 2026', icon: ShoppingBag },
  { id: 3, tipo: 'usado', descripcion: 'Descuento aplicado en pedido', puntos: -50, fecha: '08 Mar 2026', icon: Gift },
  { id: 4, tipo: 'ganado', descripcion: 'Bono bienvenida Emotia', puntos: +100, fecha: '01 Mar 2026', icon: Trophy },
  { id: 5, tipo: 'ganado', descripcion: 'Compra: Caja Dulces Premium', puntos: +12, fecha: '28 Feb 2026', icon: ShoppingBag },
];

const NIVELES = [
  { nombre: 'Bronce', min: 0, max: 200, color: 'text-amber-600', bg: 'bg-amber-100' },
  { nombre: 'Plata', min: 200, max: 400, color: 'text-gray-500', bg: 'bg-gray-100' },
  { nombre: 'Oro', min: 400, max: 700, color: 'text-[#BC9968]', bg: 'bg-[#F5E6D0]' },
  { nombre: 'Platino', min: 700, max: 1000, color: 'text-blue-500', bg: 'bg-blue-50' },
  { nombre: 'Diamante', min: 1000, max: 9999, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const RECOMPENSAS = [
  { titulo: 'Envío Gratis', puntos: 100, icon: '🚚', disponible: true },
  { titulo: 'Descuento 50 Bs', puntos: 500, icon: '🎟️', disponible: false },
  { titulo: 'Empaque Premium', puntos: 200, icon: '🎁', disponible: true },
  { titulo: 'Mes VIP Gratis', puntos: 800, icon: '👑', disponible: false },
];

export default function PointsPage() {
  const [totalPuntos, setTotalPuntos] = useState(0);
  const [historial, setHistorial] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPuntos = async () => {
      try {
        // AQUI IRÁ EL FETCH REAL DE BEYMAR:
        // const res = await fetch('/api/usuario/puntos');
        // const data = await res.json();
        // setTotalPuntos(data.saldoTotal);
        // setHistorial(data.historial);

        setTimeout(() => {
          setTotalPuntos(450); // El valor real vendrá de la BDD
          setHistorial(HISTORY_MOCK);
          setCargando(false);
        }, 1000);
      } catch (error) {
        console.error("Error cargando puntos:", error);
        setCargando(false);
      }
    };

    cargarPuntos();
  }, []);

  if (cargando) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-[#8E1B3A]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-semibold">Buscando tus recompensas...</p>
      </main>
    );
  }

  // Calculamos los niveles SOLO después de que ya cargó
  const nivelActual = NIVELES.find(n => totalPuntos >= n.min && totalPuntos < n.max) ?? NIVELES[0];
  const nivelSiguiente = NIVELES[NIVELES.indexOf(nivelActual) + 1];
  const progreso = nivelSiguiente
    ? ((totalPuntos - nivelActual.min) / (nivelSiguiente.min - nivelActual.min)) * 100
    : 100;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#5A0F24] mb-2 flex items-center gap-3">
          <Star className="w-8 h-8 text-[#BC9968] fill-[#BC9968]" /> Mis Puntos Emotia
        </h1>
        <p className="text-[#5C3A2E]">Acumula puntos en cada compra y canjéalos por recompensas exclusivas.</p>
      </div>

      <div className="bg-gradient-to-br from-[#8E1B3A] to-[#5A0F24] rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#AB3A50] rounded-full mix-blend-multiply filter blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[#F5E6D0]/70 text-sm font-semibold uppercase tracking-wider mb-1">Saldo actual</p>
              <p className="text-6xl font-extrabold text-white">{totalPuntos}</p>
              <p className="text-[#BC9968] font-bold mt-1">Puntos Emotia</p>
            </div>
            <div className={`${nivelActual.bg} px-4 py-2 rounded-full flex items-center gap-2`}>
              <Crown className={`w-5 h-5 ${nivelActual.color}`} />
              <span className={`font-extrabold text-sm ${nivelActual.color}`}>Nivel {nivelActual.nombre}</span>
            </div>
          </div>

          {nivelSiguiente && (
            <div>
              <div className="flex justify-between text-xs text-[#F5E6D0]/70 mb-2">
                <span>{nivelActual.nombre}</span>
                <span>{nivelSiguiente.min - totalPuntos} pts para {nivelSiguiente.nombre}</span>
              </div>
              <div className="w-full h-3 bg-[#FFFFFF]/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#BC9968] rounded-full transition-all duration-1000" style={{ width: `${progreso}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-[#5A0F24] mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#BC9968]" /> Canjear Puntos
          </h2>
          <div className="space-y-3">
            {RECOMPENSAS.map((r, i) => (
              <div key={i} className={`bg-[#FFFFFF] rounded-2xl p-4 border flex items-center justify-between shadow-sm ${r.disponible && totalPuntos >= r.puntos ? 'border-[#BC9968]/40 hover:shadow-md' : 'border-[#F5E6D0] opacity-60'} transition-shadow`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <p className="font-bold text-[#5C3A2E] text-sm">{r.titulo}</p>
                    <p className="text-xs text-[#BC9968] font-semibold">{r.puntos} pts</p>
                  </div>
                </div>
                <button disabled={!r.disponible || totalPuntos < r.puntos}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${r.disponible && totalPuntos >= r.puntos ? 'bg-[#8E1B3A] text-white hover:bg-[#5A0F24]' : 'bg-[#F5E6D0] text-[#B0B0B0] cursor-not-allowed'}`}>
                  {totalPuntos >= r.puntos ? 'Canjear' : `Faltan ${r.puntos - totalPuntos}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#5A0F24] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#BC9968]" /> Historial
          </h2>
          <div className="space-y-3">
            {historial.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.id} className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#F5E6D0] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${h.tipo === 'ganado' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <Icon className={`w-4 h-4 ${h.tipo === 'ganado' ? 'text-green-600' : 'text-red-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#5C3A2E] leading-tight">{h.descripcion}</p>
                      <p className="text-xs text-[#B0B0B0]">{h.fecha}</p>
                    </div>
                  </div>
                  <span className={`font-extrabold text-sm ${h.tipo === 'ganado' ? 'text-green-600' : 'text-red-400'}`}>
                    {h.puntos > 0 ? '+' : ''}{h.puntos}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}