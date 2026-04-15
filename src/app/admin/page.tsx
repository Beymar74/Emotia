import prisma from "@/lib/prisma";
import MetricCard from "./_components/MetricCard";
import QuickActions from "./_components/QuickActions";
import ProveedoresTable from "./_components/ProveedoresTable";
import ActividadReciente from "./_components/ActividadReciente";
import VentasCategorias from "./_components/VentasCategorias";
import SolicitudesPendientes from "./_components/SolicitudesPendientes";
import AsistenteIA from "./_components/AsistenteIA";
import LogAuditoria from "./_components/LogAuditoria";

export default async function AdminPage() {
  // --- CONSULTAS A LA BASE DE DATOS ---

  // 1. Ingresos totales (Sumamos el total de los pedidos con estado 'entregado')
  const ingresosResult = await prisma.pedidos.aggregate({
    _sum: { total: true },
    where: { estado: 'entregado' }
  });
  const ingresosTotales = ingresosResult._sum.total || 0;

  // 2. Pedidos completados
  const pedidosCompletados = await prisma.pedidos.count({
    where: { estado: 'entregado' }
  });

  // 3. Usuarios activos
  const usuariosActivos = await prisma.usuarios.count({
    where: {
      activo: true,
      tipo: 'usuario' // Filtramos para no contar a los administradores
    }
  });

  // 4. Proveedores aprobados
  const proveedoresAprobados = await prisma.proveedores.count({
    where: { estado: 'aprobado' }
  });

  // 5. Últimos proveedores registrados (para la tabla)
  const ultimosProveedores = await prisma.proveedores.findMany({
    take: 5,
    orderBy: { created_at: 'desc' },
  });

  // --- FUNCIONES AUXILIARES ---
  const formatBs = (monto: number) => `Bs ${monto.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  const formatNum = (num: number) => num.toLocaleString('en-US');

  return (
    <div className="space-y-5">

      {/* Métricas */}
      <div>
        <p className="text-[8.5px] tracking-[2.5px] uppercase text-[#7A5260] font-medium mb-3">
          Resumen — Abril 2026
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <MetricCard
            value={formatBs(Number(ingresosTotales))}
            label="Ingresos totales"
            delta="+12.4%" 
            deltaType="up"
            barFrom="#8E1B3A"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(pedidosCompletados)}
            label="Pedidos completados"
            delta="+8.1%"
            deltaType="up"
            barFrom="#AB3A50"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(usuariosActivos)}
            label="Usuarios activos"
            delta="+5.6%"
            deltaType="up"
            barFrom="#5C3A2E"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(proveedoresAprobados)}
            label="Proveedores aprobados"
            delta="Estable"
            deltaType="neutral"
            barFrom="#BC9968"
            barTo="#F5E6D0"
          />
        </div>
      </div>

      {/* Acciones rápidas */}
      <div>
        <p className="text-[8.5px] tracking-[2.5px] uppercase text-[#7A5260] font-medium mb-3">
          Acciones rápidas del administrador
        </p>
        <QuickActions />
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-3">
        {/* Aquí pasamos los datos reales al componente */}
        <ProveedoresTable data={ultimosProveedores} />
        
        <div className="flex flex-col gap-3">
          <ActividadReciente />
          <VentasCategorias />
        </div>
      </div>

      {/* Grid inferior */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <SolicitudesPendientes />
        <AsistenteIA />
        <LogAuditoria />
      </div>

    </div>
  );
}