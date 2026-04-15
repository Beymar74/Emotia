import prisma from "@/lib/prisma";
import ProductosClient from "./_components/ProductosClient";

type EstadoProd = "activo" | "desactivado" | "revision";

export default async function ProductosPage() {
  // --- CONSULTAS A LA BASE DE DATOS ---
  const productosDB = await prisma.productos.findMany({
    include: {
      proveedores: { select: { nombre_negocio: true } },
      categorias: { select: { nombre: true } },
    },
    orderBy: { created_at: "desc" },
  });

  // --- MAPEO DE DATOS ---
  type ProductoData = {
    id: number;
    nombre: string;
    proveedor: string;
    categoria: string;
    precio: string;
    stock: number;
    calificacion: string;
    estado: EstadoProd;
    destacado: boolean;
    activo: boolean;
  };

  const productosMapeados: ProductoData[] = productosDB.map((p: any) => {
    const mockCalificacion = (4.0 + (p.id % 10) * 0.1).toFixed(1);
    const isDestacado = p.stock > 10;

    return {
      id: p.id,
      nombre: p.nombre,
      proveedor: p.proveedores?.nombre_negocio || "Desconocido",
      categoria: p.categorias?.nombre || "Sin categoría",
      precio: `Bs ${Number(p.precio_venta).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      stock: p.stock,
      calificacion: mockCalificacion,
      estado: p.activo ? "activo" : "desactivado",
      destacado: isDestacado,
      activo: p.activo,
    };
  });

  // --- MÉTRICAS ---
  const totalProductos = productosMapeados.length;
  const activos = productosMapeados.filter((p) => p.estado === "activo").length;
  const enRevision = productosMapeados.filter((p) => p.estado === "revision").length;
  const desactivados = productosMapeados.filter((p) => p.estado === "desactivado").length;

  // Categorías únicas para el filtro
  const categorias = [...new Set(productosMapeados.map((p) => p.categoria))].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Catálogo</p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Todos los productos</h1>
        </div>
      </div>

      {/* Client Component con filtros + acciones */}
      <ProductosClient
        productos={productosMapeados}
        categorias={categorias}
        totalProductos={totalProductos}
        activos={activos}
        enRevision={enRevision}
        desactivados={desactivados}
      />
    </div>
  );
}