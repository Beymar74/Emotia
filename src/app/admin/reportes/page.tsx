import Link from "next/link";
import prisma from "@/lib/prisma";
import ExportarPDFButton from "./_components/ExportarPDFButton";
import { 
  DollarSign, 
  Package, 
  Users, 
  Store, 
  Star, 
  Gem, 
  Handshake 
} from "lucide-react";

export default async function ReportesPage() {
  const [
    pedidosStats,
    todosPedidosCount,
    provActivosCount,
    usuariosCount,
    stockBajoCount,
    recomTotal,
    recomConvertidas,
    puntosStats,
    proveedoresGrupo,
    calificacionStats,
    reseñasCount,
    insigniasCount,
  ] = await Promise.all([
    prisma.pedidos.aggregate({
      where: { estado: "entregado" },
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.pedidos.count(),
    prisma.proveedores.count({ where: { estado: "aprobado" } }),
    prisma.usuarios.count(),
    prisma.productos.count({ where: { activo: true, stock: { lte: 10 } } }),
    prisma.recomendaciones.count(),
    prisma.recomendaciones.count({ where: { convertida_en_compra: true } }),
    prisma.pedidos.aggregate({ _sum: { puntos_ganados: true } }),
    prisma.proveedores.groupBy({ by: ["estado"], _count: { id: true } }),
    prisma.proveedores.aggregate({
      where: { estado: "aprobado", calificacion_prom: { gt: 0 } },
      _avg: { calificacion_prom: true },
    }),
    prisma.detalle_pedidos.count({ where: { calificacion: { not: null } } }),
    prisma.insignias.count(),
  ]);

  const totalIngresos   = Number(pedidosStats._sum.total ?? 0);
  const pedidosEntregados = pedidosStats._count.id;
  const tasaConvIA      = recomTotal > 0 ? Math.round((recomConvertidas / recomTotal) * 100) : 0;
  const puntosGanados   = Number(puntosStats._sum.puntos_ganados ?? 0);
  const califProm       = Number(calificacionStats._avg.calificacion_prom ?? 0);
  const provPendientes  = proveedoresGrupo.find((p: any) => p.estado === "pendiente")?._count.id ?? 0;
  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;

  const reportes = [
    {
      href: "/admin/reportes/ventas",
      titulo: "Ventas",
      icono: <DollarSign className="w-6 h-6 text-[#8E1B3A]" />,
      color: "#8E1B3A",
      descripcion: "Ingresos por proveedor, evolución mensual y desglose por categoría.",
      stats: [
        { label: "Ingresos totales",    valor: formatBs(totalIngresos) },
        { label: "Pedidos entregados",  valor: String(pedidosEntregados) },
      ],
    },
    {
      href: "/admin/reportes/pedidos",
      titulo: "Pedidos",
      icono: <Package className="w-6 h-6 text-[#5C3A2E]" />,
      color: "#5C3A2E",
      descripcion: "Estado de pedidos, productos más vendidos y análisis de personalización.",
      stats: [
        { label: "Total pedidos",  valor: String(todosPedidosCount) },
        { label: "Entregados",     valor: String(pedidosEntregados) },
      ],
    },
    {
      href: "/admin/reportes/clientes",
      titulo: "Clientes",
      icono: <Users className="w-6 h-6 text-[#AB3A50]" />,
      color: "#AB3A50",
      descripcion: "Clientes frecuentes, crecimiento de usuarios, planes y métodos de pago.",
      stats: [
        { label: "Usuarios registrados", valor: String(usuariosCount) },
        { label: "Conversión IA",        valor: `${tasaConvIA}%` },
      ],
    },
    {
      href: "/admin/reportes/productos",
      titulo: "Productos & Inventario",
      icono: <Store className="w-6 h-6 text-[#2E5C3A]" />,
      color: "#2E5C3A",
      descripcion: "Stock crítico, top productos, ventas por ocasión y género destinatario.",
      stats: [
        { label: "Stock bajo / agotado",   valor: `${stockBajoCount} productos` },
        { label: "Proveedores activos",    valor: String(provActivosCount) },
      ],
    },
    {
      href: "/admin/reportes/calidad",
      titulo: "Calidad",
      icono: <Star className="w-6 h-6 text-[#5C5C2E]" />,
      color: "#5C5C2E",
      descripcion: "Calificaciones de proveedores y distribución de reseñas de productos.",
      stats: [
        { label: "Calificación promedio", valor: califProm > 0 ? `${califProm.toFixed(1)} / 5` : "Sin datos" },
        { label: "Reseñas registradas",   valor: String(reseñasCount) },
      ],
    },
    {
      href: "/admin/reportes/fidelizacion",
      titulo: "Fidelización",
      icono: <Gem className="w-6 h-6 text-[#3A2E5C]" />,
      color: "#3A2E5C",
      descripcion: "Sistema de puntos, insignias y tasa de conversión de la IA Emotia.",
      stats: [
        { label: "Puntos ganados",  valor: puntosGanados.toLocaleString() },
        { label: "Insignias dadas", valor: String(insigniasCount) },
      ],
    },
    {
      href: "/admin/reportes/proveedores",
      titulo: "Proveedores",
      icono: <Handshake className="w-6 h-6 text-[#2E3A5C]" />,
      color: "#2E3A5C",
      descripcion: "Estado, rendimiento y composición del ecosistema de proveedores.",
      stats: [
        { label: "Aprobados",            valor: String(provActivosCount) },
        { label: "Pendientes de revisión", valor: String(provPendientes) },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes & Sistema</p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Centro de reportes</h1>
          <p className="text-sm text-[#7A5260] mt-0.5">
            Vista global del negocio — selecciona un reporte para ver el detalle completo
          </p>
        </div>
        <ExportarPDFButton />
      </div>

      {/* Resumen ejecutivo */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Ingresos totales",    valor: formatBs(totalIngresos),      color: "#8E1B3A", sub: `${pedidosEntregados} pedidos entregados` },
          { label: "Total pedidos",       valor: String(todosPedidosCount),     color: "#BC9968", sub: "en toda la plataforma" },
          { label: "Usuarios",            valor: String(usuariosCount),         color: "#5C3A2E", sub: `${provActivosCount} proveedores activos` },
          { label: "Conversión IA",       valor: `${tasaConvIA}%`,              color: "#AB3A50", sub: `${recomConvertidas} de ${recomTotal} recomendaciones` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
            <p className="text-xs text-[#B0B0B0] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tarjetas de navegación */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium mb-4">Reportes individuales</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reportes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 hover:border-[#8E1B3A]/30 hover:shadow-md transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: r.color }} />
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-[#FAF3EC]">
                  {r.icono}
                </div>
                <svg className="w-4 h-4 text-[#BC9968] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-1">{r.titulo}</h3>
              <p className="text-xs text-[#7A5260] mb-3 leading-relaxed flex-1">{r.descripcion}</p>
              <div className="space-y-1.5 pt-3 border-t border-[#8E1B3A]/8">
                {r.stats.map((s) => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-xs text-[#7A5260]">{s.label}</span>
                    <span className="text-xs font-bold text-[#5A0F24]">{s.valor}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs font-medium text-[#BC9968] group-hover:text-[#8E1B3A] transition-colors">
                Ver reporte completo →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
