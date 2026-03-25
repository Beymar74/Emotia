"use client";
import React, { useState, useMemo } from "react";
import { 
  Search, Filter, Download, Plus, 
  Store, Package, Star, TrendingUp, Edit, Trash2, X, MapPin, Eye, ExternalLink
} from "lucide-react";

// --- INTERFAZ DE TYPESCRIPT ---
interface Proveedor {
  id: number;
  nombre: string;
  ubicacion: string;
  especialidad: string;
  estado: string;
  calificacion: string;
  resenas: string;
  iniciales: string;
  color: string;
  productos: number;
  ventas: number;
}
import { exportarACSV } from "../utils/exportCsv";
// --- DATOS INICIALES DE PRUEBA ---
const kpisProveedores = [
  { icon: <Store size={20} color="#701030" />, label: "Total Proveedores", valor: "145", sub: "+12% activos" },
  { icon: <Package size={20} color="#16a34a" />, label: "Productos Activos", valor: "1,240", sub: "+8% catálogo" },
  { icon: <Star size={20} color="#ca8a04" />, label: "Calificación Promedio", valor: "4.8", sub: "Basado en 3k reseñas" },
  { icon: <TrendingUp size={20} color="#0284c7" />, label: "Ventas Generadas", valor: "Bs. 45,200", sub: "+15% este mes" },
];

const proveedoresIniciales: Proveedor[] = [
  { id: 1, nombre: "Artesanías Andinas", ubicacion: "La Paz, Bolivia", especialidad: "Artesanía", estado: "Activo", calificacion: "4.9", resenas: "120", iniciales: "AA", color: "#fca5a5", productos: 45, ventas: 14500 },
  { id: 2, nombre: "Dulce Detalle", ubicacion: "El Alto, Bolivia", especialidad: "Repostería", estado: "Activo", calificacion: "4.8", resenas: "85", iniciales: "DD", color: "#93c5fd", productos: 24, ventas: 8300 },
  { id: 3, nombre: "Joyería Illimani", ubicacion: "La Paz, Bolivia", especialidad: "Joyería", estado: "En revisión", calificacion: "Nuevo", resenas: "0", iniciales: "JI", color: "#d8b4fe", productos: 12, ventas: 0 },
  { id: 4, nombre: "Cuero & Estilo", ubicacion: "Cochabamba, Bolivia", especialidad: "Marroquinería", estado: "Activo", calificacion: "4.7", resenas: "42", iniciales: "CE", color: "#fcd34d", productos: 30, ventas: 12100 },
  { id: 5, nombre: "Florería El Rosal", ubicacion: "Santa Cruz, Bolivia", especialidad: "Florería", estado: "Inactivo", calificacion: "4.5", resenas: "210", iniciales: "FR", color: "#86efac", productos: 15, ventas: 4500 },
  { id: 6, nombre: "Tejidos del Sol", ubicacion: "Sucre, Bolivia", especialidad: "Textiles", estado: "Activo", calificacion: "4.9", resenas: "56", iniciales: "TS", color: "#cbd5e1", productos: 60, ventas: 25200 },
];

// --- COMPONENTES AUXILIARES (Badges) ---
const BadgeEspecialidad = ({ especialidad }: { especialidad: string }) => {
  const estilos: Record<string, { bg: string, text: string }> = {
    "Artesanía": { bg: "#ffedd5", text: "#ea580c" },
    "Repostería": { bg: "#fce7f3", text: "#db2777" },
    "Joyería": { bg: "#fef08a", text: "#854d0e" },
    "Marroquinería": { bg: "#e0e7ff", text: "#4f46e5" },
    "Florería": { bg: "#dcfce7", text: "#16a34a" },
    "Textiles": { bg: "#fae8ff", text: "#c026d3" }
  };
  const estilo = estilos[especialidad] || { bg: "#f3f4f6", text: "#4b5563" }; 
  return (
    <span style={{ background: estilo.bg, color: estilo.text, padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
      {especialidad}
    </span>
  );
};

const BadgeEstado = ({ estado }: { estado: string }) => {
  const estilos: Record<string, { bg: string, text: string, dot: string }> = {
    "Activo": { bg: "#dcfce7", text: "#16a34a", dot: "#16a34a" },
    "Inactivo": { bg: "#fee2e2", text: "#ef4444", dot: "#ef4444" },
    "En revisión": { bg: "#fef9c3", text: "#ca8a04", dot: "#ca8a04" }
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
export default function ProveedoresView() {
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  // Estados de Modales
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formulario, setFormulario] = useState({ id: 0, nombre: "", ubicacion: "", especialidad: "Artesanía", estado: "Activo" });

  // Estado del Mini-Perfil
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false);
  const [proveedorViendo, setProveedorViendo] = useState<Proveedor | null>(null);

  // --- LÓGICA DE FILTRADO ---
  const proveedoresFiltrados = useMemo(() => {
    return proveedores.filter((prov) => {
      const coincideBusqueda = prov.nombre.toLowerCase().includes(busqueda.toLowerCase()) || prov.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEspecialidad = filtroEspecialidad === "Todas" || prov.especialidad === filtroEspecialidad;
      const coincideEstado = filtroEstado === "Todos" || prov.estado === filtroEstado;
      return coincideBusqueda && coincideEspecialidad && coincideEstado;
    });
  }, [proveedores, busqueda, filtroEspecialidad, filtroEstado]);

  const totalPaginas = Math.ceil(proveedoresFiltrados.length / itemsPorPagina);
  const datosPaginados = proveedoresFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  // --- MANEJADORES DE EVENTOS ---
  const manejarEliminar = (id: number) => {
    if(confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      setProveedores(proveedores.filter(p => p.id !== id));
      setSeleccionados(seleccionados.filter(selectedId => selectedId !== id));
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setFormulario({ id: 0, nombre: "", ubicacion: "", especialidad: "Artesanía", estado: "En revisión" });
    setModalFormAbierto(true);
  };

  const abrirModalEditar = (prov: Proveedor) => {
    setModoEdicion(true);
    setFormulario({ id: prov.id, nombre: prov.nombre, ubicacion: prov.ubicacion, especialidad: prov.especialidad, estado: prov.estado });
    setModalFormAbierto(true);
  };

  const abrirMiniPerfil = (prov: Proveedor) => {
    setProveedorViendo(prov);
    setModalPerfilAbierto(true);
  };

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    const iniciales = formulario.nombre.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase() || "PP";
    
    if (modoEdicion) {
      setProveedores(proveedores.map(p => p.id === formulario.id ? { ...p, ...formulario, iniciales } : p));
    } else {
      const colores = ["#fca5a5", "#93c5fd", "#d8b4fe", "#fcd34d", "#86efac", "#cbd5e1"];
      const colorAzar = colores[Math.floor(Math.random() * colores.length)];
      
      const nuevoProv: Proveedor = {
        ...formulario,
        id: Date.now(),
        calificacion: "Nuevo",
        resenas: "0",
        iniciales,
        color: colorAzar,
        productos: 0, 
        ventas: 0
      };
      setProveedores([nuevoProv, ...proveedores]);
    }
    setModalFormAbierto(false);
  };

  const manejarSeleccion = (id: number) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const manejarSeleccionarTodos = () => {
    if (seleccionados.length === datosPaginados.length) setSeleccionados([]);
    else setSeleccionados(datosPaginados.map(p => p.id));
  };
  const manejarExportar = () => {
    const datosAExportar = seleccionados.length > 0 
      ? proveedores.filter(p => seleccionados.includes(p.id)) 
      : proveedoresFiltrados; 
    exportarACSV(datosAExportar, "Reporte_Proveedores_Emotia");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
      
      {/* 1. Cabecera */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: "0 0 0.5rem 0" }}>Directorio de Proveedores</h2>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>Gestiona los artesanos, tiendas y marcas asociadas a la plataforma.</p>
      </div>

      {/* 2. KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
        {kpisProveedores.map((kpi, index) => (
          <div key={index} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {kpi.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>{kpi.label}</p>
              <h3 style={{ margin: "0.2rem 0", fontSize: "1.4rem", fontWeight: 700, color: "#111827" }}>
                {index === 0 ? proveedores.length : kpi.valor}
              </h3>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Tabla y Controles */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        
        {/* Herramientas */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", flex: 1, minWidth: "300px" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "340px" }}>
              <Search size={18} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                placeholder="Buscar por nombre o ubicación..." 
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.9rem", color: "#374151" }}
              />
            </div>
            
            <select value={filtroEspecialidad} onChange={(e) => { setFiltroEspecialidad(e.target.value); setPaginaActual(1); }} style={{ padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#374151", fontSize: "0.9rem" }}>
              <option value="Todas">Especialidad: Todas</option>
              <option value="Artesanía">Artesanía</option>
              <option value="Repostería">Repostería</option>
              <option value="Joyería">Joyería</option>
              <option value="Marroquinería">Marroquinería</option>
              <option value="Florería">Florería</option>
              <option value="Textiles">Textiles</option>
            </select>

            <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }} style={{ padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#374151", fontSize: "0.9rem" }}>
              <option value="Todos">Estado: Todos</option>
              <option value="Activo">Activo</option>
              <option value="En revisión">En revisión</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={manejarExportar} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500 }}>
                <Download size={16} /> Exportar
            </button>
            <button onClick={abrirModalCrear} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontSize: "0.9rem", cursor: "pointer", fontWeight: 600, transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#5a0d26"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#701030"}>
              <Plus size={18} /> Nuevo Proveedor
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "900px" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "1rem 1.5rem", width: "40px" }}>
                  <input type="checkbox" checked={seleccionados.length === datosPaginados.length && datosPaginados.length > 0} onChange={manejarSeleccionarTodos} style={{ borderRadius: "4px", cursor: "pointer" }}/>
                </th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Proveedor</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Especialidad</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Productos</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Ventas Totales</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Estado</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Calificación</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.length > 0 ? datosPaginados.map((prov) => (
                <tr key={prov.id} style={{ borderBottom: "1px solid #e5e7eb", background: seleccionados.includes(prov.id) ? "#fff1f2" : "transparent", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = seleccionados.includes(prov.id) ? "#ffe4e6" : "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = seleccionados.includes(prov.id) ? "#fff1f2" : "transparent"}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <input type="checkbox" checked={seleccionados.includes(prov.id)} onChange={() => manejarSeleccion(prov.id)} style={{ borderRadius: "4px", cursor: "pointer" }}/>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: prov.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 600, fontSize: "0.9rem" }}>
                        {prov.iniciales}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>{prov.nombre}</p>
                        <p style={{ margin: "2px 0 0 0", color: "#6b7280", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={12} /> {prov.ubicacion}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <BadgeEspecialidad especialidad={prov.especialidad} />
                  </td>
                  {/* COLUMNA PRODUCTOS */}
                  <td style={{ padding: "1rem 1.5rem", color: "#374151", fontWeight: 500 }}>
                    {prov.productos}
                  </td>
                  {/* COLUMNA VENTAS (EN Bs.) */}
                  <td style={{ padding: "1rem 1.5rem", color: "#16a34a", fontWeight: 600 }}>
                    Bs. {prov.ventas.toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <BadgeEstado estado={prov.estado} />
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Star size={16} fill={prov.calificacion !== "Nuevo" ? "#facc15" : "none"} color={prov.calificacion !== "Nuevo" ? "#facc15" : "#9ca3af"} />
                      <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem" }}>{prov.calificacion}</span>
                      {prov.calificacion !== "Nuevo" && <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>({prov.resenas})</span>}
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {/* BOTÓN OJO (Abre Mini Perfil) */}
                      <button onClick={() => abrirMiniPerfil(prov)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", padding: "4px" }} title="Ver perfil de la tienda">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => abrirModalEditar(prov)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => manejarEliminar(prov.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>No se encontraron proveedores.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {proveedoresFiltrados.length > 0 && (
          <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              Mostrando <span style={{ fontWeight: 600, color: "#111827" }}>{(paginaActual - 1) * itemsPorPagina + 1}</span> a <span style={{ fontWeight: 600, color: "#111827" }}>{Math.min(paginaActual * itemsPorPagina, proveedoresFiltrados.length)}</span> de <span style={{ fontWeight: 600, color: "#111827" }}>{proveedoresFiltrados.length}</span>
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

      {/* =========================================
          MODAL 1: CREAR / EDITAR PROVEEDOR
      ============================================= */}
      {modalFormAbierto && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          {/* ... Mismo contenido del formulario que ya tenías ... */}
          <div style={{ background: "white", width: "420px", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={() => setModalFormAbierto(false)} style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}><X size={20} /></button>
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#111827", fontSize: "1.2rem" }}>{modoEdicion ? "Editar Proveedor" : "Crear Nuevo Proveedor"}</h3>
            
            <form onSubmit={manejarGuardar} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Nombre de la Tienda / Artesano</label>
                <input required type="text" value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. Cerámicas del Valle" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Ubicación</label>
                <div style={{ position: "relative" }}>
                  <MapPin size={16} color="#9ca3af" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                  <input required type="text" value={formulario.ubicacion} onChange={e => setFormulario({...formulario, ubicacion: e.target.value})} style={{ width: "100%", padding: "0.6rem 0.6rem 0.6rem 2.2rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. La Paz, Bolivia" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Especialidad</label>
                  <select value={formulario.especialidad} onChange={e => setFormulario({...formulario, especialidad: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white" }}>
                    <option value="Artesanía">Artesanía</option>
                    <option value="Repostería">Repostería</option>
                    <option value="Joyería">Joyería</option>
                    <option value="Marroquinería">Marroquinería</option>
                    <option value="Florería">Florería</option>
                    <option value="Textiles">Textiles</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Estado Inicial</label>
                  <select value={formulario.estado} onChange={e => setFormulario({...formulario, estado: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white" }}>
                    <option value="Activo">Activo</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalFormAbierto(false)} style={{ flex: 1, padding: "0.6rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 500, cursor: "pointer" }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer" }}>{modoEdicion ? "Guardar Cambios" : "Crear Proveedor"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL 2: MINI-PERFIL ESTILO STEAM
      ============================================= */}
      {modalPerfilAbierto && proveedorViendo && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050 }}>
          
          <div style={{ width: "360px", background: "#5D322C", borderRadius: "16px", overflow: "hidden", color: "white", position: "relative", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)", border: "1px solid #9D6450" }}>
            
            {/* Banner Superior con Degradado */}
            <div style={{ 
              height: "60px", // AJUSTADO: Antes 80px, reducido para que no tape tanto
              background: `linear-gradient(135deg, #5D1026, #AC8B5D)`, 
              position: "relative" 
            }}>
              <button onClick={() => setModalPerfilAbierto(false)} style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.4)", border: "none", color: "white", padding: "6px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "0 1.5rem" }}>
              {/* Avatar Flotante */}
              <div style={{ 
                width: "76px", 
                height: "76px", 
                borderRadius: "16px", 
                background: proveedorViendo.color, 
                border: "4px solid #5D322C", 
                marginTop: "15px", // AJUSTADO: Antes -38px, más negativo para SUBIRLO más sobre la barra
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "2rem", 
                fontWeight: "bold", 
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)" 
              }}>
                {proveedorViendo.iniciales}
              </div>

              {/* Información Principal (Sin cambios) */}
              <div style={{ marginTop: "0.8rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#F5E6D0" }}>{proveedorViendo.nombre}</h3>
                <p style={{ margin: "4px 0 0", color: "#E5BDC2", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={14}/> {proveedorViendo.ubicacion}
                </p>
              </div>

              {/* Badges, Estadísticas y Botón (Sin cambios, se mantienen igual) */}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <BadgeEspecialidad especialidad={proveedorViendo.especialidad} />
                <BadgeEstado estado={proveedorViendo.estado} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem", background: "rgba(0,0,0,0.15)", padding: "1.2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#E5BDC2", textTransform: "uppercase", letterSpacing: "0.5px" }}>Productos</p>
                  <p style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 600 }}>{proveedorViendo.productos}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#E5BDC2", textTransform: "uppercase", letterSpacing: "0.5px" }}>Ventas</p>
                  <p style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 600, color: "#F5E6D0" }}>Bs. {proveedorViendo.ventas.toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#E5BDC2", textTransform: "uppercase", letterSpacing: "0.5px" }}>Calificación</p>
                  <p style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Star size={16} fill="#Facc15" color="#Facc15" /> {proveedorViendo.calificacion}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#E5BDC2", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reseñas</p>
                  <p style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 600 }}>{proveedorViendo.resenas}</p>
                </div>
              </div>

              <button style={{ width: "100%", margin: "1.5rem 0", padding: "0.8rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#5D1026"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#701030"}>
                Ver perfil completo <ExternalLink size={16} />
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}