import prisma from "@/lib/prisma";
import CategoriasClient from "./_components/CategoriasClient";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const categorias = await prisma.categorias.findMany({
    orderBy: { nombre: "asc" },
    include: {
      _count: { select: { productos: true } },
    },
  });

  const serialized = categorias.map((c) => ({
    id:          c.id,
    nombre:      c.nombre,
    descripcion: c.descripcion,
    activo:      c.activo,
    _count:      c._count,
  }));

  const totalActivas   = serialized.filter((c) => c.activo).length;
  const totalInactivas = serialized.filter((c) => !c.activo).length;
  const totalProductos = serialized.reduce((s, c) => s + c._count.productos, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
          Catálogo
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">
          Categorías
        </h1>
        <p className="text-sm text-[#7A5260] mt-1">
          Gestiona las categorías que agrupan los productos del catálogo.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total categorías", valor: serialized.length, color: "#8E1B3A" },
          { label: "Activas",          valor: totalActivas,       color: "#2D7A47" },
          { label: "Inactivas",        valor: totalInactivas,     color: "#A32D2D" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: s.color }}
            />
            <p className="font-serif text-4xl font-bold text-[#5A0F24]">
              {s.valor}
            </p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Client CRUD */}
      <CategoriasClient categorias={serialized} />
    </div>
  );
}
