import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  Store,
  MapPin,
  Package,
  Star,
  CreditCard,
  UserCircle,
  ExternalLink,
} from "lucide-react";
import Breadcrumbs from "../../_components/Breadcrumbs";
import LogoProveedorUploader from "../_components/LogoProveedorUploader";

export const dynamic = "force-dynamic";

export default async function DetalleProveedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proveedorId = Number(id);

  if (!Number.isInteger(proveedorId) || proveedorId <= 0) {
    notFound();
  }

  const proveedor = await prisma.proveedores.findUnique({
    where: {
      id: proveedorId,
    },
    include: {
      _count: {
        select: {
          productos: true,
          detalle_pedidos: true,
        },
      },
      productos: {
        orderBy: {
          created_at: "desc",
        },
        take: 8,
        select: {
          id: true,
          nombre: true,
          precio_venta: true,
          stock: true,
          activo: true,
          imagen_url: true,
          created_at: true,
          categorias: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
  });

  if (!proveedor) {
    notFound();
  }

  const formatFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/La_Paz",
    }).format(fecha);
  };

  const formatMoney = (value: unknown) => {
    const numberValue = Number(value || 0);
    return `Bs. ${numberValue.toFixed(2)}`;
  };

  const estado = proveedor.estado || "pendiente";

  const estadoStyles: Record<string, string> = {
    activo: "bg-[#EEF8F0] border-[#2D7A47]/10 text-[#2D7A47]",
    pendiente: "bg-[#FFF6E8] border-[#BC9968]/20 text-[#8C5E08]",
    suspendido: "bg-[#FBF0F0] border-[#A32D2D]/10 text-[#A32D2D]",
  };

  const inicial = proveedor.nombre_negocio
    ? proveedor.nombre_negocio.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumbs
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Proveedores", href: "/admin/proveedores" },
          { label: proveedor.nombre_negocio },
        ]}
      />

      <div className="flex items-center gap-4">
        <Link
          href="/admin/proveedores"
          className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
            Gestión de Proveedores
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">
            Perfil del Proveedor
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#8E1B3A]/10 shadow-xl overflow-hidden shadow-[#8E1B3A]/5">
        <div className="bg-gradient-to-r from-[#5A0F24] to-[#8E1B3A] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

          <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
            <div className="relative flex-shrink-0">
            <div className="rounded-3xl overflow-hidden bg-white/10 border border-white/15 shadow-2xl p-2">
                <LogoProveedorUploader
                proveedorId={proveedor.id}
                logoActual={proveedor.logo_url}
                label="Logo del proveedor"
                />
            </div>
            </div>

            <div className="space-y-3 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  {proveedor.nombre_negocio}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    estadoStyles[estado] || estadoStyles.pendiente
                  }`}
                >
                  {estado}
                </span>
              </div>

              <p className="text-[#FDFBF9]/80 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                <Mail size={16} /> {proveedor.email}
              </p>

              {proveedor.descripcion ? (
                <p className="text-[#FDFBF9]/75 text-sm leading-relaxed max-w-2xl">
                  {proveedor.descripcion}
                </p>
              ) : (
                <p className="text-[#FDFBF9]/55 text-sm">
                  Este proveedor aún no tiene una descripción pública registrada.
                </p>
              )}

              <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-medium text-white border border-white/10">
                  ID: #{proveedor.id}
                </span>

                <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-medium text-white border border-white/10">
                  {proveedor._count.productos} productos
                </span>

                <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-medium text-white border border-white/10">
                  Rating {Number(proveedor.calificacion_prom || 0).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-[#8E1B3A]/5">
            <h3 className="text-sm font-bold text-[#5A0F24] uppercase tracking-[2px] mb-4">
              Datos del Negocio
            </h3>

            <div className="flex items-center gap-4 text-[#2A0E18]">
              <div className="p-3 bg-[#FAF3EC] rounded-xl text-[#BC9968] shadow-inner">
                <Store size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">
                  Nombre comercial
                </p>
                <p className="font-medium">{proveedor.nombre_negocio}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#2A0E18]">
              <div className="p-3 bg-[#EEF8F0] rounded-xl text-[#2D7A47] shadow-inner">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">
                  Teléfono
                </p>
                <p className="font-medium">
                  {proveedor.telefono || "No registrado"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#2A0E18]">
              <div className="p-3 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#8E1B3A] shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">
                  Dirección
                </p>
                <p className="font-medium">
                  {proveedor.direccion || "No registrada"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-[#8E1B3A]/5 bg-[#FDFBF9]/30">
            <h3 className="text-sm font-bold text-[#5A0F24] uppercase tracking-[2px] mb-4">
              Representante
            </h3>

            <div className="flex items-center gap-4 text-[#2A0E18]">
              <div className="p-3 bg-[#FAF3EC] rounded-xl text-[#BC9968] shadow-inner">
                <UserCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">
                  Nombre
                </p>
                <p className="font-medium">
                  {proveedor.rep_nombre || "No registrado"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#2A0E18]">
              <div className="p-3 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#8E1B3A] shadow-sm">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">
                  Email
                </p>
                <p className="font-medium">
                  {proveedor.rep_email || "No registrado"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#2A0E18]">
              <div className="p-3 bg-[#EEF8F0] rounded-xl text-[#2D7A47] shadow-inner">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">
                  Teléfono
                </p>
                <p className="font-medium">
                  {proveedor.rep_telefono || "No registrado"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <h3 className="text-sm font-bold text-[#5A0F24] uppercase tracking-[2px] mb-4">
              Estado y Actividad
            </h3>

            <div className="flex items-center gap-4 text-[#2A0E18]">
              <div
                className={`p-3 rounded-xl shadow-sm border ${
                  estadoStyles[estado] || estadoStyles.pendiente
                }`}
              >
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">
                  Estado de cuenta
                </p>
                <p className="font-medium capitalize">{estado}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#2A0E18]">
              <div className="p-3 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#8E1B3A] shadow-sm">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">
                  Alta
                </p>
                <p className="font-medium">{formatFecha(proveedor.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#2A0E18]">
              <div className="p-3 bg-[#FAF3EC] rounded-xl text-[#BC9968] shadow-inner">
                <Star size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">
                  Calificación promedio
                </p>
                <p className="font-medium">
                  {Number(proveedor.calificacion_prom || 0).toFixed(1)} / 5
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF3EC]/30 p-8 border-t border-[#8E1B3A]/10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#8E1B3A]/10 text-[#5A0F24] shadow-sm">
              <Package size={28} />
            </div>
            <div>
              <p className="text-xs text-[#7A5260] uppercase font-bold tracking-widest leading-none mb-1">
                Catálogo
              </p>
              <p className="text-3xl font-serif font-bold text-[#5A0F24]">
                {proveedor._count.productos}{" "}
                <span className="text-sm font-sans text-[#BC9968] font-medium">
                  productos
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#8E1B3A]/10 text-[#5A0F24] shadow-sm">
              <CreditCard size={28} />
            </div>
            <div>
              <p className="text-xs text-[#7A5260] uppercase font-bold tracking-widest leading-none mb-1">
                Ventas
              </p>
              <p className="text-3xl font-serif font-bold text-[#5A0F24]">
                {proveedor._count.detalle_pedidos}{" "}
                <span className="text-sm font-sans text-[#BC9968] font-medium">
                  órdenes
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#8E1B3A]/10 text-[#5A0F24] shadow-sm">
              <Store size={28} />
            </div>
            <div>
              <p className="text-xs text-[#7A5260] uppercase font-bold tracking-widest leading-none mb-1">
                Total vendido
              </p>
              <p className="text-3xl font-serif font-bold text-[#5A0F24]">
                {formatMoney(proveedor.total_vendido)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#5A0F24]">
              Productos recientes
            </h3>
            <p className="text-xs text-[#7A5260]">
              Últimos productos publicados por este proveedor.
            </p>
          </div>

          <Link
            href={`/admin/productos?proveedor=${proveedor.id}`}
            className="px-4 py-2 rounded-xl bg-[#8E1B3A]/10 text-[#8E1B3A] text-xs font-bold hover:bg-[#8E1B3A] hover:text-white transition-all inline-flex items-center gap-2 justify-center"
          >
            Ver catálogo completo
            <ExternalLink size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#FDFBF9]/30">
                {["Producto", "Categoría", "Precio", "Stock", "Estado"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[10px] tracking-[2px] uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/5"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#8E1B3A]/5">
              {proveedor.productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-[#7A5260]">
                      Este proveedor aún no tiene productos registrados.
                    </p>
                  </td>
                </tr>
              ) : (
                proveedor.productos.map((producto) => (
                  <tr
                    key={producto.id}
                    className="hover:bg-[#FDFBF9] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#FAF3EC] flex items-center justify-center flex-shrink-0">
                          {producto.imagen_url ? (
                            <img
                              src={producto.imagen_url}
                              alt={producto.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={18} className="text-[#BC9968]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2A0E18]">
                            {producto.nombre}
                          </p>
                          <p className="text-[10px] text-[#B0B0B0]">
                            Alta: {formatFecha(producto.created_at)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-[#7A5260]">
                      {producto.categorias?.nombre || "Sin categoría"}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-[#5A0F24]">
                      {formatMoney(producto.precio_venta)}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-[#5A0F24]">
                      {producto.stock}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          producto.activo
                            ? "bg-[#EEF8F0] text-[#2D7A47] border border-[#2D7A47]/10"
                            : "bg-[#F1EFE8] text-[#5F5E5A] border border-[#5F5E5A]/10"
                        }`}
                      >
                        {producto.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}