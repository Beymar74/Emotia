import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";

export default async function DetalleUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = parseInt(id);

    // Validar que el ID sea un número
    if (isNaN(userId)) {
        notFound();
    }

    // Buscar el usuario en la base de datos junto con la cantidad de pedidos
    const usuario = await prisma.usuarios.findUnique({
        where: { id: userId },
        include: {
            _count: {
                select: { pedidos: true }
            }
        }
    });

    // Si el usuario no existe, muestra la página 404
    if (!usuario) {
        notFound();
    }

    const formatFecha = (fecha: Date) => {
        return new Intl.DateTimeFormat('es-BO', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(fecha);
    };

    const getAvatar = (nombre: string, apellido?: string | null) => {
        const first = nombre ? nombre.charAt(0).toUpperCase() : '?';
        const second = apellido ? apellido.charAt(0).toUpperCase() : '';
        return `${first}${second}`;
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header con botón de volver */}
            <div className="flex items-center gap-4">
                <Link 
                    href="/admin/perfiles" 
                    className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Perfil de Sistema</p>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Detalle de Cuenta</h1>
                </div>
            </div>

            {/* Tarjeta de Información Principal */}
            <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#FDFBF9] to-[#FAF3EC] p-6 border-b border-[#8E1B3A]/10 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-2xl font-bold text-white shadow-md">
                        {getAvatar(usuario.nombre, usuario.apellido)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#2A0E18]">{usuario.nombre} {usuario.apellido}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${usuario.activo ? 'bg-[#EEF8F0] text-[#2D7A47]' : 'bg-[#FBF0F0] text-[#A32D2D]'}`}>
                                {usuario.activo ? 'Cuenta Activa' : 'Cuenta Suspendida'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider capitalize ${usuario.tipo === 'admin' ? 'bg-[#8E1B3A]/10 text-[#8E1B3A]' : 'bg-[#E6F1FB] text-[#185FA5]'}`}>
                                Rol: {usuario.tipo}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-[#7A5260] uppercase tracking-wider border-b border-[#8E1B3A]/5 pb-2">Datos de Contacto</h3>
                        
                        <div className="flex items-center gap-3 text-[#2A0E18]">
                            <div className="p-2 bg-[#8E1B3A]/5 rounded-lg text-[#8E1B3A]"><Mail size={18} /></div>
                            <div>
                                <p className="text-xs text-[#7A5260]">Correo Electrónico</p>
                                <p className="font-medium">{usuario.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-[#2A0E18]">
                            <div className="p-2 bg-[#8E1B3A]/5 rounded-lg text-[#8E1B3A]"><Phone size={18} /></div>
                            <div>
                                <p className="text-xs text-[#7A5260]">Teléfono</p>
                                <p className="font-medium">{usuario.telefono || 'No registrado'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-[#7A5260] uppercase tracking-wider border-b border-[#8E1B3A]/5 pb-2">Información del Sistema</h3>
                        
                        <div className="flex items-center gap-3 text-[#2A0E18]">
                            <div className="p-2 bg-[#8E1B3A]/5 rounded-lg text-[#8E1B3A]"><ShieldCheck size={18} /></div>
                            <div>
                                <p className="text-xs text-[#7A5260]">Suscripción / Plan</p>
                                <p className="font-medium capitalize">{usuario.plan}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-[#2A0E18]">
                            <div className="p-2 bg-[#8E1B3A]/5 rounded-lg text-[#8E1B3A]"><Calendar size={18} /></div>
                            <div>
                                <p className="text-xs text-[#7A5260]">Miembro desde</p>
                                <p className="font-medium">{formatFecha(usuario.created_at)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#FDFBF9] p-6 border-t border-[#8E1B3A]/10 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-[#7A5260] uppercase font-bold tracking-wider">Historial de Compras</p>
                        <p className="text-2xl font-serif font-bold text-[#5A0F24]">{usuario._count.pedidos} Pedidos realizados</p>
                    </div>
                </div>
            </div>
        </div>
    );
}