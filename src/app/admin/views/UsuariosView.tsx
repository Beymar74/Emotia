"use client";
import React, { useState, useMemo } from "react";
import { 
  Search, Filter, Download, Plus, MoreVertical, 
  Users, UserPlus, Activity, ShieldCheck, Edit, Trash2, X
} from "lucide-react";
import { exportarACSV } from "../utils/exportCsv";

// --- DATOS INICIALES DE PRUEBA ---
const kpisUsuarios = [
  { icon: <Users size={20} color="#701030" />, label: "Usuarios Totales", valor: "2,450", sub: "+180 este mes" },
  { icon: <UserPlus size={20} color="#16a34a" />, label: "Nuevos (Mes)", valor: "180", sub: "+12% vs mes anterior" },
  { icon: <Activity size={20} color="#0284c7" />, label: "Usuarios Activos", valor: "1,820", sub: "74% de la base" },
  { icon: <ShieldCheck size={20} color="#9333ea" />, label: "Proveedores", valor: "145", sub: "Artesanos verificados" },
];

const usuariosIniciales = [
  { id: 1, nombre: "Ana Martínez", email: "ana.martinez@email.com", rol: "Cliente", estado: "Activo", ultimoAcceso: "Hace 2 horas", iniciales: "AM", color: "#fca5a5" },
  { id: 2, nombre: "Carlos Ruiz", email: "carlos.ruiz@artesano.com", rol: "Proveedor", estado: "Activo", ultimoAcceso: "Hace 5 mins", iniciales: "CR", color: "#93c5fd" },
  { id: 3, nombre: "Elena Gómez", email: "elena.gomez@admin.com", rol: "Admin", estado: "Activo", ultimoAcceso: "En línea", iniciales: "EG", color: "#d8b4fe" },
  { id: 4, nombre: "Roberto Díaz", email: "roberto.d@email.com", rol: "Cliente", estado: "Inactivo", ultimoAcceso: "Hace 5 días", iniciales: "RD", color: "#fcd34d" },
  { id: 5, nombre: "Sofía Castro", email: "sofia.castro@email.com", rol: "Proveedor", estado: "Pendiente", ultimoAcceso: "-", iniciales: "SC", color: "#86efac" },
  { id: 6, nombre: "Juan Pérez", email: "juan.p@email.com", rol: "Cliente", estado: "Activo", ultimoAcceso: "Hace 1 día", iniciales: "JP", color: "#cbd5e1" },
];

// --- COMPONENTES AUXILIARES (Badges) ---
const BadgeRol = ({ rol }: { rol: string }) => {
  const estilos: Record<string, { bg: string, text: string }> = {
    "Admin": { bg: "#f3e8ff", text: "#9333ea" },
    "Proveedor": { bg: "#e0f2fe", text: "#0284c7" },
    "Cliente": { bg: "#f1f5f9", text: "#475569" }
  };
  const estilo = estilos[rol] || estilos["Cliente"];
  return (
    <span style={{ background: estilo.bg, color: estilo.text, padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
      {rol}
    </span>
  );
};

const BadgeEstado = ({ estado }: { estado: string }) => {
  const estilos: Record<string, { bg: string, text: string, dot: string }> = {
    "Activo": { bg: "#dcfce7", text: "#16a34a", dot: "#16a34a" },
    "Inactivo": { bg: "#fee2e2", text: "#ef4444", dot: "#ef4444" },
    "Pendiente": { bg: "#fef9c3", text: "#ca8a04", dot: "#ca8a04" }
  };
  const estilo = estilos[estado] || estilos["Activo"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: estilo.bg, color: estilo.text, padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: estilo.dot }}></span>
      {estado}
    </span>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function UsuariosView() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 4;
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  // Estados del Modal (Ahora maneja Creación y Edición)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formularioUsuario, setFormularioUsuario] = useState({ id: 0, nombre: "", email: "", rol: "Cliente", estado: "Activo" });

  // --- LÓGICA DE FILTRADO ---
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((user) => {
      const coincideBusqueda = user.nombre.toLowerCase().includes(busqueda.toLowerCase()) || user.email.toLowerCase().includes(busqueda.toLowerCase());
      const coincideRol = filtroRol === "Todos" || user.rol === filtroRol;
      const coincideEstado = filtroEstado === "Todos" || user.estado === filtroEstado;
      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice((paginaActual - 1) * usuariosPorPagina, paginaActual * usuariosPorPagina);

  // --- MANEJADORES DE EVENTOS (ACCIONES COMPLETAS) ---
  
  // 1. ELIMINAR
  const manejarEliminar = (id: number) => {
    if(confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsuarios(usuarios.filter(u => u.id !== id));
      setSeleccionados(seleccionados.filter(selectedId => selectedId !== id));
    }
  };
  
  // 2. ABRIR MODAL CREAR
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setFormularioUsuario({ id: 0, nombre: "", email: "", rol: "Cliente", estado: "Activo" });
    setModalAbierto(true);
  };

  // 3. ABRIR MODAL EDITAR
  const abrirModalEditar = (usuario: any) => {
    setModoEdicion(true);
    setFormularioUsuario({ 
      id: usuario.id, 
      nombre: usuario.nombre, 
      email: usuario.email, 
      rol: usuario.rol, 
      estado: usuario.estado 
    });
    setModalAbierto(true);
  };

  // 4. GUARDAR USUARIO (CREAR O ACTUALIZAR)
  const manejarGuardarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    const iniciales = formularioUsuario.nombre.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase() || "NN";
    
    if (modoEdicion) {
      // Actualizar usuario existente
      setUsuarios(usuarios.map(u => 
        u.id === formularioUsuario.id 
          ? { ...u, ...formularioUsuario, iniciales } 
          : u
      ));
    } else {
      // Crear nuevo usuario
      const colores = ["#fca5a5", "#93c5fd", "#d8b4fe", "#fcd34d", "#86efac"];
      const colorAzar = colores[Math.floor(Math.random() * colores.length)];
      
      const usuarioCreado = {
        ...formularioUsuario, // Primero esparcimos los datos del formulario (nombre, email, etc.)
        id: Date.now(),       // LUEGO asignamos el ID nuevo para que sobreescriba al 0
        ultimoAcceso: "Recién creado",
        iniciales,
        color: colorAzar
      };
      
      setUsuarios([usuarioCreado, ...usuarios]);
    }
    
    setModalAbierto(false);
  };
  // 5. CAMBIAR ESTADO RÁPIDO (Botón 3 puntos)
  const alternarEstadoRapido = (id: number) => {
    setUsuarios(usuarios.map(u => {
      if (u.id === id) {
        const nuevoEstado = u.estado === "Activo" ? "Inactivo" : "Activo";
        return { ...u, estado: nuevoEstado };
      }
      return u;
    }));
  };

  // Selección y Exportación
  const manejarSeleccionMultiple = (id: number) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const manejarSeleccionarTodos = () => {
    if (seleccionados.length === usuariosPaginados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(usuariosPaginados.map(u => u.id));
    }
  };

  const manejarExportar = () => {
    const datosAExportar = seleccionados.length > 0 
      ? usuarios.filter(u => seleccionados.includes(u.id)) 
      : usuariosFiltrados; 
    exportarACSV(datosAExportar, "Reporte_Usuarios_Emotia");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
      
      {/* Cabecera y KPIs (Ocultos por brevedad, se mantienen igual) */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: "0 0 0.5rem 0" }}>Gestión de Usuarios</h2>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>Administra los usuarios de la plataforma, asigna roles y verifica cuentas.</p>
      </div>

      {/* Tarjetas de KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
        {kpisUsuarios.map((kpi, index) => (
          <div key={index} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {kpi.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>{kpi.label}</p>
              <h3 style={{ margin: "0.2rem 0", fontSize: "1.4rem", fontWeight: 700, color: "#111827" }}>
                {index === 0 ? usuarios.length : kpi.valor}
              </h3>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla y Controles */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        
        {/* Barra de Herramientas */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          
          <div style={{ display: "flex", gap: "1rem", flex: 1, minWidth: "300px" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "320px" }}>
              <Search size={18} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                placeholder="Buscar por nombre o correo..." 
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.9rem", color: "#374151" }}
              />
            </div>
            
            <select value={filtroRol} onChange={(e) => { setFiltroRol(e.target.value); setPaginaActual(1); }} style={{ padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#374151", fontSize: "0.9rem" }}>
              <option value="Todos">Rol: Todos</option>
              <option value="Admin">Admin</option>
              <option value="Proveedor">Proveedor</option>
              <option value="Cliente">Cliente</option>
            </select>

            <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }} style={{ padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#374151", fontSize: "0.9rem" }}>
              <option value="Todos">Estado: Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={manejarExportar} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500 }}>
                <Download size={16} /> Exportar
            </button>
            <button onClick={abrirModalCrear} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontSize: "0.9rem", cursor: "pointer", fontWeight: 600, transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#5a0d26"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#701030"}>
              <Plus size={18} /> Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "1rem 1.5rem", width: "40px" }}>
                  <input type="checkbox" checked={seleccionados.length === usuariosPaginados.length && usuariosPaginados.length > 0} onChange={manejarSeleccionarTodos} style={{ borderRadius: "4px", cursor: "pointer" }}/>
                </th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Usuario</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Rol</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Estado</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Última Conexión</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.length > 0 ? usuariosPaginados.map((usuario) => (
                <tr key={usuario.id} style={{ borderBottom: "1px solid #e5e7eb", background: seleccionados.includes(usuario.id) ? "#fff1f2" : "transparent", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = seleccionados.includes(usuario.id) ? "#ffe4e6" : "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = seleccionados.includes(usuario.id) ? "#fff1f2" : "transparent"}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <input type="checkbox" checked={seleccionados.includes(usuario.id)} onChange={() => manejarSeleccionMultiple(usuario.id)} style={{ borderRadius: "4px", cursor: "pointer" }}/>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: usuario.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 600, fontSize: "0.85rem" }}>
                        {usuario.iniciales}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>{usuario.nombre}</p>
                        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>{usuario.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <BadgeRol rol={usuario.rol} />
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <BadgeEstado estado={usuario.estado} />
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
                    {usuario.ultimoAcceso}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {/* BOTÓN EDITAR */}
                      <button onClick={() => abrirModalEditar(usuario)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }} title="Editar">
                        <Edit size={16} />
                      </button>
                      
                      {/* BOTÓN ELIMINAR */}
                      <button onClick={() => manejarEliminar(usuario.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                      
                      {/* BOTÓN MÁS OPCIONES (Cambiar Estado) */}
                      <button onClick={() => alternarEstadoRapido(usuario.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }} title="Cambiar Estado (Activar/Desactivar)">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>No se encontraron usuarios.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {usuariosFiltrados.length > 0 && (
          <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              Mostrando <span style={{ fontWeight: 600, color: "#111827" }}>{(paginaActual - 1) * usuariosPorPagina + 1}</span> a <span style={{ fontWeight: 600, color: "#111827" }}>{Math.min(paginaActual * usuariosPorPagina, usuariosFiltrados.length)}</span> de <span style={{ fontWeight: 600, color: "#111827" }}>{usuariosFiltrados.length}</span> usuarios
            </span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button disabled={paginaActual === 1} onClick={() => setPaginaActual(p => p - 1)} style={{ padding: "0.4rem 0.8rem", border: "1px solid #d1d5db", background: "white", borderRadius: "6px", cursor: paginaActual === 1 ? "not-allowed" : "pointer", fontSize: "0.85rem", color: "#374151", opacity: paginaActual === 1 ? 0.5 : 1 }}>Anterior</button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pag => (
                <button key={pag} onClick={() => setPaginaActual(pag)} style={{ padding: "0.4rem 0.8rem", border: "none", background: paginaActual === pag ? "#f3f4f6" : "transparent", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: paginaActual === pag ? 600 : 400, color: paginaActual === pag ? "#111827" : "#6b7280" }}>
                  {pag}
                </button>
              ))}
              <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(p => p + 1)} style={{ padding: "0.4rem 0.8rem", border: "1px solid #d1d5db", background: "white", borderRadius: "6px", cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer", fontSize: "0.85rem", color: "#374151", opacity: paginaActual === totalPaginas ? 0.5 : 1 }}>Siguiente</button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL CREAR / EDITAR USUARIO --- */}
      {modalAbierto && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", width: "400px", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={() => setModalAbierto(false)} style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
              <X size={20} />
            </button>
            
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#111827", fontSize: "1.2rem" }}>
              {modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h3>
            
            <form onSubmit={manejarGuardarUsuario} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Nombre Completo</label>
                <input required type="text" value={formularioUsuario.nombre} onChange={e => setFormularioUsuario({...formularioUsuario, nombre: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. Laura Torres" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Correo Electrónico</label>
                <input required type="email" value={formularioUsuario.email} onChange={e => setFormularioUsuario({...formularioUsuario, email: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="laura@ejemplo.com" />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Rol</label>
                  <select value={formularioUsuario.rol} onChange={e => setFormularioUsuario({...formularioUsuario, rol: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white" }}>
                    <option value="Cliente">Cliente</option>
                    <option value="Proveedor">Proveedor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Estado Inicial</label>
                  <select value={formularioUsuario.estado} onChange={e => setFormularioUsuario({...formularioUsuario, estado: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white" }}>
                    <option value="Activo">Activo</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ flex: 1, padding: "0.6rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 500, cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer" }}>
                  {modoEdicion ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}