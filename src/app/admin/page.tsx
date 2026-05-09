export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import MetricCard from "./_components/MetricCard";
import QuickActions from "./_components/QuickActions";
import ProveedoresTable from "./_components/ProveedoresTable";
import VentasCategorias from "./_components/VentasCategorias";
import SolicitudesPendientes from "./_components/SolicitudesPendientes";
import DashboardFilter from "./_components/DashboardFilter";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // --- LÓGICA DE FILTRO DE FECHA ---
  const rango = typeof searchParams.rango === "string" ? searchParams.rango : "historico";
  let dateFilter = {};
  
  if (rango !== "historico") {
    const now = new Date();
    let startDate = new Date();
    if (rango === "hoy") {
      startDate.setHours(0, 0, 0, 0);
    } else if (rango === "7dias") {
      startDate.setDate(now.getDate() - 7);
    } else if (rango === "30dias") {
      startDate.setDate(now.getDate() - 30);
    } else if (rango === "este_mes") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    dateFilter = { created_at: { gte: startDate } };
  }

  // --- CONSULTAS A LA BASE DE DATOS ---

  // 1. Ingresos totales (Pedidos con estado 'entregado')
  const ingresosResult = await prisma.pedidos.aggregate({
    _sum: { total: true },
    where: { estado: 'entregado', ...dateFilter }
  });
  const ingresosTotales = ingresosResult._sum.total || 0;

  // 2. Pedidos completados
  const pedidosCompletados = await prisma.pedidos.count({
    where: { estado: 'entregado', ...dateFilter }
  });

  // 3. Usuarios activos (Excluyendo administradores)
  const usuariosActivos = await prisma.usuarios.count({
    where: {
      activo: true,
      tipo: 'usuario',
      ...dateFilter
    }
  });

  // 4. Proveedores aprobados
  const proveedoresAprobados = await prisma.proveedores.count({
    where: { estado: 'aprobado', ...dateFilter }
  });

  // 5. Últimos proveedores registrados
  const ultimosProveedores = await prisma.proveedores.findMany({
    take: 5,
    orderBy: { created_at: 'desc' },
  });

  // --- FUNCIONES AUXILIARES ---
  const formatBs = (monto: number) => `Bs ${monto.toLocaleString('es-BO', { minimumFractionDigits: 0 })}`;
  const formatNum = (num: number) => num.toLocaleString('es-BO');

  return (
    <div className="space-y-6 p-4">

      {/* Sección de Métricas */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
          <div>
            <h2 className="text-[9px] tracking-[2.5px] uppercase text-[#7A5260] font-bold opacity-80">
              Resumen — {new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric", timeZone: "America/La_Paz" }).format(new Date())}
            </h2>
            <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
              Aquí puedes ver un resumen global de las métricas clave de Emotia, incluyendo ingresos, pedidos completados, usuarios activos y el rendimiento general de las empresas.
            </p>
          </div>
          <DashboardFilter />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            value={formatBs(Number(ingresosTotales))}
            label="Ingresos Totales"
            delta="+12.4%"
            deltaType="up"
            barFrom="#8E1B3A"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(pedidosCompletados)}
            label="Pedidos Completados"
            delta="+8.1%"
            deltaType="up"
            barFrom="#AB3A50"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(usuariosActivos)}
            label="Usuarios Activos"
            delta="+5.6%"
            deltaType="up"
            barFrom="#5C3A2E"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(proveedoresAprobados)}
            label="Empresas Aprobadas"
            delta="Estable"
            deltaType="neutral"
            barFrom="#BC9968"
            barTo="#F5E6D0"
          />
        </div>
      </section>

      {/* Acciones Rápidas */}
      <section>
        <h2 className="text-[9px] tracking-[2.5px] uppercase text-[#7A5260] font-bold mb-4 opacity-80">
          Acciones rápidas de administración
        </h2>
        <QuickActions />
      </section>

      {/* Grid Principal: Tabla y Actividad */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">
        <ProveedoresTable data={ultimosProveedores} />

        <div className="flex flex-col gap-4">
          <VentasCategorias />
        </div>
      </div>

      {/* Grid Inferior: Herramientas y Auditoría */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SolicitudesPendientes />
      </div>

    </div>
  );
}