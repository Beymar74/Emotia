import Link from "next/link";
import prisma from "@/lib/prisma";
import ExportarPDFButton from "../_components/ExportarPDFButton";

export default async function ReporteProveedoresPage() {
  const [proveedoresDB, pedidosPorProveedor] = await Promise.all([
    prisma.proveedores.findMany({
      include: {
        _count: { select: { productos: true, detalle_pedidos: true } },
      },
      orderBy: { total_vendido: "desc" },
    }),
    prisma.detalle_pedidos.groupBy({
      by: ["proveedor_id"],
      where: { pedidos: { estado: "entregado" } },
      _sum: { subtotal: true },
      _count: { id: true },
    }),
  ]);

  const totalProveedores = proveedoresDB.length;
  const activos = proveedoresDB.filter((p) => p.estado === "aprobado").length;
  const pendientes = proveedoresDB.filter((p) => p.estado === "pendiente").length;
  const suspendidos = proveedoresDB.filter((p) => p.estado === "suspendido" || p.estado === "rechazado").length;

  const totalVendidoGlobal = proveedoresDB.reduce((acc, p) => acc + Number(p.total_vendido || 0), 0);
  const promedioVentas = activos > 0 ? totalVendidoGlobal / activos : 0;

  const fmt = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[#7A5260] mb-3">
          <Link href="/admin/reportes" className="hover:text-[#8E1B3A] transition-colors">← Reportes</Link>
          <span>/</span>
          <span className="text-[#5A0F24] font-medium">Proveedores</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reporte individual</p>
            <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Proveedores & Aliados</h1>
            <p className="text-sm text-[#7A5260] mt-0.5">Estado del ecosistema, rendimiento de ventas y composición de catálogo</p>
          </div>
          <ExportarPDFButton />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Proveedores", valor: String(totalProveedores), color: "#8E1B3A", sub: "registrados en total" },
          { label: "Activos / Aprobados", valor: String(activos), color: "#22C55E", sub: `${Math.round((activos / Math.max(totalProveedores, 1)) * 100)}% de la red` },
          { label: "Pendientes", valor: String(pendientes), color: "#F59E0B", sub: "esperando revisión" },
          { label: "Venta Promedio", valor: fmt(promedioVentas), color: "#BC9968", sub: "por proveedor activo" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
            <p className="text-xs text-[#B0B0B0] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Composición por estado */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 flex flex-col justify-center">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-6">Composición de la red</h3>
          <div className="flex items-center justify-around h-40">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-[8px] border-[#22C55E] flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-[#5A0F24]">{activos}</span>
              </div>
              <p className="text-xs font-medium text-[#7A5260] uppercase">Activos</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-[8px] border-[#F59E0B] flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-[#5A0F24]">{pendientes}</span>
              </div>
              <p className="text-xs font-medium text-[#7A5260] uppercase">Pendientes</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-[8px] border-[#EF4444] flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-[#5A0F24]">{suspendidos}</span>
              </div>
              <p className="text-xs font-medium text-[#7A5260] uppercase">Inactivos</p>
            </div>
          </div>
        </div>

        {/* Resumen de catálogo por proveedor */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Top catálogo (SKUs por proveedor)</h3>
          <div className="space-y-4">
            {proveedoresDB.slice(0, 5).map((p) => {
              const maxSKU = Math.max(...proveedoresDB.map(pr => pr._count.productos), 1);
              const pct = Math.round((p._count.productos / maxSKU) * 100);
              return (
                <div key={p.id}>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium text-[#2A0E18]">{p.nombre_negocio}</span>
                    <span className="text-[#7A5260] font-bold">{p._count.productos} productos</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#BC9968]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Directorio de rendimiento */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#8E1B3A]/10">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Rendimiento detallado de proveedores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#FAF3EC]/30">
                {["Proveedor", "Estado", "Ventas Totales", "Pedidos", "SKUs", "Calificación"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8E1B3A]/5">
              {proveedoresDB.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF3EC]/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#5A0F24]">{p.nombre_negocio}</p>
                    <p className="text-[10px] text-[#B0B0B0]">{p.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      p.estado === "aprobado" ? "bg-green-100 text-green-700" : 
                      p.estado === "pendiente" ? "bg-orange-100 text-orange-700" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-[#5A0F24]">{fmt(Number(p.total_vendido || 0))}</td>
                  <td className="px-5 py-4 text-sm text-[#7A5260]">{p._count.detalle_pedidos} ped.</td>
                  <td className="px-5 py-4 text-sm text-[#7A5260]">{p._count.productos} items</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-[#BC9968]">{Number(p.calificacion_prom || 0).toFixed(1)}</span>
                      <span className="text-[#BC9968] text-xs">★</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
