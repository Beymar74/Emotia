import type { ReactNode } from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { revalidatePath } from "next/cache"; // <-- IMPORTANTE PARA QUE SE ACTUALICE AL DAR CLIC
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Package,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Globe,
  ExternalLink,
  User,
  Wallet, // <-- NUEVO ICONO
  Landmark // <-- NUEVO ICONO
} from "lucide-react";
import Breadcrumbs from "../../../_components/Breadcrumbs";

export default async function DetalleActividadEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empresaId = parseInt(id);
  if (isNaN(empresaId)) notFound();

  // 👇 ACTUALIZAMOS LAS CONSULTAS PARA INCLUIR EL ESTADO "LIQUIDADO" Y CALCULAR EL DINERO 👇
  const [
    empresa,
    pedidosCompletados,
    pedidosCancelados,
    pedidosEnProceso,
    productosActivos,
    topProductos,
    ventasPorLiquidarAgg,
    ventasLiquidadasAgg,
  ] = await Promise.all([
    prisma.proveedores.findUnique({
      where: { id: empresaId },
      include: { _count: { select: { productos: true, detalle_pedidos: true } } },
    }),
    prisma.detalle_pedidos.count({
      // Sumamos tanto entregados como liquidados para que la métrica de éxito no baje
      where: { proveedor_id: empresaId, pedidos: { estado: { in: ["entregado", "liquidado"] } } },
    }),
    prisma.detalle_pedidos.count({
      where: { proveedor_id: empresaId, pedidos: { estado: "cancelado" } },
    }),
    prisma.detalle_pedidos.count({
      where: {
        proveedor_id: empresaId,
        pedidos: { estado: { notIn: ["entregado", "liquidado", "cancelado"] } },
      },
    }),
    prisma.productos.count({ where: { proveedor_id: empresaId, activo: true } }),
    prisma.productos.findMany({
      where: { proveedor_id: empresaId },
      orderBy: { updated_at: "desc" },
      take: 6,
      select: {
        id: true,
        nombre: true,
        precio_venta: true,
        stock: true,
        activo: true,
        imagen_url: true,
      },
    }),
    prisma.detalle_pedidos.aggregate({
      _sum: { subtotal: true },
      where: { proveedor_id: empresaId, pedidos: { estado: "entregado" } }, // Plata que le debemos
    }),
    prisma.detalle_pedidos.aggregate({
      _sum: { subtotal: true },
      where: { proveedor_id: empresaId, pedidos: { estado: "liquidado" } }, // Plata que ya le pagamos
    }),
  ]);

  if (!empresa) notFound();

  // --- MATEMÁTICA FINANCIERA (COMISIÓN 8.5%) ---
  const brutoPorLiquidar = Number(ventasPorLiquidarAgg._sum.subtotal || 0);
  const brutoLiquidado = Number(ventasLiquidadasAgg._sum.subtotal || 0);

  const netoPorLiquidar = brutoPorLiquidar * 0.915; // Lo que le debemos transferir
  const netoLiquidado = brutoLiquidado * 0.915;     // Lo que ya le hemos transferido históricamente

  // 👇 SERVER ACTION PARA EL BOTÓN DE PAGO 👇
  async function liquidarSaldos() {
    "use server";
    
    // 1. Buscamos todos los pedidos de este proveedor que estén "entregados"
    const pedidosAfectados = await prisma.detalle_pedidos.findMany({
      where: { proveedor_id: empresaId, pedidos: { estado: "entregado" } },
      select: { pedido_id: true }
    });
    
    const ids = pedidosAfectados.map(d => d.pedido_id);

    // 2. Si hay pedidos, los pasamos a "liquidado"
    if (ids.length > 0) {
      await prisma.pedidos.updateMany({
        where: { id: { in: ids } },
        data: { estado: "liquidado" }
      });
    }

    // 3. Recargamos la página mágicamente
    revalidatePath(`/admin/empresas/actividad/${empresaId}`);
    revalidatePath(`/admin/empresas/actividad`); // Para la vista general también
  }

  const formatFecha = (fecha: Date) =>
    new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(fecha);

  const initials = empresa.nombre_negocio
    ? empresa.nombre_negocio
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "EM";

  const totalPedidos = pedidosCompletados + pedidosCancelados;
  const tasaExito = totalPedidos > 0 ? Math.round((pedidosCompletados / totalPedidos) * 100) : null;
  const tasaColor =
    tasaExito === null
      ? "#7A5260"
      : tasaExito >= 80
      ? "#2D7A47"
      : tasaExito >= 60
      ? "#BC9968"
      : "#A32D2D";

  const redes = empresa.redes_sociales as Record<string, string> | null;
  const isActivo = empresa.estado === "aprobado";

  const estadoBadge: Record<string, string> = {
    aprobado: "bg-[#EEF8F0] text-[#2D7A47] border-[#2D7A47]/25",
    suspendido: "bg-[#FBF0F0] text-[#A32D2D] border-[#A32D2D]/25",
    pendiente: "bg-[#FDF5E6] text-[#8C5E08] border-[#8C5E08]/25",
    rechazado: "bg-[#FBF0F0] text-[#A32D2D] border-[#A32D2D]/25",
  };

  const totalVendido = empresa.total_vendido ? Number(empresa.total_vendido) : 0;
  const totalVendidoStr =
    totalVendido >= 1000000
      ? `Bs. ${(totalVendido / 1000000).toFixed(1)}M`
      : totalVendido >= 1000
      ? `Bs. ${(totalVendido / 1000).toFixed(1)}k`
      : `Bs. ${totalVendido.toFixed(2)}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumbs
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Actividad", href: "/admin/empresas/actividad" },
          { label: empresa.nombre_negocio },
        ]}
      />

      {/* ── Hero ── */}
      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        <div
          className="h-2"
          style={{
            background: isActivo
              ? "linear-gradient(90deg,#2D7A47,#4CAF72)"
              : "linear-gradient(90deg,#A32D2D,#C94444)",
          }}
        />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {empresa.logo_url ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden relative border-2 border-[#8E1B3A]/10 shadow-md">
                  <Image
                    src={empresa.logo_url}
                    alt={empresa.nombre_negocio}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-md">
                  {initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A0E18]">
                  {empresa.nombre_negocio}
                </h1>
                <span
                  className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                    estadoBadge[empresa.estado] ?? "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {empresa.estado}
                </span>
              </div>

              <p className="text-sm text-[#7A5260] mb-3">{empresa.email}</p>

              {empresa.categorias.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {empresa.categorias.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#FAF3EC] text-[#BC9968] border border-[#BC9968]/20"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {empresa.descripcion && (
                <p className="text-sm text-[#5A3048] italic leading-relaxed line-clamp-2 max-w-xl">
                  &ldquo;{empresa.descripcion}&rdquo;
                </p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex sm:flex-col gap-2 flex-shrink-0">
              <Link
                href="/admin/empresas/actividad"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#8E1B3A]/15 text-[#7A5260] text-sm hover:bg-[#FDFBF9] transition-all"
              >
                <ArrowLeft size={15} />
                <span className="hidden sm:inline">Volver</span>
              </Link>
              <Link
                href={`/admin/empresas/${empresa.id}/editar`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8E1B3A] text-white text-sm font-semibold hover:bg-[#6D1429] transition-all"
              >
                <Edit size={15} />
                <span>Editar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            icon: <Star size={17} fill="currentColor" />,
            label: "Calificación",
            valor: empresa.calificacion_prom
              ? `${Number(empresa.calificacion_prom).toFixed(1)} / 5`
              : "Sin reseñas",
            sub: "promedio de clientes",
            color: "#BC9968",
            bg: "#FDF8F1",
          },
          {
            icon: <TrendingUp size={17} />,
            label: "Total facturado",
            valor: totalVendidoStr,
            sub: "ingresos brutos acumulados",
            color: "#2D7A47",
            bg: "#F0FAF3",
          },
          {
            icon: <Package size={17} />,
            label: "Productos activos",
            valor: String(productosActivos),
            sub: `${empresa._count.productos} en catálogo total`,
            color: "#8E1B3A",
            bg: "#FDF5F7",
          },
          {
            icon: <CheckCircle size={17} />,
            label: "Ítems procesados",
            valor: String(pedidosCompletados),
            sub: `de ${totalPedidos} registrados`,
            color: "#185FA5",
            bg: "#EBF3FB",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border p-4 sm:p-5 relative overflow-hidden"
            style={{ background: k.bg, borderColor: `${k.color}25` }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: k.color }}
            />
            <div className="flex items-center gap-1.5 mb-2" style={{ color: k.color }}>
              {k.icon}
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A5260]">
                {k.label}
              </span>
            </div>
            <p className="font-serif text-xl sm:text-2xl font-bold" style={{ color: k.color }}>
              {k.valor}
            </p>
            <p className="text-[9px] text-[#7A5260] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Cuerpo principal ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Columna izquierda */}
        <div className="space-y-5">
          {/* Contacto del negocio */}
          <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-5 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7A5260] border-b border-[#8E1B3A]/8 pb-2">
              Contacto del Negocio
            </h3>
            <InfoFila icon={<Mail size={14} className="text-[#8E1B3A]" />} label="Email" value={empresa.email} />
            <InfoFila
              icon={<Phone size={14} className="text-[#8E1B3A]" />}
              label="Teléfono"
              value={empresa.telefono ?? "No registrado"}
            />
            <InfoFila
              icon={<MapPin size={14} className="text-[#8E1B3A]" />}
              label="Dirección"
              value={empresa.direccion ?? "No registrada"}
            />
            <InfoFila
              icon={<Calendar size={14} className="text-[#8E1B3A]" />}
              label="Miembro desde"
              value={formatFecha(empresa.created_at)}
            />
            <InfoFila
              icon={<Clock size={14} className="text-[#8E1B3A]" />}
              label="Última actividad"
              value={formatFecha(empresa.updated_at)}
            />

            {redes && Object.keys(redes).length > 0 && (
              <div>
                <p className="text-[9px] text-[#7A5260] uppercase font-bold mb-2">Redes sociales</p>
                <div className="flex flex-wrap gap-2">
                  {redes.instagram && (
                    <RedSocial href={redes.instagram} icon={<ExternalLink size={12} />} label="Instagram" />
                  )}
                  {redes.facebook && (
                    <RedSocial href={redes.facebook} icon={<ExternalLink size={12} />} label="Facebook" />
                  )}
                  {redes.tiktok && (
                    <RedSocial href={redes.tiktok} icon={<ExternalLink size={12} />} label="TikTok" />
                  )}
                  {redes.website && (
                    <RedSocial href={redes.website} icon={<Globe size={12} />} label="Sitio web" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Representante */}
          {(empresa.rep_nombre || empresa.rep_email || empresa.rep_telefono) && (
            <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7A5260] border-b border-[#8E1B3A]/8 pb-2">
                Representante Legal
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF3EC] flex items-center justify-center flex-shrink-0">
                  <User size={17} className="text-[#8E1B3A]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2A0E18] text-sm">
                    {empresa.rep_nombre ?? "—"}
                  </p>
                  {empresa.rep_anio_nacimiento && (
                    <p className="text-[10px] text-[#7A5260]">
                      Nacido en {empresa.rep_anio_nacimiento}
                    </p>
                  )}
                </div>
              </div>
              {empresa.rep_email && (
                <InfoFila
                  icon={<Mail size={14} className="text-[#BC9968]" />}
                  label="Email"
                  value={empresa.rep_email}
                />
              )}
              {empresa.rep_telefono && (
                <InfoFila
                  icon={<Phone size={14} className="text-[#BC9968]" />}
                  label="Teléfono"
                  value={empresa.rep_telefono}
                />
              )}
            </div>
          )}
        </div>

        {/* Columna derecha (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* 👇 NUEVO PANEL: FINANZAS Y LIQUIDACIÓN 👇 */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500 opacity-5 rounded-bl-full" />
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-lg font-bold text-emerald-900 flex items-center gap-2">
                <Landmark size={20} /> Finanzas y Liquidación
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Saldo a favor (Por Liquidar)</p>
                <p className="text-3xl font-black text-emerald-700">Bs. {netoPorLiquidar.toFixed(2)}</p>
                <p className="text-[10px] text-gray-400 mt-1">Libre de la comisión del 8.5%</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-emerald-100/50">
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Histórico Pagado</p>
                <p className="text-xl font-bold text-gray-700">Bs. {netoLiquidado.toFixed(2)}</p>
                <p className="text-[10px] text-gray-400 mt-1">Fondos ya transferidos a la cuenta</p>
              </div>
            </div>

            {netoPorLiquidar > 0 ? (
              <form action={liquidarSaldos}>
                <button type="submit" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2">
                  <Wallet size={16} /> Marcar como Pagado (Liquidar Saldo)
                </button>
                <p className="text-[10px] text-emerald-700 mt-2 opacity-80">
                  * Haz clic aquí solo después de haber realizado la transferencia en tu portal bancario.
                </p>
              </form>
            ) : (
              <div className="bg-emerald-100/50 text-emerald-700 text-xs py-2.5 px-4 rounded-xl font-semibold flex items-center gap-2">
                <CheckCircle size={14} /> La empresa no tiene fondos pendientes de cobro actualmente.
              </div>
            )}
          </div>
          {/* 👆 FIN DEL PANEL FINANCIERO 👆 */}


          {/* Desempeño de pedidos */}
          <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-6">
            <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-5">
              Desempeño de pedidos
            </h3>

            {totalPedidos === 0 ? (
              <div className="py-10 text-center bg-[#FDFBF9] rounded-xl border border-[#8E1B3A]/8">
                <Package size={28} className="text-[#BC9968]/50 mx-auto mb-2" />
                <p className="text-sm text-[#7A5260] italic">
                  Esta empresa aún no tiene pedidos procesados.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Barra tasa de éxito */}
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-semibold text-[#2A0E18]">Tasa de éxito</span>
                    <span
                      className="text-3xl font-serif font-bold leading-none"
                      style={{ color: tasaColor }}
                    >
                      {tasaExito}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[#F0EAE8] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${tasaExito}%`, background: tasaColor }}
                    />
                  </div>
                  <p className="text-xs text-[#7A5260]">
                    {pedidosCompletados} de {totalPedidos} ítems procesados fueron entregados
                    correctamente
                  </p>
                </div>

                {/* Desglose */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-[#EEF8F0] border border-[#2D7A47]/15 p-4 text-center">
                    <CheckCircle size={20} className="text-[#2D7A47] mx-auto mb-2" />
                    <p className="font-serif text-2xl font-bold text-[#2D7A47]">
                      {pedidosCompletados}
                    </p>
                    <p className="text-xs text-[#7A5260] mt-1">Entregados</p>
                  </div>
                  <div className="rounded-xl bg-[#EBF3FB] border border-[#185FA5]/15 p-4 text-center">
                    <Clock size={20} className="text-[#185FA5] mx-auto mb-2" />
                    <p className="font-serif text-2xl font-bold text-[#185FA5]">
                      {pedidosEnProceso}
                    </p>
                    <p className="text-xs text-[#7A5260] mt-1">En proceso</p>
                  </div>
                  <div className="rounded-xl bg-[#FBF0F0] border border-[#A32D2D]/15 p-4 text-center">
                    <XCircle size={20} className="text-[#A32D2D] mx-auto mb-2" />
                    <p className="font-serif text-2xl font-bold text-[#A32D2D]">
                      {pedidosCancelados}
                    </p>
                    <p className="text-xs text-[#7A5260] mt-1">Cancelados</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Catálogo */}
          <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-[#5A0F24]">Catálogo</h3>
              <span className="text-xs text-[#7A5260] bg-[#FDFBF9] px-3 py-1 rounded-lg border border-[#8E1B3A]/10">
                {productosActivos} activos · {empresa._count.productos} total
              </span>
            </div>

            {topProductos.length === 0 ? (
              <div className="py-10 text-center bg-[#FDFBF9] rounded-xl border border-[#8E1B3A]/8">
                <Package size={28} className="text-[#BC9968]/50 mx-auto mb-2" />
                <p className="text-sm text-[#7A5260] italic">
                  No hay productos en el catálogo.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#8E1B3A]/5">
                {topProductos.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-[#FDFBF9] -mx-2 px-2 rounded-xl transition-colors"
                  >
                    {prod.imagen_url ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 border border-[#8E1B3A]/10">
                        <Image
                          src={prod.imagen_url}
                          alt={prod.nombre}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#FAF3EC] flex items-center justify-center flex-shrink-0">
                        <Package size={15} className="text-[#BC9968]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2A0E18] truncate">{prod.nombre}</p>
                      <p className="text-xs text-[#7A5260]">Stock disponible: {prod.stock}</p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-0.5">
                      <p className="text-sm font-bold text-[#8E1B3A]">
                        Bs. {Number(prod.precio_venta).toFixed(2)}
                      </p>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                          prod.activo
                            ? "bg-[#EEF8F0] text-[#2D7A47]"
                            : "bg-[#FBF0F0] text-[#A32D2D]"
                        }`}
                      >
                        {prod.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Descripción extendida */}
          {empresa.descripcion && (
            <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7A5260] border-b border-[#8E1B3A]/8 pb-2 mb-3">
                Sobre el Negocio
              </h3>
              <p className="text-sm text-[#2A0E18] leading-relaxed">{empresa.descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoFila({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] text-[#7A5260] uppercase font-bold tracking-wider">{label}</p>
        <p className="text-sm font-medium text-[#2A0E18] break-words">{value}</p>
      </div>
    </div>
  );
}

function RedSocial({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1.5 text-xs text-[#8E1B3A] bg-[#FAF3EC] px-2.5 py-1.5 rounded-lg border border-[#BC9968]/20 hover:bg-[#8E1B3A] hover:text-white transition-all"
    >
      {icon}
      {label}
    </a>
  );
}