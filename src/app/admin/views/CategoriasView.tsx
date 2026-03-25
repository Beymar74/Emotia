"use client";
import React, { useState, useMemo } from "react";
import { 
  Search, Download, Plus, MoreVertical, 
  FolderTree, Tags, Gift, Star, Edit, Trash2, X, 
  Cake, Gem, User, TreePine, Coffee
} from "lucide-react";

// --- INTERFAZ DE TYPESCRIPT ---
interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  subcategorias: number;
  productos: number;
  estado: string;
  icono: React.ReactNode;
  colorBg: string;
  colorIcono: string;
}
import { exportarACSV } from "../utils/exportCsv";
// --- DATOS INICIALES DE PRUEBA ---
const kpisCategorias = [
  { icon: <FolderTree size={20} color="#701030" />, label: "Total Categorías", valor: "24", sub: "+3 este mes" },
  { icon: <Tags size={20} color="#16a34a" />, label: "Subcategorías", valor: "86", sub: "+12 organizadas" },
  { icon: <Gift size={20} color="#0284c7" />, label: "Productos Asignados", valor: "1,240", sub: "98% del catálogo" },
  { icon: <Star size={20} color="#ca8a04" />, label: "Categoría más popular", valor: "Cumpleaños", sub: "45% de búsquedas" },
];

const categoriasIniciales: Categoria[] = [
  { id: 1, nombre: "Cumpleaños", descripcion: "Regalos perfectos para celebrar un año más de vida.", tipo: "Ocasión", subcategorias: 8, productos: 340, estado: "Activo", icono: <Cake size={18} />, colorBg: "#f3e8ff", colorIcono: "#9333ea" },
  { id: 2, nombre: "Joyería", descripcion: "Collares, anillos, pulseras y relojes elegantes.", tipo: "Producto", subcategorias: 5, productos: 120, estado: "Activo", icono: <Gem size={18} />, colorBg: "#e0f2fe", colorIcono: "#0284c7" },
  { id: 3, nombre: "Para Ella", descripcion: "Regalos pensados especialmente para mujeres.", tipo: "Destinatario", subcategorias: 12, productos: 450, estado: "Activo", icono: <User size={18} />, colorBg: "#fce7f3", colorIcono: "#db2777" },
  { id: 4, nombre: "Navidad", descripcion: "Colección especial de temporada navideña.", tipo: "Ocasión", subcategorias: 4, productos: 85, estado: "Inactivo", icono: <TreePine size={18} />, colorBg: "#dcfce7", colorIcono: "#16a34a" },
  { id: 5, nombre: "Chocolates", descripcion: "Cajas y arreglos de chocolates artesanales.", tipo: "Producto", subcategorias: 3, productos: 95, estado: "Activo", icono: <Coffee size={18} />, colorBg: "#ffedd5", colorIcono: "#ea580c" },
];

// --- COMPONENTES AUXILIARES (Badges) ---
const BadgeTipo = ({ tipo }: { tipo: string }) => {
  const estilos: Record<string, { bg: string, text: string }> = {
    "Ocasión": { bg: "#f3e8ff", text: "#9333ea" }, // Morado
    "Producto": { bg: "#e0f2fe", text: "#0284c7" }, // Azul
    "Destinatario": { bg: "#fce7f3", text: "#db2777" } // Rosa
  };
  const estilo = estilos[tipo] || { bg: "#f3f4f6", text: "#4b5563" }; 
  return (
    <span style={{ background: estilo.bg, color: estilo.text, padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
      {tipo}
    </span>
  );
};

const BadgeEstado = ({ estado }: { estado: string }) => {
  const estilos: Record<string, { bg: string, text: string, dot: string }> = {
    "Activo": { bg: "#dcfce7", text: "#16a34a", dot: "#16a34a" },
    "Inactivo": { bg: "#fee2e2", text: "#ef4444", dot: "#ef4444" }
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
export default function CategoriasView() {
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  // Estados del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formulario, setFormulario] = useState({ id: 0, nombre: "", descripcion: "", tipo: "Ocasión", estado: "Activo" });

  // --- LÓGICA DE FILTRADO ---
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((cat) => {
      const coincideBusqueda = cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) || cat.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = filtroTipo === "Todos" || cat.tipo === filtroTipo;
      const coincideEstado = filtroEstado === "Todos" || cat.estado === filtroEstado;
      return coincideBusqueda && coincideTipo && coincideEstado;
    });
  }, [categorias, busqueda, filtroTipo, filtroEstado]);

  const totalPaginas = Math.ceil(categoriasFiltradas.length / itemsPorPagina);
  const datosPaginados = categoriasFiltradas.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  // --- MANEJADORES DE EVENTOS ---
  const manejarEliminar = (id: number) => {
    if(confirm("¿Estás seguro de que deseas eliminar esta categoría? Los productos asignados quedarán sin categoría.")) {
      setCategorias(categorias.filter(c => c.id !== id));
      setSeleccionados(seleccionados.filter(selectedId => selectedId !== id));
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setFormulario({ id: 0, nombre: "", descripcion: "", tipo: "Ocasión", estado: "Activo" });
    setModalAbierto(true);
  };

  const abrirModalEditar = (cat: Categoria) => {
    setModoEdicion(true);
    setFormulario({ id: cat.id, nombre: cat.nombre, descripcion: cat.descripcion, tipo: cat.tipo, estado: cat.estado });
    setModalAbierto(true);
  };

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modoEdicion) {
      setCategorias(categorias.map(c => c.id === formulario.id ? { ...c, ...formulario } : c));
    } else {
      // Asignar colores e iconos base dependiendo del tipo (simulación)
      let colorBg = "#f3e8ff", colorIcono = "#9333ea";
      if (formulario.tipo === "Producto") { colorBg = "#e0f2fe"; colorIcono = "#0284c7"; }
      if (formulario.tipo === "Destinatario") { colorBg = "#fce7f3"; colorIcono = "#db2777"; }

      const nuevaCat: Categoria = {
        ...formulario,
        id: Date.now(),
        subcategorias: 0,
        productos: 0,
        icono: <FolderTree size={18} />, // Icono por defecto para nuevas
        colorBg,
        colorIcono
      };
      setCategorias([nuevaCat, ...categorias]);
    }
    setModalAbierto(false);
  };

  const manejarSeleccion = (id: number) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const manejarSeleccionarTodos = () => {
    if (seleccionados.length === datosPaginados.length) setSeleccionados([]);
    else setSeleccionados(datosPaginados.map(c => c.id));
  };
  const manejarExportar = () => {
    const datosAExportar = seleccionados.length > 0 
      ? categorias.filter(c => seleccionados.includes(c.id)) 
      : categoriasFiltradas; 
    exportarACSV(datosAExportar, "Reporte_Categorias_Emotia");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
      
      {/* 1. Cabecera */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: "0 0 0.5rem 0" }}>Gestión de Categorías</h2>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>Organiza los regalos por ocasiones, destinatarios y tipos de producto.</p>
      </div>

      {/* 2. KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
        {kpisCategorias.map((kpi, index) => (
          <div key={index} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {kpi.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>{kpi.label}</p>
              <h3 style={{ margin: "0.2rem 0", fontSize: "1.4rem", fontWeight: 700, color: "#111827" }}>
                {index === 0 ? categorias.length : kpi.valor}
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
                placeholder="Buscar categoría o descripción..." 
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.9rem", color: "#374151" }}
              />
            </div>
            
            <select value={filtroTipo} onChange={(e) => { setFiltroTipo(e.target.value); setPaginaActual(1); }} style={{ padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#374151", fontSize: "0.9rem" }}>
              <option value="Todos">Filtro por Tipo: Todas</option>
              <option value="Ocasión">Ocasión</option>
              <option value="Destinatario">Destinatario</option>
              <option value="Producto">Producto</option>
            </select>

            <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }} style={{ padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#374151", fontSize: "0.9rem" }}>
              <option value="Todos">Estado: Todos</option>
              <option value="Activo">Activo</option>
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
              <Plus size={18} /> Nueva Categoría
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
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Categoría</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Tipo</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Subcategorías</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Productos</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Estado</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.length > 0 ? datosPaginados.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid #e5e7eb", background: seleccionados.includes(cat.id) ? "#fff1f2" : "transparent", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = seleccionados.includes(cat.id) ? "#ffe4e6" : "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = seleccionados.includes(cat.id) ? "#fff1f2" : "transparent"}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <input type="checkbox" checked={seleccionados.includes(cat.id)} onChange={() => manejarSeleccion(cat.id)} style={{ borderRadius: "4px", cursor: "pointer" }}/>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {/* Icono de la categoría */}
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: cat.colorBg, color: cat.colorIcono, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {cat.icono}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>{cat.nombre}</p>
                        <p style={{ margin: "2px 0 0 0", color: "#6b7280", fontSize: "0.8rem", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {cat.descripcion}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <BadgeTipo tipo={cat.tipo} />
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#374151", fontWeight: 500 }}>
                    {cat.subcategorias}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#374151", fontWeight: 500 }}>
                    {cat.productos}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <BadgeEstado estado={cat.estado} />
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => abrirModalEditar(cat)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => manejarEliminar(cat.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }} title="Reordenar o Más Opciones">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>No se encontraron categorías.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {categoriasFiltradas.length > 0 && (
          <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              Mostrando <span style={{ fontWeight: 600, color: "#111827" }}>{(paginaActual - 1) * itemsPorPagina + 1}</span> a <span style={{ fontWeight: 600, color: "#111827" }}>{Math.min(paginaActual * itemsPorPagina, categoriasFiltradas.length)}</span> de <span style={{ fontWeight: 600, color: "#111827" }}>{categoriasFiltradas.length}</span>
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

      {/* --- MODAL CREAR / EDITAR CATEGORÍA --- */}
      {modalAbierto && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", width: "420px", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={() => setModalAbierto(false)} style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
              <X size={20} />
            </button>
            
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#111827", fontSize: "1.2rem" }}>
              {modoEdicion ? "Editar Categoría" : "Crear Nueva Categoría"}
            </h3>
            
            <form onSubmit={manejarGuardar} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Nombre de la Categoría</label>
                <input required type="text" value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. Aniversarios" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Descripción breve</label>
                <textarea required value={formulario.descripcion} onChange={e => setFormulario({...formulario, descripcion: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", resize: "none", height: "60px", fontFamily: "inherit" }} placeholder="Regalos románticos para parejas..." />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Tipo</label>
                  <select value={formulario.tipo} onChange={e => setFormulario({...formulario, tipo: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white" }}>
                    <option value="Ocasión">Ocasión</option>
                    <option value="Producto">Producto</option>
                    <option value="Destinatario">Destinatario</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Estado</label>
                  <select value={formulario.estado} onChange={e => setFormulario({...formulario, estado: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white" }}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ flex: 1, padding: "0.6rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 500, cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer" }}>
                  {modoEdicion ? "Guardar Cambios" : "Crear Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}