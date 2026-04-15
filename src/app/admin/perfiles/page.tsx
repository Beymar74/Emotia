import prisma from "@/lib/prisma";
import { usuarios } from "@/generated/prisma/client";

export default async function PerfilesPage() {
    // --- CONSULTAS A LA BASE DE DATOS ---
    // Traemos a TODOS los usuarios (incluyendo admins)
    const perfilesReales = await prisma.usuarios.findMany({
        orderBy: { created_at: 'desc' },
        include: {
            _count: {
                select: { pedidos: true }
            }
        }
    });

    // Tipo para que TypeScript no se queje de la 'p'
    type PerfilConConteo = usuarios & { _count: { pedidos: number } };

    // --- CÁLCULO DE MÉTRICAS ---
    const totalCuentas = perfilesReales.length;
    const cuentasAdmin = perfilesReales.filter((p: usuarios) => p.tipo === 'admin').length;
    // Si tienen google_id, asumimos que se registraron con Google
    const accesoGoogle = perfilesReales.filter((p: usuarios) => p.google_id !== null).length;
    const cuentasPremium = perfilesReales.filter((p: usuarios) => p.plan === 'premium').length;

    // --- FUNCIONES AUXILIARES ---
    // Función para formatear fechas (ej. "14/04/2026 09:30")
    const formatFecha = (fecha: Date) => {
        return new Intl.DateTimeFormat('es-BO', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        }).format(fecha);
    };

    // Función para el avatar (ej: "Super Admin" -> "SA")
    const getAvatar = (nombre: string, apellido?: string | null) => {
        const first = nombre ? nombre.charAt(0).toUpperCase() : '?';
        const second = apellido ? apellido.charAt(0).toUpperCase() : '';
        return `${first}${second}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Usuarios & Accesos</p>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Cuentas y perfiles</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total cuentas", valor: String(totalCuentas), color: "#8E1B3A" },
                    { label: "Cuentas admin", valor: String(cuentasAdmin), color: "#AB3A50" },
                    { label: "Acceso con Google", valor: String(accesoGoogle), color: "#BC9968" },
                    { label: "Cuentas premium", valor: String(cuentasPremium), color: "#5C3A2E" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 sm:p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
                        <p className="font-serif text-2xl sm:text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
                        <p className="text-xs sm:text-sm text-[#7A5260] mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    className="flex-1 text-sm border border-[#8E1B3A]/15 rounded-lg px-3 sm:px-4 py-2 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18] placeholder:text-[#B0B0B0]"
                />
                <div className="flex gap-2 sm:gap-3">
                    <select className="flex-1 sm:flex-none text-sm border border-[#8E1B3A]/15 rounded-lg px-3 sm:px-4 py-2 outline-none text-[#7A5260]">
                        <option>Todos los tipos</option>
                        <option>Usuario</option>
                        <option>Admin</option>
                    </select>
                    <select className="flex-1 sm:flex-none text-sm border border-[#8E1B3A]/15 rounded-lg px-3 sm:px-4 py-2 outline-none text-[#7A5260]">
                        <option>Todos los planes</option>
                        <option>Premium</option>
                        <option>Básico</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24] mb-4">Listado de cuentas</h3>

                {/* Vista mobile: cards */}
                <div className="block lg:hidden space-y-3">
                    {perfilesReales.map((p: PerfilConConteo) => {
                        const esGoogle = p.google_id !== null;
                        const esAdmin = p.tipo === "admin";
                        const planLabel = p.plan || "—";
                        
                        return (
                            <div key={p.id} className="border border-[#8E1B3A]/8 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                        {getAvatar(p.nombre, p.apellido)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[#2A0E18] truncate">{p.nombre} {p.apellido}</p>
                                        <p className="text-xs text-[#7A5260] truncate">{p.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${esAdmin ? "bg-[#8E1B3A]/10 text-[#8E1B3A]" : "bg-[#E6F1FB] text-[#185FA5]"}`}>
                                        {p.tipo}
                                    </span>
                                    {!esAdmin && (
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${planLabel === "premium" ? "bg-[#BC9968]/15 text-[#5C3A2E]" : "bg-[#F1EFE8] text-[#5F5E5A]"}`}>
                                            {planLabel}
                                        </span>
                                    )}
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${esGoogle ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#F1EFE8] text-[#5F5E5A]"}`}>
                                        {esGoogle ? "Google" : "Email"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-[#7A5260]">
                                    <span>Último: {formatFecha(p.updated_at)}</span>
                                    <span>{p._count.pedidos} pedidos</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-xs px-3 py-1.5 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] font-medium hover:opacity-80">Ver</button>
                                    <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FDF5E6] text-[#8C5E08] font-medium hover:opacity-80">Editar</button>
                                    {!esAdmin && (
                                        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FBF0F0] text-[#A32D2D] font-medium hover:opacity-80">Suspender</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Vista desktop: tabla */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {["Perfil", "Email", "Tipo", "Plan", "Auth", "Último acceso", "Pedidos", "Acciones"].map((h) => (
                                    <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {perfilesReales.map((p: PerfilConConteo) => {
                                const esGoogle = p.google_id !== null;
                                const esAdmin = p.tipo === "admin";
                                const planLabel = p.plan || "—";
                                
                                return (
                                    <tr key={p.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                                    {getAvatar(p.nombre, p.apellido)}
                                                </div>
                                                <span className="text-sm font-medium text-[#2A0E18]">{p.nombre} {p.apellido}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-sm text-[#7A5260]">{p.email}</td>
                                        <td className="px-3 py-3">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${esAdmin ? "bg-[#8E1B3A]/10 text-[#8E1B3A]" : "bg-[#E6F1FB] text-[#185FA5]"}`}>
                                                {p.tipo}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            {!esAdmin ? (
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${planLabel === "premium" ? "bg-[#BC9968]/15 text-[#5C3A2E]" : "bg-[#F1EFE8] text-[#5F5E5A]"}`}>
                                                    {planLabel}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-[#B0B0B0]">—</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${esGoogle ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#F1EFE8] text-[#5F5E5A]"}`}>
                                                {esGoogle ? "Google" : "Email"}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-sm text-[#7A5260]">
                                            {formatFecha(p.updated_at)}
                                        </td>
                                        <td className="px-3 py-3 text-sm text-[#2A0E18]">
                                            {esAdmin ? "—" : p._count.pedidos}
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex gap-2">
                                                <button className="text-xs px-3 py-1.5 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] font-medium hover:opacity-80">Ver</button>
                                                <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FDF5E6] text-[#8C5E08] font-medium hover:opacity-80">Editar</button>
                                                {!esAdmin && (
                                                    <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FBF0F0] text-[#A32D2D] font-medium hover:opacity-80">Suspender</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}