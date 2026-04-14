type Estado = "aprobado" | "pendiente" | "suspendido";

interface Proveedor {
  initials: string;
  nombre: string;
  categoria: string;
  calificacion: string;
  ventas: string;
  estado: Estado;
}

const proveedores: Proveedor[] = [
  { initials: "RT", nombre: "Rosas & Tulipanes", categoria: "Flores",       calificacion: "4.8", ventas: "Bs 6,240", estado: "aprobado"   },
  { initials: "CL", nombre: "Chocolates Luna",   categoria: "Dulces",       calificacion: "4.6", ventas: "Bs 4,890", estado: "aprobado"   },
  { initials: "AV", nombre: "Arte Vivo",          categoria: "Manualidades", calificacion: "—",   ventas: "—",        estado: "pendiente"  },
  { initials: "JR", nombre: "Joyería Real",       categoria: "Accesorios",   calificacion: "4.9", ventas: "Bs 5,870", estado: "aprobado"   },
  { initials: "SP", nombre: "Sweet Perfumes",     categoria: "Perfumería",   calificacion: "3.1", ventas: "Bs 1,200", estado: "suspendido" },
];

const estadoPill: Record<Estado, string> = {
  aprobado:   "bg-[#EEF8F0] text-[#2D7A47]",
  pendiente:  "bg-[#FDF5E6] text-[#8C5E08]",
  suspendido: "bg-[#FBF0F0] text-[#A32D2D]",
};

const estadoLabel: Record<Estado, string> = {
  aprobado:   "Aprobado",
  pendiente:  "Pendiente",
  suspendido: "Suspendido",
};

function AccionesPorEstado({ estado }: { estado: Estado }) {
  if (estado === "aprobado") {
    return (
      <div className="flex gap-2">
        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FDF5E6] text-[#8C5E08] font-medium hover:opacity-80 transition-opacity">
          Suspender
        </button>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FBF0F0] text-[#A32D2D] font-medium hover:opacity-80 transition-opacity">
          Eliminar
        </button>
      </div>
    );
  }
  if (estado === "pendiente") {
    return (
      <div className="flex gap-2">
        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#EEF8F0] text-[#2D7A47] font-medium hover:opacity-80 transition-opacity">
          Aprobar
        </button>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FBF0F0] text-[#A32D2D] font-medium hover:opacity-80 transition-opacity">
          Rechazar
        </button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <button className="text-xs px-3 py-1.5 rounded-lg bg-[#EEF8F0] text-[#2D7A47] font-medium hover:opacity-80 transition-opacity">
        Reactivar
      </button>
      <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FBF0F0] text-[#A32D2D] font-medium hover:opacity-80 transition-opacity">
        Eliminar
      </button>
    </div>
  );
}

export default function ProveedoresTable() {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">
          Proveedores registrados
        </h3>
        <button className="text-sm text-[#BC9968] hover:underline">
          Ver todos →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Negocio", "Categoría", "Cal.", "Ventas", "Estado", "Acciones"].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.nombre} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {p.initials}
                    </div>
                    <span className="text-sm text-[#2A0E18] font-medium">{p.nombre}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">{p.categoria}</td>
                <td className="px-3 py-3 text-sm text-[#2A0E18]">{p.calificacion}</td>
                <td className="px-3 py-3 text-sm text-[#2A0E18]">{p.ventas}</td>
                <td className="px-3 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${estadoPill[p.estado]}`}>
                    {estadoLabel[p.estado]}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <AccionesPorEstado estado={p.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
