import prisma from "@/lib/prisma";
import PedidosClient from "./_components/PedidosClient";

type EstadoPedido = "pendiente" | "en_preparacion" | "en_camino" | "completado" | "cancelado";

export default async function PedidosPage() {
  // --- CONSULTA A LA BASE DE DATOS ---
  const pedidosDB = await prisma.pedidos.findMany({
    orderBy: { created_at: "desc" },
    include: {
      usuarios: { select: { nombre: true, apellido: true } },
      detalle_pedidos: {
        include: {
          productos: { select: { nombre: true } },
          proveedores: { select: { nombre_negocio: true } },
        },
      },
    },
  });

  // --- FUNCIONES AUXILIARES ---
  const formatFecha = (fecha: Date) =>
    new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(fecha);

  const mapEstadoBDtoUI = (estadoBD: string): EstadoPedido => {
    switch (estadoBD.toLowerCase()) {
      case "pendiente":
        return "pendiente";
      case "confirmado":
      case "en_preparacion":
        return "en_preparacion";
      case "enviado":
        return "en_camino";
      case "entregado":
        return "completado";
      case "cancelado":
        return "cancelado";
      default:
        return "pendiente";
    }
  };

  // --- MAPEO DE DATOS ---
  type PedidoMapeado = {
    id: string;
    idNum: number;
    usuario: string;
    proveedor: string;
    producto: string;
    monto: string;
    fecha: string;
    estado: EstadoPedido;
  };

  const pedidosMapeados: PedidoMapeado[] = pedidosDB.map((p: any) => {
    const detalles = p.detalle_pedidos || [];
    const primerDetalle = detalles[0];

    let nombreProducto = primerDetalle?.productos?.nombre || "Producto desconocido";
    if (detalles.length > 1) nombreProducto += ` (+${detalles.length - 1} más)`;

    let nombreProveedor = primerDetalle?.proveedores?.nombre_negocio || "Proveedor desconocido";
    if (detalles.length > 1) nombreProveedor = "Varios proveedores";

    const nombreUsuario = `${p.usuarios?.nombre || ""} ${p.usuarios?.apellido || ""}`.trim();

    return {
      id: `#${p.id.toString().padStart(4, "0")}`,
      idNum: p.id,
      usuario: nombreUsuario,
      proveedor: nombreProveedor,
      producto: nombreProducto,
      monto: `Bs ${Number(p.total).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      fecha: formatFecha(p.created_at),
      estado: mapEstadoBDtoUI(p.estado),
    };
  });

  // --- MÉTRICAS ---
  const stats = {
    totalPedidos: pedidosMapeados.length,
    pendientes: pedidosMapeados.filter((p) => p.estado === "pendiente").length,
    enCurso: pedidosMapeados.filter(
      (p) => p.estado === "en_preparacion" || p.estado === "en_camino"
    ).length,
    completados: pedidosMapeados.filter((p) => p.estado === "completado").length,
    cancelados: pedidosMapeados.filter((p) => p.estado === "cancelado").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
          Pedidos &amp; Pagos
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Todos los pedidos</h1>
      </div>

      {/* Client Component con filtros + cancelar + modal */}
      <PedidosClient pedidos={pedidosMapeados} stats={stats} />
    </div>
  );
}