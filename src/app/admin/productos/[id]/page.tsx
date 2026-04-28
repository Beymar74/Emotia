import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, Store, Tag, CheckCircle2, XCircle, Edit } from "lucide-react";

export default async function DetalleProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productoId = parseInt(id);

  if (isNaN(productoId)) notFound();

  // Buscar el producto con su categoría y proveedor
  const producto = await prisma.productos.findUnique({
    where: { id: productoId },
    include: {
      proveedores: true,
      categorias: true,
    }
  });

  if (!producto) notFound();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/productos" 
            className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Catálogo</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Detalle del Producto</h1>
          </div>
        </div>
        
        <Link 
          href={`/admin/productos/${producto.id}/editar`}
          className="flex items-center gap-2 bg-[#8E1B3A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#5A0F24] transition-colors shadow-md shadow-[#8E1B3A]/20"
        >
          <Edit size={16} />
          Editar
        </Link>
      </div>

      {/* Tarjeta de Información */}
      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        {/* Cabecera del Producto */}
        <div className="bg-gradient-to-r from-[#FDFBF9] to-[#FAF3EC] p-6 border-b border-[#8E1B3A]/10 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-32 h-32 rounded-2xl bg-[#E5E3DC] border border-[#8E1B3A]/10 flex items-center justify-center text-[#7A5260] flex-shrink-0 overflow-hidden">
            {producto.imagen_url ? (
              <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover" />
            ) : (
              <Package size={40} opacity={0.5} />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold text-[#2A0E18]">{producto.nombre}</h2>
            <p className="text-sm text-[#7A5260] max-w-2xl">{producto.descripcion || "Sin descripción detallada."}</p>
            
            <div className="flex items-center gap-3 pt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${producto.activo ? 'bg-[#EEF8F0] text-[#2D7A47]' : 'bg-[#FBF0F0] text-[#A32D2D]'}`}>
                {producto.activo ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                {producto.activo ? 'Activo' : 'Pausado'}
              </span>
              <span className="text-2xl font-serif font-bold text-[#5A0F24]">
                Bs {Number(producto.precio_venta).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Detalles Técnicos */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#7A5260] uppercase tracking-wider border-b border-[#8E1B3A]/5 pb-2">Datos Comerciales</h3>
            
            <div className="flex items-center gap-3 text-[#2A0E18]">
              <div className="p-2 bg-[#8E1B3A]/5 rounded-lg text-[#8E1B3A]"><Store size={18} /></div>
              <div>
                <p className="text-xs text-[#7A5260]">Proveedor</p>
                <p className="font-medium">{producto.proveedores?.nombre_negocio || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[#2A0E18]">
              <div className="p-2 bg-[#8E1B3A]/5 rounded-lg text-[#8E1B3A]"><Tag size={18} /></div>
              <div>
                <p className="text-xs text-[#7A5260]">Categoría</p>
                <p className="font-medium">{producto.categorias?.nombre || "Sin categoría"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#7A5260] uppercase tracking-wider border-b border-[#8E1B3A]/5 pb-2">Inventario y Costos</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAF3EC] p-3 rounded-xl">
                <p className="text-xs text-[#7A5260] mb-1">Stock Actual</p>
                <p className={`text-lg font-bold ${producto.stock < 10 ? 'text-[#A32D2D]' : 'text-[#2D7A47]'}`}>
                  {producto.stock} unidades
                </p>
              </div>
              <div className="bg-[#FDFBF9] border border-[#8E1B3A]/5 p-3 rounded-xl">
                <p className="text-xs text-[#7A5260] mb-1">Precio Base (Costo)</p>
                <p className="text-lg font-bold text-[#2A0E18]">Bs {Number(producto.precio_base).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}