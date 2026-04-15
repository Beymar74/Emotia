import prisma from "@/lib/prisma";
import { usuarios } from "@/generated/prisma/client";

type EstadoUsuario = "activo" | "inactivo" | "suspendido";
type Plan = "premium" | "basico";

const estadoPill: Record<EstadoUsuario, string> = {
  activo: "bg-[#EEF8F0] text-[#2D7A47]",
  inactivo: "bg-[#F1EFE8] text-[#5F5E5A]",
  suspendido: "bg-[#FBF0F0] text-[#A32D2D]",
};

const planPill: Record<Plan, string> = {
  premium: "bg-[#BC9968]/15 text-[#5C3A2E]",
  basico: "bg-[#8E1B3A]/8 text-[#8E1B3A]",
};

export default async function UsuariosPage() {
  // --- 1. CONSULTAS A LA BASE DE DATOS ---
  
  // Obtener usuarios reales y contar sus pedidos asociados
  const usuariosReales = await prisma.usuarios.findMany({
    where: { tipo: 'usuario' }, // Excluir admins
    orderBy: { created_at: 'desc' },
    include: {
      _count: {
        select: { pedidos: true } 
      }
    }
  });

  // Tipo combinado para TypeScript: Usuario + el conteo de pedidos
  type UsuarioConConteo = usuarios & { _count: { pedidos: number } };

  // Calcular métricas tipando la 'u' como 'usuarios'
  const totalUsuarios = usuariosReales.length;
  const usuariosPremium = usuariosReales.filter((u: usuarios) => u.plan === 'premium').length;
  const usuariosSuspendidos = usuariosReales.filter((u: usuarios) => u.activo === false).length; 
  const activosEsteMes = usuariosReales.filter((u: usuarios) => u.activo === true).length; 

  // Función para obtener iniciales para el avatar
  const getAvatar = (nombre: string, apellido?: string | null) => {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '?';
    const second = apellido ? apellido.charAt(0).toUpperCase() : '';
    return `${first}${second}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Usuarios & Accesos</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Gestión de usuarios</h1>
        </div>
        <button className="bg-[#8E1B3A] text-white text-sm px-5 py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity self-start sm:self-auto">
          + Nuevo usuario
        </button>
      </div>

      {/* Stats rápidas (Conectadas a BD) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total usuarios", valor: totalUsuarios.toString(), color: "#8E1B3A" },
          { label: "Usuarios premium", valor: usuariosPremium.toString(), color: "#BC9968" },
          { label: "Activos actualmente", valor: activosEsteMes.toString(), color: "#5C3A2E" },
          { label: "Suspendidos/Inactivos", valor: usuariosSuspendidos.toString(), color: "#AB3A50" },
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
            <option>Todos los planes</option>
            <option>Premium</option>
            <option>Básico</option>
          </select>
          <select className="flex-1 sm:flex-none text-sm border border-[#8E1B3A]/15 rounded-lg px-3 sm:px-4 py-2 outline-none text-[#7A5260]">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24]">Listado de usuarios</h3>
          <span className="text-xs sm:text-sm text-[#7A5260]">{totalUsuarios} usuarios</span>
        </div>

        {/* Vista mobile: cards */}
        <div className="block md:hidden space-y-3">
          {usuariosReales.map((u: UsuarioConConteo) => {
            const estadoActual = u.activo ? "activo" : "suspendido"; 
            return (
              <div key={u.id} className="border border-[#8E1B3A]/8 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {getAvatar(u.nombre, u.apellido)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2A0E18] truncate">{u.nombre} {u.apellido}</p>
                    <p className="text-xs text-[#7A5260] truncate">{u.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${planPill[(u.plan || 'basico') as Plan]}`}>
                    {u.plan}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${estadoPill[estadoActual as EstadoUsuario]}`}>
                    {estadoActual}
                  </span>
                  <span className="text-xs text-[#7A5260]">{u._count.pedidos} pedidos</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] font-medium hover:opacity-80">Ver</button>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FDF5E6] text-[#8C5E08] font-medium hover:opacity-80">Editar</button>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FBF0F0] text-[#A32D2D] font-medium hover:opacity-80">Suspender</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vista desktop: tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Usuario", "Email", "Plan", "Pedidos", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuariosReales.map((u: UsuarioConConteo) => {
                const estadoActual = u.activo ? "activo" : "suspendido";
                return (
                  <tr key={u.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {getAvatar(u.nombre, u.apellido)}
                        </div>
                        <span className="text-sm font-medium text-[#2A0E18]">{u.nombre} {u.apellido}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{u.email}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${planPill[(u.plan || 'basico') as Plan]}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#2A0E18]">{u._count.pedidos}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${estadoPill[estadoActual as EstadoUsuario]}`}>
                        {estadoActual}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] font-medium hover:opacity-80">Ver</button>
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FDF5E6] text-[#8C5E08] font-medium hover:opacity-80">Editar</button>
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FBF0F0] text-[#A32D2D] font-medium hover:opacity-80">Suspender</button>
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