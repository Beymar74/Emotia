"use client";
import React, { useState, useMemo } from "react";
import { 
  Search, Download, Plus, MoreVertical, 
  Package, AlertCircle, TrendingUp, Star, Edit, Trash2, X, Image as ImageIcon, Eye
} from "lucide-react";

// --- INTERFAZ DE TYPESCRIPT ---
interface Producto {
  id: number;
  nombre: string;
  sku: string;
  categoria: string;
  precio: number;
  stock: number;
  estado: string;
  colorBg: string; // Para simular la foto del producto
}
import { exportarACSV } from "../utils/exportCsv";
// --- DATOS INICIALES DE PRUEBA ---
const kpisProductos = [
  { icon: <Package size={20} color="#701030" />, label: "Total Productos", valor: "1,240", sub: "+45 este mes" },
  { icon: <AlertCircle size={20} color="#ef4444" />, label: "Bajo Stock", valor: "28", sub: "Requieren atención" },
  { icon: <TrendingUp size={20} color="#16a34a" />, label: "Ticket Promedio", valor: "Bs. 185", sub: "+12% vs mes anterior" },
  { icon: <Star size={20} color="#ca8a04" />, label: "Categoría Top", valor: "Cumpleaños", sub: "34% de ventas" },
];

const productosIniciales: Producto[] = [
  { id: 1, nombre: "Caja Sorpresa Dulce", sku: "REG-001", categoria: "Cumpleaños", precio: 150, stock: 45, estado: "Activo", colorBg: "#fca5a5" },
  { id: 2, nombre: "Collar Plata 925 Corazón", sku: "JOY-042", categoria: "Joyería", precio: 280, stock: 5, estado: "Activo", colorBg: "#93c5fd" },
  { id: 3, nombre: "Arreglo Floral Premium", sku: "FLO-015", categoria: "Florería", precio: 320, stock: 0, estado: "Agotado", colorBg: "#86efac" },
  { id: 4, nombre: "Set de Tazas Pareja", sku: "HOG-088", categoria: "Aniversario", precio: 95, stock: 12, estado: "Activo", colorBg: "#fcd34d" },
  { id: 5, nombre: "Billetera de Cuero Genuino", sku: "MAR-023", categoria: "Para Él", precio: 210, stock: 8, estado: "Activo", colorBg: "#d8b4fe" },
  { id: 6, nombre: "Cesta de Desayuno VIP", sku: "REG-055", categoria: "Cumpleaños", precio: 250, stock: 15, estado: "Oculto", colorBg: "#cbd5e1" },
];

// --- COMPONENTES AUXILIARES ---
const BadgeCategoria = ({ categoria }: { categoria: string }) => {
  const estilos: Record<string, { bg: string, text: string }> = {
    "Cumpleaños": { bg: "#f3e8ff", text: "#9333ea" },
    "Joyería": { bg: "#e0f2fe", text: "#0284c7" },
    "Florería": { bg: "#dcfce7", text: "#16a34a" },
    "Aniversario": { bg: "#fce7f3", text: "#db2777" },
    "Para Él": { bg: "#e0e7ff", text: "#4f46e5" }
  };
  const estilo = estilos[categoria] || { bg: "#f3f4f6", text: "#4b5563" }; 
  return (
    <span style={{ background: estilo.bg, color: estilo.text, padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
      {categoria}
    </span>
  );
};

const BadgeEstado = ({ estado }: { estado: string }) => {
  const estilos: Record<string, { bg: string, text: string, dot: string }> = {
    "Activo": { bg: "#dcfce7", text: "#16a34a", dot: "#16a34a" },
    "Agotado": { bg: "#fee2e2", text: "#ef4444", dot: "#ef4444" },
    "Oculto": { bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af" }
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
export default function ProductosView() {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroStock, setFiltroStock] = useState("Todos");
  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  // Estados del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formulario, setFormulario] = useState({ id: 0, nombre: "", sku: "", categoria: "Cumpleaños", precio: 0, stock: 0, estado: "Activo" });

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) || prod.sku.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = filtroCategoria === "Todas" || prod.categoria === filtroCategoria;
      
      let coincideStock = true;
      if (filtroStock === "En Stock") coincideStock = prod.stock > 0;
      if (filtroStock === "Bajo Stock") coincideStock = prod.stock > 0 && prod.stock <= 10;
      if (filtroStock === "Agotado") coincideStock = prod.stock === 0;

      return coincideBusqueda && coincideCategoria && coincideStock;
    });
  }, [productos, busqueda, filtroCategoria, filtroStock]);

  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const datosPaginados = productosFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  // --- MANEJADORES DE EVENTOS ---
  const manejarEliminar = (id: number) => {
    if(confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setProductos(productos.filter(p => p.id !== id));
      setSeleccionados(seleccionados.filter(selectedId => selectedId !== id));
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    // Generar un SKU aleatorio básico como sugerencia
    const randomSKU = `REG-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    setFormulario({ id: 0, nombre: "", sku: randomSKU, categoria: "Cumpleaños", precio: 0, stock: 1, estado: "Activo" });
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod: Producto) => {
    setModoEdicion(true);
    setFormulario({ id: prod.id, nombre: prod.nombre, sku: prod.sku, categoria: prod.categoria, precio: prod.precio, stock: prod.stock, estado: prod.estado });
    setModalAbierto(true);
  };

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-ajustar estado según el stock si es necesario
    let estadoFinal = formulario.estado;
    if (formulario.stock === 0 && formulario.estado === "Activo") {
      estadoFinal = "Agotado";
    }

    if (modoEdicion) {
      setProductos(productos.map(p => p.id === formulario.id ? { ...p, ...formulario, estado: estadoFinal } : p));
    } else {
      const colores = ["#fca5a5", "#93c5fd", "#d8b4fe", "#fcd34d", "#86efac", "#cbd5e1"];
      const colorAzar = colores[Math.floor(Math.random() * colores.length)];

      const nuevoProd: Producto = {
        ...formulario,
        id: Date.now(), // <-- Aplicado el orden correcto para TypeScript
        estado: estadoFinal,
        colorBg: colorAzar
      };
      setProductos([nuevoProd, ...productos]);
    }
    setModalAbierto(false);
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
      ? productos.filter(p => seleccionados.includes(p.id)) 
      : productosFiltrados; 
    exportarACSV(datosAExportar, "Reporte_Productos_Emotia");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
      
      {/* 1. Cabecera */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: "0 0 0.5rem 0" }}>Gestión de Productos</h2>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>Catálogo de regalos, control de inventario y precios.</p>
      </div>

      {/* 2. KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
        {kpisProductos.map((kpi, index) => (
          <div key={index} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {kpi.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>{kpi.label}</p>
              <h3 style={{ margin: "0.2rem 0", fontSize: "1.4rem", fontWeight: 700, color: "#111827" }}>
                {index === 0 ? productos.length : kpi.valor}
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
                placeholder="Buscar producto o SKU..." 
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.9rem", color: "#374151" }}
              />
            </div>
            
            <select value={filtroCategoria} onChange={(e) => { setFiltroCategoria(e.target.value); setPaginaActual(1); }} style={{ padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#374151", fontSize: "0.9rem" }}>
              <option value="Todas">Categoría: Todas</option>
              <option value="Cumpleaños">Cumpleaños</option>
              <option value="Joyería">Joyería</option>
              <option value="Florería">Florería</option>
              <option value="Aniversario">Aniversario</option>
              <option value="Para Él">Para Él</option>
            </select>

            <select value={filtroStock} onChange={(e) => { setFiltroStock(e.target.value); setPaginaActual(1); }} style={{ padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#374151", fontSize: "0.9rem" }}>
              <option value="Todos">Stock: Todos</option>
              <option value="En Stock">En Stock</option>
              <option value="Bajo Stock">Bajo Stock (&lt; 10)</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={manejarExportar} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500 }}>
                <Download size={16} /> Exportar
            </button>
            <button onClick={abrirModalCrear} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontSize: "0.9rem", cursor: "pointer", fontWeight: 600, transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#5a0d26"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#701030"}>
              <Plus size={18} /> Nuevo Producto
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "950px" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "1rem 1.5rem", width: "40px" }}>
                  <input type="checkbox" checked={seleccionados.length === datosPaginados.length && datosPaginados.length > 0} onChange={manejarSeleccionarTodos} style={{ borderRadius: "4px", cursor: "pointer" }}/>
                </th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Producto</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Categoría</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Precio</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Stock</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Estado</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.length > 0 ? datosPaginados.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: "1px solid #e5e7eb", background: seleccionados.includes(prod.id) ? "#fff1f2" : "transparent", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = seleccionados.includes(prod.id) ? "#ffe4e6" : "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = seleccionados.includes(prod.id) ? "#fff1f2" : "transparent"}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <input type="checkbox" checked={seleccionados.includes(prod.id)} onChange={() => manejarSeleccion(prod.id)} style={{ borderRadius: "4px", cursor: "pointer" }}/>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {/* Cuadro simulando la foto del producto */}
                      <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: prod.colorBg, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                        <ImageIcon size={20} opacity={0.8} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>{prod.nombre}</p>
                        <p style={{ margin: "2px 0 0 0", color: "#6b7280", fontSize: "0.8rem", letterSpacing: "0.5px" }}>
                          SKU: {prod.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <BadgeCategoria categoria={prod.categoria} />
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#111827", fontWeight: 600 }}>
                    Bs. {prod.precio.toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {/* Lógica visual para alertar bajo stock */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ 
                        width: "8px", height: "8px", borderRadius: "50%", 
                        background: prod.stock === 0 ? "#ef4444" : (prod.stock <= 10 ? "#f59e0b" : "#16a34a") 
                      }}></span>
                      <span style={{ fontWeight: 500, color: prod.stock === 0 ? "#ef4444" : "#374151" }}>
                        {prod.stock} unids.
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <BadgeEstado estado={prod.estado} />
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => alert("Vista previa del producto en tienda...")} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", padding: "4px" }} title="Ver en tienda">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => abrirModalEditar(prod)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => manejarEliminar(prod.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>No se encontraron productos en el catálogo.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {productosFiltrados.length > 0 && (
          <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              Mostrando <span style={{ fontWeight: 600, color: "#111827" }}>{(paginaActual - 1) * itemsPorPagina + 1}</span> a <span style={{ fontWeight: 600, color: "#111827" }}>{Math.min(paginaActual * itemsPorPagina, productosFiltrados.length)}</span> de <span style={{ fontWeight: 600, color: "#111827" }}>{productosFiltrados.length}</span>
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

      {/* --- MODAL CREAR / EDITAR PRODUCTO --- */}
      {modalAbierto && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", width: "480px", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={() => setModalAbierto(false)} style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
              <X size={20} />
            </button>
            
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#111827", fontSize: "1.2rem" }}>
              {modoEdicion ? "Editar Producto" : "Crear Nuevo Producto"}
            </h3>
            
            <form onSubmit={manejarGuardar} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Nombre del Producto</label>
                <input required type="text" value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. Taza de Cerámica" />
              </div>
              
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>SKU (Código)</label>
                  <input required type="text" value={formulario.sku} onChange={e => setFormulario({...formulario, sku: e.target.value.toUpperCase()})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. TAZ-001" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Categoría</label>
                  <select value={formulario.categoria} onChange={e => setFormulario({...formulario, categoria: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white" }}>
                    <option value="Cumpleaños">Cumpleaños</option>
                    <option value="Joyería">Joyería</option>
                    <option value="Florería">Florería</option>
                    <option value="Aniversario">Aniversario</option>
                    <option value="Para Él">Para Él</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Precio (Bs.)</label>
                  <input required type="number" min="0" value={formulario.precio} onChange={e => setFormulario({...formulario, precio: Number(e.target.value)})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Stock Inicial</label>
                  <input required type="number" min="0" value={formulario.stock} onChange={e => setFormulario({...formulario, stock: Number(e.target.value)})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Estado</label>
                  <select value={formulario.estado} onChange={e => setFormulario({...formulario, estado: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white" }}>
                    <option value="Activo">Activo</option>
                    <option value="Agotado">Agotado</option>
                    <option value="Oculto">Oculto</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ flex: 1, padding: "0.6rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 500, cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer" }}>
                  {modoEdicion ? "Guardar Cambios" : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}