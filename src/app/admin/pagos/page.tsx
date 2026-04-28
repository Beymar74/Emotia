import prisma from "@/lib/prisma";

const metodos = [
  { id: 1, nombre: "Tarjeta de crédito",  descripcion: "Visa, Mastercard, American Express", activo: true,  icono: "💳" },
  { id: 2, nombre: "Tarjeta de débito",   descripcion: "Visa Débito, Maestro",                activo: true,  icono: "🏦" },
  { id: 3, nombre: "Transferencia QR",    descripcion: "Pago QR mediante billetera digital",  activo: true,  icono: "📱" },
  { id: 4, nombre: "Efectivo",            descripcion: "Pago contra entrega",                 activo: false, icono: "💵" },
];

export default async function PagosPage() {
  // --- 1. CONSULTA A LA BASE DE DATOS ---
  // Traemos los últimos pedidos que tengan un método de pago registrado
  const pedidosBD = await prisma.pedidos.findMany({
    where: { 
      metodo_pago: { not: null } // Solo nos interesan los que ya tienen método de pago
    },
    orderBy: { created_at: 'desc' },
    take: 10, // Limitamos a las últimas 10 transacciones
    include: {
      usuarios: { select: { nombre: true, apellido: true } }
    }
  });

  // --- 2. FUNCIONES AUXILIARES ---
  const formatFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha);
  };

  // --- 3. MAPEO DE TRANSACCIONES ---
  type Transaccion = {
    id: string;
    pedido: string;
    usuario: string;
    monto: string;
    metodo: string;
    fecha: string;
    estado: "aprobado" | "fallido";
  };

  const transacciones: Transaccion[] = pedidosBD.map((p: any) => {
    const isFallido = p.estado === 'cancelado';
    const nombreUsuario = `${p.usuarios?.nombre || ""} ${p.usuarios?.apellido || ""}`.trim();
    
    // Asignamos un ID de transacción basado en la referencia o generamos uno si no existe
    const txnId = p.referencia_pago ? p.referencia_pago.slice(0, 10).toUpperCase() : `TXN-00${p.id}`;

    return {
      id: txnId,
      pedido: `#${p.id.toString().padStart(4, '0')}`,
      usuario: nombreUsuario || "Usuario desconocido",
      monto: `Bs ${Number(p.total).toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
      metodo: p.metodo_pago,
      fecha: formatFecha(p.created_at),
      estado: isFallido ? "fallido" : "aprobado",
    };
  });

  const pagosFallidosCount = transacciones.filter(t => t.estado === "fallido").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Pedidos & Pagos</p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Métodos de pago</h1>
      </div>

      {/* Métodos de pago (Configuración estática/global) */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Configuración de métodos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metodos.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF3EC] flex items-center justify-center text-2xl flex-shrink-0">
                  {m.icono}
                </div>
                <div>
                  <p className="text-base font-semibold text-[#2A0E18]">{m.nombre}</p>
                  <p className="text-sm text-[#7A5260] mt-0.5">{m.descripcion}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${m.activo ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"}`}>
                  {m.activo ? "Activo" : "Inactivo"}
                </span>
                <button className={`text-sm px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-80 ${m.activo ? "bg-[#FDF5E6] text-[#8C5E08]" : "bg-[#EEF8F0] text-[#2D7A47]"}`}>
                  {m.activo ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transacciones recientes (Datos de BD) */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Transacciones recientes</h3>
          {pagosFallidosCount > 0 && (
            <span className="text-xs bg-[#FBF0F0] text-[#A32D2D] px-3 py-1 rounded-full font-medium">
              {pagosFallidosCount} {pagosFallidosCount === 1 ? "pago fallido" : "pagos fallidos"}
            </span>
          )}
        </div>
        
        {transacciones.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-6">No hay transacciones registradas.</p>
        ) : (
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                {["Referencia", "Pedido", "Usuario", "Monto", "Método", "Fecha", "Estado", "Acción"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transacciones.map((t) => (
                <tr key={t.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                  <td className="px-3 py-3 text-xs font-mono text-[#7A5260]">{t.id}</td>
                  <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{t.pedido}</td>
                  <td className="px-3 py-3 text-sm text-[#2A0E18]">{t.usuario}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{t.monto}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260] capitalize">{t.metodo}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{t.fecha}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${t.estado === "aprobado" ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"}`}>
                      {t.estado === "aprobado" ? "Aprobado" : "Fallido"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {t.estado === "fallido" ? (
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] font-medium hover:opacity-80">
                        Resolver
                      </button>
                    ) : (
                      <span className="text-sm text-[#B0B0B0]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}