"use client";
import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock, Download, Loader2 } from 'lucide-react';

const PAGOS_MOCK = [
  { id: 'PAY-8821', pedido: '#EM-2041', descripcion: 'Caja Sorpresa Spa Botánico', monto: 175, fecha: '12 Mar 2026', metodo: 'QR Tigo Money', estado: 'Completado', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  { id: 'PAY-8820', pedido: '#EM-2038', descripcion: 'Kit Café de Altura Local', monto: 165, fecha: '10 Mar 2026', metodo: 'Tarjeta Visa', estado: 'Completado', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  { id: 'PAY-8791', pedido: '#EM-1990', descripcion: 'Arreglo Floral y Chocolates', monto: 220, fecha: '28 Feb 2026', metodo: 'QR Tigo Money', estado: 'Completado', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  { id: 'PAY-8750', pedido: '#EM-1944', descripcion: 'Terrario Personalizado', monto: 100, fecha: '14 Feb 2026', metodo: 'Transferencia', estado: 'Pendiente', color: 'text-amber-500', bg: 'bg-amber-50', icon: Clock },
];

export default function PaymentsPage() {
  const [misPagos, setMisPagos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPagos = async () => {
      try {
        // AQUI IRÁ EL FETCH REAL DE BEYMAR:
        // const res = await fetch('/api/usuario/pagos');
        // const data = await res.json();
        // setMisPagos(data);

        setTimeout(() => {
          setMisPagos(PAGOS_MOCK);
          setCargando(false);
        }, 1000);
      } catch (error) {
        console.error("Error cargando pagos:", error);
        setCargando(false);
      }
    };

    cargarPagos();
  }, []);

  // Calculamos el total usando el estado real
  const totalGastado = misPagos.filter(p => p.estado === 'Completado').reduce((a, b) => a + b.monto, 0);

  if (cargando) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-[#8E1B3A]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-semibold">Calculando tus finanzas...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#5A0F24] mb-2 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-[#BC9968]" /> Historial de Pagos
        </h1>
        <p className="text-[#5C3A2E]">Revisa todos tus pagos y descarga comprobantes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-gradient-to-br from-[#8E1B3A] to-[#5A0F24] rounded-2xl p-5 text-white shadow-lg">
          <p className="text-[#F5E6D0]/70 text-xs font-bold uppercase tracking-wider mb-1">Total Gastado</p>
          <p className="text-3xl font-extrabold">{totalGastado} Bs</p>
        </div>
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#F5E6D0] shadow-sm">
          <p className="text-[#B0B0B0] text-xs font-bold uppercase tracking-wider mb-1">Pagos Exitosos</p>
          <p className="text-3xl font-extrabold text-green-600">{misPagos.filter(p => p.estado === 'Completado').length}</p>
        </div>
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#F5E6D0] shadow-sm">
          <p className="text-[#B0B0B0] text-xs font-bold uppercase tracking-wider mb-1">Pendientes</p>
          <p className="text-3xl font-extrabold text-amber-500">{misPagos.filter(p => p.estado === 'Pendiente').length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {misPagos.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#F5E6D0] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${p.bg}`}>
                    <Icon className={`w-6 h-6 ${p.color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-[#5C3A2E]">{p.descripcion}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs font-bold text-[#8E1B3A]">{p.id}</span>
                      <span className="text-xs text-[#B0B0B0]">{p.pedido}</span>
                      <span className="text-xs text-[#B0B0B0]">{p.fecha}</span>
                      <span className="text-xs bg-[#F5E6D0] text-[#5C3A2E] px-2 py-0.5 rounded-full font-medium">{p.metodo}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="font-extrabold text-[#5A0F24] text-lg">{p.monto} Bs</p>
                    <span className={`text-xs font-bold ${p.color}`}>{p.estado}</span>
                  </div>
                  <button className="p-2 text-[#B0B0B0] hover:text-[#8E1B3A] hover:bg-[#F5E6D0] rounded-full transition-colors" title="Descargar comprobante">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}