import prisma from "@/lib/prisma";
import ExportarPDFButton from "./_components/ExportarPDFButton";

export default async function ReportesPage() {
  // --- 1. CONSULTAS A LA BASE DE DATOS ---
  // A. Obtenemos pedidos completados
  const pedidosCompletados = await prisma.pedidos.findMany({

    where: { estado: 'entregado' }, // Solo contamos ventas reales finalizadas
    select: { id: true, total: true, created_at: true }
  });

  // B. Obtenemos el top de proveedores
  const proveedoresDB = await prisma.proveedores.findMany({
    where: { estado: 'aprobado' },
    orderBy: { total_vendido: 'desc' },
    take: 4, // Top 4 como en tu diseño
    include: {
      _count: { select: { detalle_pedidos: true } } // Contamos cuántos items han vendido
    }
  });

  // C. Proveedores activos
  const provActivosCount = await prisma.proveedores.count({ where: { estado: 'aprobado' } });

  // D. Detalles de pedidos para agrupar por categoría
  const detallesDB = await prisma.detalle_pedidos.findMany({
    where: { pedidos: { estado: 'entregado' } }, // Solo detalles de pedidos completados
    include: {
      productos: {
        include: { categorias: true }
      }
    }
  });


  // --- 2. CÁLCULO DE MÉTRICAS GLOBALES ---
  const totalIngresosNum = pedidosCompletados.reduce((sum: number, p: any) => sum + Number(p.total), 0);
  const totalPedidosNum = pedidosCompletados.length;
  const ticketPromedioNum = totalPedidosNum > 0 ? (totalIngresosNum / totalPedidosNum) : 0;

  const formatBs = (monto: number) => `Bs ${monto.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;


  // --- 3. PROCESAMIENTO: VENTAS POR PROVEEDOR ---
  type VentaProveedor = { proveedor: string; pedidos: number; monto: string; porcentaje: number };
  
  const ventasPorProveedor: VentaProveedor[] = proveedoresDB.map((p: any) => {
    const ventas = Number(p.total_vendido || 0);
    const porcentaje = totalIngresosNum > 0 ? Math.round((ventas / totalIngresosNum) * 100) : 0;
    return {
      proveedor: p.nombre_negocio,
      pedidos: p._count.detalle_pedidos,
      monto: formatBs(ventas),
      porcentaje: porcentaje > 100 ? 100 : porcentaje // Seguridad visual
    };
  });


  // --- 4. PROCESAMIENTO: VENTAS POR SEMANA (Agrupación dinámica) ---
  type VentaSemana = { periodo: string; pedidos: number; montoStr: string; montoNum: number };
  
  // Inicializamos las 4 semanas
  const semanasData = [
    { periodo: "Semana 1 Abril", pedidos: 0, montoNum: 0 },
    { periodo: "Semana 2 Abril", pedidos: 0, montoNum: 0 },
    { periodo: "Semana 3 Abril", pedidos: 0, montoNum: 0 },
    { periodo: "Semana 4 Abril", pedidos: 0, montoNum: 0 },
  ];

  // Agrupamos los pedidos según el día del mes
  pedidosCompletados.forEach((p: any) => {
    const dia = p.created_at.getDate();
    let index = 0; // Semana 1 (1-7)
    if (dia >= 8 && dia <= 14) index = 1; // Semana 2
    else if (dia >= 15 && dia <= 21) index = 2; // Semana 3
    else if (dia >= 22) index = 3; // Semana 4

    semanasData[index].pedidos += 1;
    semanasData[index].montoNum += Number(p.total);
  });

  const ventasPorPeriodo: VentaSemana[] = semanasData.map(s => ({
    periodo: s.periodo,
    pedidos: s.pedidos,
    montoNum: s.montoNum,
    montoStr: formatBs(s.montoNum)
  }));


  // --- 5. PROCESAMIENTO: VENTAS POR CATEGORÍA ---
  type CategoriaMap = Record<string, { monto: number; pedidos: number }>;
  const categoriasMap: CategoriaMap = {};

  detallesDB.forEach((det: any) => {
    const nombreCat = det.productos?.categorias?.nombre || "Otros";
    const subtotal = Number(det.subtotal || 0);
    const cantidad = Number(det.cantidad || 0);

    if (!categoriasMap[nombreCat]) {
      categoriasMap[nombreCat] = { monto: 0, pedidos: 0 };
    }
    categoriasMap[nombreCat].monto += subtotal;
    categoriasMap[nombreCat].pedidos += cantidad;
  });

  type VentaCategoria = { nombre: string; monto: string; pedidos: number; pct: number; montoRaw: number };
  
  const ventasPorCategoria: VentaCategoria[] = Object.keys(categoriasMap)
    .map(cat => {
      const data = categoriasMap[cat];
      const pct = totalIngresosNum > 0 ? Math.round((data.monto / totalIngresosNum) * 100) : 0;
      return {
        nombre: cat,
        montoRaw: data.monto,
        monto: formatBs(data.monto),
        pedidos: data.pedidos,
        pct: pct
      };
    })
    .sort((a, b) => b.montoRaw - a.montoRaw) // Ordenamos de mayor a menor venta
    .slice(0, 5); // Tomamos el Top 5 categorías


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes & Sistema</p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Reportes de ventas</h1>
        </div>
        <div className="flex gap-3">
          <select className="text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none text-[#7A5260] bg-white">
            <option>Abril 2026</option>
            <option>Marzo 2026</option>
            <option>Febrero 2026</option>
          </select>
          <ExportarPDFButton />

        </div>
      </div>

      {/* Métricas del periodo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Ingresos totales",     valor: formatBs(totalIngresosNum), color: "#8E1B3A" },
          { label: "Total pedidos",        valor: String(totalPedidosNum),    color: "#BC9968" },
          { label: "Ticket promedio",      valor: formatBs(ticketPromedioNum), color: "#5C3A2E" },
          { label: "Proveedores activos",  valor: String(provActivosCount),   color: "#AB3A50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ventas por proveedor */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Ventas por proveedor (Top 4)</h3>
          
          {ventasPorProveedor.length === 0 ? (
             <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de proveedores.</p>
          ) : (
            <div className="space-y-4">
              {ventasPorProveedor.map((v: VentaProveedor) => (
                <div key={v.proveedor}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-[#2A0E18]">{v.proveedor}</span>
                    <div className="flex gap-4 text-[#7A5260]">
                      <span>{v.pedidos} items</span>
                      <span className="font-semibold text-[#5A0F24]">{v.monto}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${v.porcentaje}%`, background: "linear-gradient(90deg,#8E1B3A,#BC9968)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ventas por semana */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Evolución semanal</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Período", "Pedidos", "Monto"].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ventasPorPeriodo.map((v: VentaSemana, i: number) => (
                  <tr key={i} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                    <td className="px-3 py-3 text-sm text-[#2A0E18]">{v.periodo}</td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{v.pedidos}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{v.montoStr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ventas por categoría */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Desglose por categoría</h3>
        
        {ventasPorCategoria.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Aún no hay ventas categorizadas.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ventasPorCategoria.map((c: VentaCategoria) => (
              <div key={c.nombre} className="bg-[#FAF3EC] rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-[#5A0F24] mb-1 truncate" title={c.nombre}>{c.nombre}</p>
                <p className="font-serif text-2xl font-bold text-[#8E1B3A]">{c.pct}%</p>
                <p className="text-xs text-[#7A5260] mt-1">{c.monto}</p>
                <p className="text-xs text-[#B0B0B0]">{c.pedidos} items</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}