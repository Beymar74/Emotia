import Link from "next/link";

interface SolicitudItem {
  label: string;
  valor: number;
  urgente: boolean;
  href: string;
}

interface SolicitudesPendientesProps {
  proveedoresPendientes: number;
  productosInactivos: number;
  pedidosCancelados: number;
  pagosFallidos: number;
}

export default function SolicitudesPendientes({
  proveedoresPendientes,
  productosInactivos,
  pedidosCancelados,
  pagosFallidos,
}: SolicitudesPendientesProps) {
  const solicitudes: SolicitudItem[] = [
    { label: "Proveedores pendientes de aprobación", valor: proveedoresPendientes, urgente: true,  href: "/admin/empresas/actividad" },
    { label: "Productos inactivos",                  valor: productosInactivos,    urgente: true,  href: "/admin/productos" },
    { label: "Pedidos cancelados",                   valor: pedidosCancelados,     urgente: false, href: "/admin/pedidos" },
    { label: "Pagos fallidos",                       valor: pagosFallidos,         urgente: false, href: "/admin/pagos" },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
        Solicitudes pendientes
      </h3>
      <div className="divide-y divide-[#8E1B3A]/6">
        {solicitudes.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0 hover:bg-[#FAF3EC]/50 -mx-2 px-2 rounded-lg transition-colors"
          >
            <span className="text-sm text-[#7A5260]">{s.label}</span>
            <span className={`text-sm font-semibold ${s.urgente && s.valor > 0 ? "text-[#8C5E08]" : "text-[#5A0F24]"}`}>
              {s.urgente && s.valor > 0 ? `${s.valor} ⚑` : s.valor}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
