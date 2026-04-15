import prisma from "@/lib/prisma";

export default async function DestacadosPage() {
  // --- 1. CONSULTA A LA BASE DE DATOS ---
  // Traemos los productos activos con sus relaciones
  const productosDB = await prisma.productos.findMany({
    where: { activo: true },
    include: {
      proveedores: { select: { nombre_negocio: true } },
      categorias: { select: { nombre: true } }
    }
  });

  // --- 2. MAPEO Y SIMULACIÓN DE MÉTRICAS ---
  type ProductoMapeado = {
    id: number;
    nombre: string;
    proveedor: string;
    categoria: string;
    precio: string;
    calificacion: string;
    ventas: number;
    modo: string;
  };

  const productosMapeados: ProductoMapeado[] = productosDB.map((p: any) => {
    // Simulamos ventas y calificación basados en el ID para mantener la UI consistente
    // En el futuro, esto se calcularía haciendo un JOIN con detalle_pedidos
    const ventasSimuladas = 30 + ((p.id * 17) % 120); 
    const calificacionSimulada = (4.0 + (p.id % 10) * 0.1).toFixed(1);

    return {
      id: p.id,
      nombre: p.nombre,
      proveedor: p.proveedores?.nombre_negocio || "Desconocido",
      categoria: p.categorias?.nombre || "Sin categoría",
      precio: `Bs ${Number(p.precio_venta).toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
      calificacion: calificacionSimulada,
      ventas: ventasSimuladas,
      modo: p.id % 3 === 0 ? "automatico" : "manual", // 1 de cada 3 simulado como automático
    };
  });

  // Ordenamos todos los productos por las ventas de mayor a menor
  const productosOrdenados = productosMapeados.sort((a, b) => b.ventas - a.ventas);

  // Separamos los 3 primeros como "Destacados" y los siguientes como "Candidatos"
  const destacados = productosOrdenados.slice(0, 3);
  const candidatos = productosOrdenados.slice(3, 10); // Mostramos hasta 7 candidatos

  const MAX_DESTACADOS = 6;
  const espaciosDisponibles = MAX_DESTACADOS - destacados.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Catálogo</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Productos destacados</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-[#7A5260]">Modo actual:</span>
          <span className="bg-[#BC9968]/15 text-[#5C3A2E] text-xs px-3 py-1.5 rounded-full font-medium">Manual</span>
          <button className="text-sm bg-[#8E1B3A] text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity">
            Cambiar a automático
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Productos destacados",  valor: String(destacados.length), color: "#8E1B3A" },
          { label: "Máximo permitido",      valor: String(MAX_DESTACADOS),    color: "#BC9968" },
          { label: "Espacios disponibles",  valor: String(espaciosDisponibles), color: "#2D7A47" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Destacados actuales */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
          Destacados actuales
          <span className="ml-2 text-sm font-normal text-[#7A5260]">({destacados.length}/{MAX_DESTACADOS})</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destacados.map((p: ProductoMapeado) => (
            <div key={p.id} className="border border-[#BC9968]/30 bg-[#FAF3EC] rounded-xl p-4 relative">
              <div className="absolute top-3 right-3">
                <span className="text-xs bg-[#BC9968]/20 text-[#5C3A2E] px-2 py-1 rounded-full font-medium">
                  {p.modo === "manual" ? "⭐ Manual" : "🤖 Auto"}
                </span>
              </div>
              <p className="text-base font-semibold text-[#2A0E18] mb-1 pr-16 truncate">{p.nombre}</p>
              <p className="text-sm text-[#7A5260] mb-3 truncate">{p.proveedor}</p>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="font-bold text-[#5A0F24]">{p.precio}</span>
                <span className="text-[#7A5260]">⭐ {p.calificacion}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#7A5260] mb-3">
                <span>{p.categoria}</span>
                <span>{p.ventas} ventas</span>
              </div>
              <button className="w-full text-xs border border-[#A32D2D]/30 text-[#A32D2D] py-1.5 rounded-lg font-medium hover:bg-[#FBF0F0] transition-colors">
                Quitar de destacados
              </button>
            </div>
          ))}

          {/* Slots vacíos */}
          {Array.from({ length: espaciosDisponibles }).map((_, i) => (
            <div key={`empty-${i}`} className="border-2 border-dashed border-[#8E1B3A]/15 rounded-xl p-4 flex flex-col items-center justify-center text-center min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-[#8E1B3A]/8 flex items-center justify-center mb-2">
                <span className="text-[#8E1B3A] text-lg font-light">+</span>
              </div>
              <p className="text-sm text-[#B0B0B0]">Slot disponible</p>
            </div>
          ))}
        </div>
      </div>

      {/* Candidatos a destacar */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-1">Productos candidatos</h3>
        <p className="text-sm text-[#7A5260] mb-4">Ordenados por calificación y volumen de ventas</p>
        
        {candidatos.length === 0 ? (
           <p className="text-sm text-[#7A5260] text-center py-6">No hay suficientes productos en el catálogo para mostrar candidatos.</p>
        ) : (
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr>
                {["Producto", "Proveedor", "Categoría", "Precio", "Cal.", "Ventas", "Acción"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidatos.map((p: ProductoMapeado) => (
                <tr key={p.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                  <td className="px-3 py-3 text-sm font-medium text-[#2A0E18]">{p.nombre}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{p.proveedor}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{p.categoria}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{p.precio}</td>
                  <td className="px-3 py-3 text-sm text-[#2A0E18]">⭐ {p.calificacion}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{p.ventas}</td>
                  <td className="px-3 py-3">
                    <button className="text-xs px-4 py-1.5 rounded-lg bg-[#BC9968]/15 text-[#5C3A2E] font-medium hover:opacity-80">
                      ⭐ Destacar
                    </button>
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