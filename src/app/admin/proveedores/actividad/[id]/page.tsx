import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, Star, Package, ShoppingBag, TrendingUp } from "lucide-react";

export default async function DetalleActividadProveedorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const proveedorId = parseInt(id);

    // 1. Validar que el ID sea un número
    if (isNaN(proveedorId)) {
        notFound();
    }

    // 2. Buscar el proveedor y contar sus productos y pedidos relacionados
    const proveedor = await prisma.proveedores.findUnique({
        where: { id: proveedorId },
        include: {
            _count: {
                select: { 
                    productos: true,
                    detalle_pedidos: true
                }
            }
        }
    });

    // Si no existe, lanza error 404
    if (!proveedor) {
        notFound();
    }

    // --- FUNCIONES AUXILIARES ---
    const formatFecha = (fecha: Date) => {
        return new Intl.DateTimeFormat('es-BO', {
            day: '2-digit', month: 'long', year: 'numeric'
        }).format(fecha);
    };

    const getInitials = (nombre: string) => {
        if (!nombre) return "PR";
        return nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    };

    const estadoPill: Record<string, string> = {
        aprobado: "bg-[#EEF8F0] text-[#2D7A47]",
        suspendido: "bg-[#FBF0F0] text-[#A32D2D]",
        pendiente: "bg-[#FDF5E6] text-[#8C5E08]",
        rechazado: "bg-[#FBF0F0] text-[#A32D2D]",
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header con botón de volver */}
            <div className="flex items-center gap-4">
                <Link 
                    href="/admin/proveedores/actividad" 
                    className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Actividad de Proveedores</p>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Perfil del Negocio</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* COLUMNA IZQUIERDA: Info General */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Tarjeta de Perfil */}
                    <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-br from-[#FDFBF9] to-[#FAF3EC] p-6 flex flex-col items-center text-center border-b border-[#8E1B3A]/10">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-3xl font-bold text-white shadow-md mb-4">
                                {getInitials(proveedor.nombre_negocio)}
                            </div>
                            <h2 className="text-xl font-bold text-[#2A0E18]">{proveedor.nombre_negocio}</h2>
                            <span className={`mt-3 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${estadoPill[proveedor.estado] || 'bg-[#F1EFE8] text-[#5F5E5A]'}`}>
                                Estado: {proveedor.estado}
                            </span>
                        </div>

                        <div className="p-6 space-y-4 text-sm">
                            <h3 className="font-bold text-[#7A5260] uppercase tracking-wider text-xs border-b border-[#8E1B3A]/5 pb-2">
                                Información de Contacto
                            </h3>
                            
                            <div className="flex items-start gap-3 text-[#2A0E18]">
                                <Mail size={16} className="text-[#8E1B3A] mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-xs text-[#7A5260]">Correo Electrónico</p>
                                    <p className="font-medium break-all">{proveedor.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-[#2A0E18]">
                                <Phone size={16} className="text-[#8E1B3A] mt-0.5" />
                                <div>
                                    <p className="text-xs text-[#7A5260]">Teléfono</p>
                                    <p className="font-medium">{proveedor.telefono || 'No registrado'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-[#2A0E18]">
                                <Calendar size={16} className="text-[#8E1B3A] mt-0.5" />
                                <div>
                                    <p className="text-xs text-[#7A5260]">Registrado el</p>
                                    <p className="font-medium">{formatFecha(proveedor.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    {proveedor.descripcion && (
                        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-6">
                            <h3 className="font-bold text-[#7A5260] uppercase tracking-wider text-xs border-b border-[#8E1B3A]/5 pb-2 mb-3">
                                Sobre el Negocio
                            </h3>
                            <p className="text-sm text-[#2A0E18] leading-relaxed">
                                {proveedor.descripcion}
                            </p>
                        </div>
                    )}
                </div>

                {/* COLUMNA DERECHA: Rendimiento y Estadísticas */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Tarjetas de Métricas Rápidas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#FAF3EC] flex items-center justify-center text-[#8C5E08]">
                                <Star size={24} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-xs text-[#7A5260] uppercase font-bold tracking-wider mb-1">Calificación</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-serif font-bold text-[#5A0F24]">
                                        {proveedor.calificacion_prom ? Number(proveedor.calificacion_prom).toFixed(1) : "N/A"}
                                    </span>
                                    <span className="text-sm text-[#7A5260] mb-1">/ 5.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#EEF8F0] flex items-center justify-center text-[#2D7A47]">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-[#7A5260] uppercase font-bold tracking-wider mb-1">Total Generado</p>
                                <span className="text-3xl font-serif font-bold text-[#5A0F24]">
                                    Bs. {proveedor.total_vendido ? Number(proveedor.total_vendido).toFixed(2) : "0.00"}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#8E1B3A]/10 flex items-center justify-center text-[#8E1B3A]">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-[#7A5260] uppercase font-bold tracking-wider mb-1">Catálogo</p>
                                <span className="text-3xl font-serif font-bold text-[#5A0F24]">
                                    {proveedor._count.productos}
                                </span>
                                <span className="text-sm text-[#7A5260] ml-2">Productos</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#E6F1FB] flex items-center justify-center text-[#185FA5]">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-[#7A5260] uppercase font-bold tracking-wider mb-1">Órdenes</p>
                                <span className="text-3xl font-serif font-bold text-[#5A0F24]">
                                    {proveedor._count.detalle_pedidos}
                                </span>
                                <span className="text-sm text-[#7A5260] ml-2">Despachadas</span>
                            </div>
                        </div>
                    </div>

                    {/* Resumen extra o Placeholder para Gráficos */}
                    <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm p-6">
                        <div className="flex items-center justify-between border-b border-[#8E1B3A]/5 pb-4 mb-4">
                            <h3 className="font-serif text-lg font-bold text-[#5A0F24]">Resumen de Actividad</h3>
                            <span className="text-xs text-[#7A5260] font-medium bg-[#FDFBF9] px-3 py-1 rounded-lg border border-[#8E1B3A]/10">
                                Última act: {formatFecha(proveedor.updated_at)}
                            </span>
                        </div>
                        
                        {proveedor._count.detalle_pedidos === 0 && proveedor._count.productos === 0 ? (
                            <div className="py-8 text-center text-[#7A5260] bg-[#FAF3EC] rounded-xl border border-[#8E1B3A]/5">
                                Este proveedor aún no ha registrado productos ni procesado pedidos en el sistema.
                            </div>
                        ) : (
                            <div className="py-8 text-center text-[#7A5260] bg-[#FDFBF9] rounded-xl border border-[#8E1B3A]/5">
                                Aquí podrías integrar un gráfico de ventas mensual o el historial de los últimos 5 pedidos despachados.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}