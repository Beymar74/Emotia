import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CalificacionesPage() {
  const detalles = await prisma.detalle_pedidos.findMany({
    where: {
      OR: [
        { calificacion: { not: null } },
        { resena: { not: null } },
      ],
    },
    orderBy: { created_at: "desc" },
    take: 200,
    include: {
      productos: { select: { nombre: true, imagen_url: true } },
      proveedores: { select: { nombre_negocio: true } },
      pedidos: {
        select: {
          usuarios: { select: { nombre: true, apellido: true } },
          created_at: true,
        },
      },
    },
  });

  const total = detalles.length;
  const conresena = detalles.filter((d) => d.resena && d.resena.trim() !== "").length;
  const promedio =
    total > 0
      ? detalles.reduce((acc, d) => acc + (d.calificacion ?? 0), 0) / total
      : 0;

  const distribucion = [5, 4, 3, 2, 1].map((estrellas) => ({
    estrellas,
    cantidad: detalles.filter((d) => d.calificacion === estrellas).length,
  }));

  const formatFecha = (fecha: Date) =>
    new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/La_Paz",
    }).format(fecha);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
          Calidad & Feedback
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">
          Calificaciones y reseñas
        </h1>
        <p className="text-sm text-[#7A5260] mt-1">
          reseñas y valoraciones de clientes sobre los productos adquiridos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total reseñas", valor: total, color: "#8E1B3A" },
          { label: "Promedio general", valor: promedio.toFixed(1) + " ★", color: "#BC9968" },
          { label: "Con comentario", valor: conresena, color: "#5A0F24" },
          { label: "Sin comentario", valor: total - conresena, color: "#7A5260" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: s.color }}
            />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución por estrellas */}
        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 p-6">
          <h2 className="font-serif text-lg font-bold text-[#5A0F24] mb-4">
            Distribución
          </h2>
          <div className="space-y-3">
            {distribucion.map(({ estrellas, cantidad }) => {
              const pct = total > 0 ? (cantidad / total) * 100 : 0;
              return (
                <div key={estrellas} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#7A5260] w-6 text-right">
                    {estrellas}★
                  </span>
                  <div className="flex-1 bg-[#F1EFE8] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#BC9968] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#7A5260] w-6">{cantidad}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#8E1B3A]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 flex justify-between items-center">
            <h2 className="font-serif text-lg font-bold text-[#5A0F24]">
              Últimas reseñas
            </h2>
            <span className="bg-[#8E1B3A]/10 text-[#8E1B3A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
              {total} en total
            </span>
          </div>

          {total === 0 ? (
            <div className="px-6 py-12 text-center text-[#7A5260] text-sm italic">
              Aún no hay calificaciones registradas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#FDFBF9]/30">
                    {["Producto", "Cliente", "Calificación", "resena", "Fecha"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-[10px] tracking-[2px] uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/5"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8E1B3A]/5">
                  {detalles.map((d) => {
                    const cliente = d.pedidos.usuarios;
                    const nombreCliente = `${cliente.nombre} ${cliente.apellido ?? ""}`.trim();
                    return (
                      <tr key={d.id} className="hover:bg-[#FDFBF9] transition-colors">
                        <td className="px-5 py-3">
                          <p className="text-sm font-semibold text-[#2A0E18] max-w-[140px] truncate">
                            {d.productos.nombre}
                          </p>
                          <p className="text-[10px] text-[#7A5260] truncate max-w-[140px]">
                            {d.proveedores.nombre_negocio}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-sm text-[#2A0E18] max-w-[110px] truncate">
                            {nombreCliente}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          {d.calificacion !== null ? (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold text-[#5A0F24]">
                                {d.calificacion}
                              </span>
                              <span className="text-[#BC9968] text-sm">★</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#B0B0B0] italic">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 max-w-[200px]">
                          {d.resena ? (
                            <p className="text-xs text-[#5A0F24] line-clamp-2">{d.resena}</p>
                          ) : (
                            <span className="text-xs text-[#B0B0B0] italic">Sin comentario</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-[#7A5260]">
                            {formatFecha(d.created_at)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
