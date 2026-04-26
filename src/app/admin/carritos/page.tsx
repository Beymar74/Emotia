import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatFecha(date: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(date);
}

export default async function CarritosPage() {
  const carritos = await prisma.carrito.findMany({
    orderBy: { subtotal: "desc" },
    include: {
      usuarios:  { select: { nombre: true, apellido: true, email: true } },
      productos: { select: { nombre: true, imagen_url: true } },
    },
  });

  // KPIs
  const totalCarritos   = carritos.length;
  const valorTotal      = carritos.reduce((s, c) => s + Number(c.subtotal), 0);
  const usuariosUnicos  = new Set(carritos.map((c) => c.usuario_id)).size;

  // Producto más agregado
  const frecuencia: Record<string, { nombre: string; count: number }> = {};
  for (const c of carritos) {
    const key = String(c.producto_id);
    if (!frecuencia[key]) frecuencia[key] = { nombre: c.productos.nombre, count: 0 };
    frecuencia[key].count += c.cantidad;
  }
  const productoTop = Object.values(frecuencia).sort((a, b) => b.count - a.count)[0];

  const items = carritos.map((c) => ({
    id:              c.id,
    usuario:         `${c.usuarios.nombre} ${c.usuarios.apellido ?? ""}`.trim(),
    email:           c.usuarios.email,
    producto:        c.productos.nombre,
    cantidad:        c.cantidad,
    precio_unitario: Number(c.precio_unitario),
    subtotal:        Number(c.subtotal),
    created_at:      c.created_at.toISOString(),
    mensaje:         c.mensaje_personal,
    empaque:         c.empaque_especial,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
          Pedidos &amp; Pagos
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">
          Carritos activos
        </h1>
        <p className="text-sm text-[#7A5260] mt-1">
          Productos en carrito que aún no han sido comprados (abandono de carrito).
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#8E1B3A]" />
          <p className="font-serif text-4xl font-bold text-[#5A0F24]">{totalCarritos}</p>
          <p className="text-sm text-[#7A5260] mt-1">Ítems en carritos</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#BC9968]" />
          <p className="font-serif text-3xl font-bold text-[#5A0F24]">
            Bs {valorTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-[#7A5260] mt-1">Valor total abandonado</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5C3A2E]" />
          <p className="font-serif text-4xl font-bold text-[#5A0F24]">{usuariosUnicos}</p>
          <p className="text-sm text-[#7A5260] mt-1">Usuarios con carrito</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#AB3A50]" />
          <p className="font-serif text-lg font-bold text-[#5A0F24] leading-tight truncate">
            {productoTop?.nombre ?? "—"}
          </p>
          <p className="text-sm text-[#7A5260] mt-1">
            Producto más popular{productoTop ? ` (${productoTop.count} uds)` : ""}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-x-auto">
        <div className="px-5 py-4 border-b border-[#8E1B3A]/10">
          <h2 className="font-serif text-xl font-semibold text-[#5A0F24]">
            Detalle de carritos
          </h2>
        </div>
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr>
              {["Usuario", "Producto", "Cant.", "Precio unit.", "Subtotal", "Mensaje", "Empaque", "Agregado"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-[#2A0E18]">{item.usuario}</p>
                  <p className="text-xs text-[#7A5260]">{item.email}</p>
                </td>
                <td className="px-4 py-3 text-sm text-[#5A0F24] font-semibold max-w-[180px] truncate">
                  {item.producto}
                </td>
                <td className="px-4 py-3 text-sm text-center font-bold text-[#2A0E18]">
                  {item.cantidad}
                </td>
                <td className="px-4 py-3 text-sm text-[#7A5260]">
                  Bs {item.precio_unitario.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-[#5A0F24]">
                  Bs {item.subtotal.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-xs text-[#7A5260] max-w-[120px] truncate">
                  {item.mensaje ?? <span className="text-[#B0B0B0]">—</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  {item.empaque ? (
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-[#FFF3E0] text-[#E65100]">
                      Sí
                    </span>
                  ) : (
                    <span className="text-[#B0B0B0] text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[#7A5260]">
                  {formatFecha(new Date(item.created_at))}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-[#7A5260]">
                  No hay ítems en carritos activos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
