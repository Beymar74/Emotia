import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import CambiarEstadoBtn from "../_components/CambiarEstadoBtn";

export const dynamic = "force-dynamic";

function fmt(date: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(date);
}

export default async function DetallePedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (isNaN(id)) notFound();

  const pedido = await prisma.pedidos.findUnique({
    where: { id },
    include: {
      usuarios:   { select: { nombre: true, apellido: true, email: true, telefono: true } },
      direcciones: true,
      detalle_pedidos: {
        include: {
          productos:   { select: { nombre: true, imagen_url: true } },
          proveedores: { select: { nombre_negocio: true } },
        },
      },
    },
  });

  if (!pedido) notFound();

  const nombreUsuario = `${pedido.usuarios.nombre} ${pedido.usuarios.apellido ?? ""}`.trim();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/admin/pedidos"
            className="text-xs text-[#BC9968] hover:underline mb-1 inline-block"
          >
            ← Volver a pedidos
          </Link>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
            Pedidos &amp; Pagos
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">
            Pedido #{String(pedido.id).padStart(4, "0")}
          </h1>
          <p className="text-sm text-[#7A5260] mt-1">
            Creado el {fmt(pedido.created_at)} — Última actualización: {fmt(pedido.updated_at)}
          </p>
        </div>
      </div>

      {/* Cambiar estado */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h2 className="font-serif text-lg font-semibold text-[#5A0F24] mb-3">
          Estado del pedido
        </h2>
        <CambiarEstadoBtn pedidoId={pedido.id} estadoActual={pedido.estado} />
      </div>

      {/* Resumen financiero */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h2 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">
          Resumen financiero
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {[
            { label: "Subtotal",         valor: `Bs ${Number(pedido.subtotal).toFixed(2)}` },
            { label: "Costo de envío",   valor: `Bs ${Number(pedido.costo_envio).toFixed(2)}` },
            { label: "TOTAL",            valor: `Bs ${Number(pedido.total).toFixed(2)}`, bold: true },
            { label: "Método de pago",   valor: pedido.metodo_pago ?? "—" },
            { label: "Referencia pago",  valor: pedido.referencia_pago ?? "—" },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs uppercase tracking-wider text-[#7A5260] font-medium">{f.label}</p>
              <p className={`mt-0.5 ${(f as any).bold ? "text-xl font-bold text-[#5A0F24]" : "text-[#2A0E18]"}`}>
                {f.valor}
              </p>
            </div>
          ))}
        </div>
        {pedido.notas && (
          <div className="mt-4 p-3 bg-[#FAF3EC] rounded-lg">
            <p className="text-xs font-semibold text-[#7A5260] uppercase tracking-wider mb-1">Notas</p>
            <p className="text-sm text-[#2A0E18]">{pedido.notas}</p>
          </div>
        )}
      </div>

      {/* Datos del cliente */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h2 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">
          Cliente
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#7A5260] font-medium">Nombre</p>
            <p className="mt-0.5 text-[#2A0E18] font-medium">{nombreUsuario}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-[#7A5260] font-medium">Email</p>
            <p className="mt-0.5 text-[#2A0E18]">{pedido.usuarios.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-[#7A5260] font-medium">Teléfono</p>
            <p className="mt-0.5 text-[#2A0E18]">{pedido.usuarios.telefono ?? "—"}</p>
          </div>
          {pedido.direcciones && (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#7A5260] font-medium">
                Dirección de entrega
              </p>
              <p className="mt-0.5 text-[#2A0E18]">
                {pedido.direcciones.calle} {pedido.direcciones.numero ?? ""},{" "}
                {pedido.direcciones.zona ?? ""}, {pedido.direcciones.ciudad}
              </p>
              {pedido.direcciones.referencia && (
                <p className="text-xs text-[#7A5260] mt-0.5">
                  Ref: {pedido.direcciones.referencia}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Productos del pedido */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-x-auto">
        <div className="px-5 py-4 border-b border-[#8E1B3A]/10">
          <h2 className="font-serif text-lg font-semibold text-[#5A0F24]">
            Productos ({pedido.detalle_pedidos.length})
          </h2>
        </div>
        <table className="w-full border-collapse min-w-[650px]">
          <thead>
            <tr>
              {["Producto", "Proveedor", "Cant.", "Precio unit.", "Subtotal", "Calificación", "Reseña"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {pedido.detalle_pedidos.map((d) => (
              <tr
                key={d.id}
                className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50"
              >
                <td className="px-4 py-3 text-sm font-semibold text-[#5A0F24]">
                  {d.productos.nombre}
                  {d.empaque_especial && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#FFF3E0] text-[#E65100]">
                      Empaque especial
                    </span>
                  )}
                  {d.mensaje_personal && (
                    <p className="text-xs text-[#7A5260] mt-0.5 font-normal italic">
                      "{d.mensaje_personal}"
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-[#7A5260]">
                  {d.proveedores.nombre_negocio}
                </td>
                <td className="px-4 py-3 text-sm text-center font-bold text-[#2A0E18]">
                  {d.cantidad}
                </td>
                <td className="px-4 py-3 text-sm text-[#7A5260]">
                  Bs {Number(d.precio_unitario).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-[#5A0F24]">
                  Bs {Number(d.subtotal).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-[#7A5260]">
                  {d.calificacion ? `${d.calificacion}/5 ⭐` : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-[#7A5260] max-w-[200px] truncate">
                  {d.resena ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
