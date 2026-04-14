import MetricCard from "./_components/MetricCard";
import AlertStrip from "./_components/AlertStrip";
import QuickActions from "./_components/QuickActions";
import ProveedoresTable from "./_components/ProveedoresTable";
import ActividadReciente from "./_components/ActividadReciente";
import VentasCategorias from "./_components/VentasCategorias";
import SolicitudesPendientes from "./_components/SolicitudesPendientes";
import AsistenteIA from "./_components/AsistenteIA";
import LogAuditoria from "./_components/LogAuditoria";

export default function AdminPage() {
  return (
    <div className="space-y-5">

      {/* Métricas */}
      <div>
        <p className="text-[8.5px] tracking-[2.5px] uppercase text-[#7A5260] font-medium mb-3">
          Resumen — Abril 2026
        </p>
        <div className="grid grid-cols-4 gap-3">
          <MetricCard
            value="Bs 48,320"
            label="Ingresos totales"
            delta="+12.4%"
            deltaType="up"
            barFrom="#8E1B3A"
            barTo="#BC9968"
          />
          <MetricCard
            value="1,247"
            label="Pedidos completados"
            delta="+8.1%"
            deltaType="up"
            barFrom="#AB3A50"
            barTo="#BC9968"
          />
          <MetricCard
            value="384"
            label="Usuarios activos"
            delta="+5.6%"
            deltaType="up"
            barFrom="#5C3A2E"
            barTo="#BC9968"
          />
          <MetricCard
            value="42"
            label="Proveedores aprobados"
            delta="Estable"
            deltaType="neutral"
            barFrom="#BC9968"
            barTo="#F5E6D0"
          />
        </div>
      </div>

      {/* Alerta de solicitudes */}
      <AlertStrip
        message="5 proveedores esperan tu aprobación"
        sub="Revisión requerida — RF-87: Aprobación o rechazo de solicitud del proveedor"
      />

      {/* Acciones rápidas */}
      <div>
        <p className="text-[8.5px] tracking-[2.5px] uppercase text-[#7A5260] font-medium mb-3">
          Acciones rápidas del administrador
        </p>
        <QuickActions />
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-3">
        <ProveedoresTable />
        <div className="flex flex-col gap-3">
          <ActividadReciente />
          <VentasCategorias />
        </div>
      </div>

      {/* Grid inferior */}
      <div className="grid grid-cols-3 gap-3">
        <SolicitudesPendientes />
        <AsistenteIA />
        <LogAuditoria />
      </div>

    </div>
  );
}
