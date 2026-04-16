import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Shield, CreditCard, UserCircle } from "lucide-react";

export default async function DetalleUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const usuarioId = parseInt(id);

    if (isNaN(usuarioId)) notFound();

    const usuario = await prisma.usuarios.findUnique({
        where: { id: usuarioId },
        include: {
            _count: {
                select: { pedidos: true }
            }
        }
    });

    if (!usuario) notFound();

    const formatFecha = (fecha: Date) => {
        return new Intl.DateTimeFormat('es-BO', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        }).format(fecha);
    };

    const getAvatar = (nombre: string, apellido?: string | null) => {
        const first = nombre ? nombre.charAt(0).toUpperCase() : '?';
        const second = apellido ? apellido.charAt(0).toUpperCase() : '';
        return `${first}${second}`;
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header / Navegación */}
            <div className="flex items-center gap-4">
                <Link 
                    href="/admin/usuarios" 
                    className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Gestión de Usuarios</p>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Perfil de Usuario</h1>
                </div>
            </div>

            {/* Tarjeta de Perfil Principal */}
            <div className="bg-white rounded-3xl border border-[#8E1B3A]/10 shadow-xl overflow-hidden shadow-[#8E1B3A]/5">
                <div className="bg-gradient-to-r from-[#5A0F24] to-[#8E1B3A] p-8 sm:p-12 relative overflow-hidden">
                    {/* Decoración de fondo */}
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                    
                    <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl sm:text-5xl font-bold text-[#FDFBF9] shadow-2xl">
                            {getAvatar(usuario.nombre, usuario.apellido)}
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">{usuario.nombre} {usuario.apellido}</h2>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${usuario.tipo === 'admin' ? 'bg-[#BC9968] text-white' : 'bg-white/20 text-white'}`}>
                                    {usuario.tipo}
                                </span>
                            </div>
                            <p className="text-[#FDFBF9]/80 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                                <Mail size={16} /> {usuario.email}
                            </p>
                            <div className="flex gap-4 pt-2 justify-center sm:justify-start">
                                <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-medium text-white border border-white/10">ID: #{usuario.id}</span>
                                <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-medium text-white border border-white/10 capitalize">Plan: {usuario.plan || 'Básico'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Columna 1: Datos de Contacto */}
                    <div className="p-8 space-y-6 border-b md:border-b-0 md:border-r border-[#8E1B3A]/5">
                        <h3 className="text-sm font-bold text-[#5A0F24] uppercase tracking-[2px] mb-4">Información de Contacto</h3>
                        
                        <div className="flex items-center gap-4 text-[#2A0E18]">
                            <div className="p-3 bg-[#FAF3EC] rounded-xl text-[#BC9968] shadow-inner"><Phone size={20} /></div>
                            <div>
                                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">Teléfono</p>
                                <p className="font-medium">{usuario.telefono || "No registrado"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-[#2A0E18]">
                            <div className="p-3 bg-[#EEF8F0] rounded-xl text-[#2D7A47] shadow-inner"><UserCircle size={20} /></div>
                            <div>
                                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">Tipo de Autenticación</p>
                                <p className="font-medium">{usuario.google_id ? "Cuenta de Google" : "Registro de Email"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Columna 2: Actividad y Estado */}
                    <div className="p-8 space-y-6 bg-[#FDFBF9]/30">
                        <h3 className="text-sm font-bold text-[#5A0F24] uppercase tracking-[2px] mb-4">Estado y Actividad</h3>
                        
                        <div className="flex items-center gap-4 text-[#2A0E18]">
                            <div className="p-3 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#8E1B3A] shadow-sm"><Calendar size={20} /></div>
                            <div>
                                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">Miembro desde</p>
                                <p className="font-medium">{formatFecha(usuario.created_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-[#2A0E18]">
                            <div className={`p-3 rounded-xl shadow-sm border ${usuario.activo ? 'bg-[#EEF8F0] border-[#2D7A47]/10 text-[#2D7A47]' : 'bg-[#FBF0F0] border-[#A32D2D]/10 text-[#A32D2D]'}`}>
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-[#7A5260] uppercase font-bold tracking-wider">Estado de Cuenta</p>
                                <p className="font-medium">{usuario.activo ? "Activa / Operativa" : "Suspendida / Inactiva"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer de Compras */}
                <div className="bg-[#FAF3EC]/30 p-8 border-t border-[#8E1B3A]/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white rounded-2xl border border-[#8E1B3A]/10 text-[#5A0F24] shadow-sm">
                            <CreditCard size={28} />
                        </div>
                        <div>
                            <p className="text-xs text-[#7A5260] uppercase font-bold tracking-widest leading-none mb-1">Historial acumulado</p>
                            <p className="text-3xl font-serif font-bold text-[#5A0F24]">{usuario._count.pedidos} <span className="text-sm font-sans text-[#BC9968] font-medium">Pedidos realizados</span></p>
                        </div>
                    </div>
                    
                    <Link 
                        href={`/admin/pedidos?usuario=${usuario.id}`}
                        className="w-full sm:w-auto px-6 py-3 bg-[#8E1B3A] text-white rounded-xl font-bold text-sm hover:bg-[#5A0F24] transition-all shadow-lg shadow-[#8E1B3A]/20 flex items-center justify-center gap-2"
                    >
                        Ver pedidos detallados
                    </Link>
                </div>
            </div>
        </div>
    );
}
