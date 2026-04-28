import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FormEditarProducto from "../../_components/FormEditarProducto";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productoId = parseInt(id);

  if (isNaN(productoId)) notFound();

  // Traer el producto actual y las categorías disponibles
  const [producto, categorias] = await Promise.all([
    prisma.productos.findUnique({ where: { id: productoId } }),
    prisma.categorias.findMany({ orderBy: { nombre: 'asc' } })
  ]);

  if (!producto) notFound();

  // Serializar el objeto producto (Convertir Decimals de Prisma a numbers)
  const productoSerializado = {
    ...producto,
    precio_base: producto.precio_base ? Number(producto.precio_base) : 0,
    precio_venta: producto.precio_venta ? Number(producto.precio_venta) : 0,
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/productos" 
          className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Catálogo</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Editar Producto</h1>
        </div>
      </div>

      <FormEditarProducto producto={productoSerializado} categorias={categorias} />
    </div>
  );
}