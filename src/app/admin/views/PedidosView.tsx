"use client";
import React, { useState, useMemo } from "react";
import { 
  Search, Download, Plus, MoreVertical, 
  ShoppingCart, Clock, Truck, CheckCircle, Edit, Trash2, X, Eye, Calendar, Package, MapPin,
  Check, CheckCheck, XCircle // <-- NUEVOS ICONOS AGREGADOS
} from "lucide-react";

// --- INTERFAZ DE TYPESCRIPT ---
interface Pedido {
  id: number;
  codigo: string;
  fecha: string;
  cliente: string;
  clienteEmail: string;
  clienteIniciales: string;
  clienteColor: string;
  proveedor: string;
  monto: number;
  estado: string;
}
import { exportarACSV } from "../utils/exportCsv";
// --- DATOS INICIALES DE PRUEBA ---
const kpisPedidos = [
  { icon: <ShoppingCart size={20} color="#701030" />, label: "Total Pedidos", valor: "1,024", sub: "+45 esta semana" },
  { icon: <Clock size={20} color="#ca8a04" />, label: "Pendientes", valor: "12", sub: "Requieren acción" },
  { icon: <Package size={20} color="#9333ea" />, label: "En Proceso", valor: "28", sub: "Empaquetando" }, // <-- NUEVA FICHA
  { icon: <Truck size={20} color="#0284c7" />, label: "En Camino", valor: "45", sub: "Con repartidor" },
  { icon: <CheckCircle size={20} color="#16a34a" />, label: "Entregados", valor: "967", sub: "94% de éxito" },
];

const pedidosIniciales: Pedido[] = [
  { id: 1, codigo: "#ORD-1024", fecha: "24 Mar 2026", cliente: "Ana Martínez", clienteEmail: "ana.m@email.com", clienteIniciales: "AM", clienteColor: "#fca5a5", proveedor: "Artesanías Andinas", monto: 150, estado: "Entregado" },
  { id: 2, codigo: "#ORD-1025", fecha: "24 Mar 2026", cliente: "Carlos Ruiz", clienteEmail: "cruiz@email.com", clienteIniciales: "CR", clienteColor: "#93c5fd", proveedor: "Dulce Detalle", monto: 280, estado: "Pendiente" },
  { id: 3, codigo: "#ORD-1026", fecha: "23 Mar 2026", cliente: "Elena Gómez", clienteEmail: "elena.g@email.com", clienteIniciales: "EG", clienteColor: "#d8b4fe", proveedor: "Florería El Rosal", monto: 320, estado: "En Camino" },
  { id: 4, codigo: "#ORD-1027", fecha: "22 Mar 2026", cliente: "Roberto Díaz", clienteEmail: "roberto@email.com", clienteIniciales: "RD", clienteColor: "#fcd34d", proveedor: "Joyería Illimani", monto: 95, estado: "Cancelado" },
  { id: 5, codigo: "#ORD-1028", fecha: "21 Mar 2026", cliente: "Sofía Castro", clienteEmail: "sofia.c@email.com", clienteIniciales: "SC", clienteColor: "#86efac", proveedor: "Dulce Detalle", monto: 120, estado: "Entregado" },
  { id: 6, codigo: "#ORD-1029", fecha: "20 Mar 2026", cliente: "Juan Pérez", clienteEmail: "juanp@email.com", clienteIniciales: "JP", clienteColor: "#cbd5e1", proveedor: "Cuero & Estilo", monto: 210, estado: "En Camino" },
];

// --- COMPONENTES AUXILIARES (Badges) ---
const BadgeEstadoPedido = ({ estado }: { estado: string }) => {
  const estilos: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
    "Pendiente": { bg: "#fef9c3", text: "#ca8a04", icon: <Clock size={14} /> },
    "Confirmado": { bg: "#dcfce7", text: "#059669", icon: <Check size={14} /> },
    "En proceso": { bg: "#f3e8ff", text: "#9333ea", icon: <Package size={14} /> },
    "En Camino": { bg: "#e0f2fe", text: "#0284c7", icon: <Truck size={14} /> },  // <-- AQUÍ ESTABA EL ERROR (antes decía "Enviado")
    "Entregado": { bg: "#d1fae5", text: "#16a34a", icon: <CheckCheck size={14} /> },
    "Cancelado": { bg: "#fee2e2", text: "#ef4444", icon: <XCircle size={14} /> }
  };
  
  const estilo = estilos[estado] || estilos["Pendiente"];

  return (
    <span style={{ 
      display: "inline-flex", 
      alignItems: "center", 
      gap: "6px", 
      background: estilo.bg, 
      color: estilo.text, 
      padding: "4px 10px", 
      borderRadius: "20px", 
      fontSize: "0.8rem", 
      fontWeight: 600 
    }}>
      {estilo.icon}
      {estado}
    </span>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function PedidosView() {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  // Estados de Modales
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formulario, setFormulario] = useState({ id: 0, codigo: "", cliente: "", proveedor: "", monto: 0, estado: "Pendiente" });

  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [pedidoViendo, setPedidoViendo] = useState<Pedido | null>(null);

  // --- LÓGICA DE FILTRADO ---
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((ped) => {
      const termino = busqueda.toLowerCase();
      const coincideBusqueda = ped.codigo.toLowerCase().includes(termino) || ped.cliente.toLowerCase().includes(termino) || ped.proveedor.toLowerCase().includes(termino);
      const coincideEstado = filtroEstado === "Todos" || ped.estado === filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }, [pedidos, busqueda, filtroEstado]);

  const totalPaginas = Math.ceil(pedidosFiltrados.length / itemsPorPagina);
  const datosPaginados = pedidosFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  // --- MANEJADORES DE EVENTOS ---
  const manejarEliminar = (id: number) => {
    if(confirm("¿Estás seguro de que deseas eliminar este pedido? Esta acción es irreversible.")) {
      setPedidos(pedidos.filter(p => p.id !== id));
      setSeleccionados(seleccionados.filter(selectedId => selectedId !== id));
    }
  };
  const manejarExportar = () => {
    // Si hay seleccionados, exportamos esos. Si no, exportamos todos los que estén en pantalla (filtrados).
    const datosAExportar = seleccionados.length > 0 
      ? pedidos.filter(p => seleccionados.includes(p.id)) 
      : pedidosFiltrados; 

    exportarACSV(datosAExportar, "Reporte_Pedidos_Emotia");
  };
  const abrirModalCrear = () => {
    setModoEdicion(false);
    const randomORD = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormulario({ id: 0, codigo: randomORD, cliente: "", proveedor: "", monto: 0, estado: "Pendiente" });
    setModalFormAbierto(true);
  };

  const abrirModalEditar = (ped: Pedido) => {
    setModoEdicion(true);
    setFormulario({ id: ped.id, codigo: ped.codigo, cliente: ped.cliente, proveedor: ped.proveedor, monto: ped.monto, estado: ped.estado });
    setModalFormAbierto(true);
  };

  const abrirDetallePedido = (ped: Pedido) => {
    setPedidoViendo(ped);
    setModalDetalleAbierto(true);
  };

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (modoEdicion) {
      setPedidos(pedidos.map(p => p.id === formulario.id ? { ...p, ...formulario } : p));
    } else {
      const iniciales = formulario.cliente.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase() || "CL";
      const colores = ["#fca5a5", "#93c5fd", "#d8b4fe", "#fcd34d", "#86efac", "#cbd5e1"];
      const colorAzar = colores[Math.floor(Math.random() * colores.length)];
      
      const nuevoPed: Pedido = {
        ...formulario,
        id: Date.now(),
        fecha: "Hoy", // Simulación
        clienteEmail: formulario.cliente.toLowerCase().replace(" ", ".") + "@email.com",
        clienteIniciales: iniciales,
        clienteColor: colorAzar
      };
      setPedidos([nuevoPed, ...pedidos]);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
      
      {/* 1. Cabecera */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: "0 0 0.5rem 0" }}>Gestión de Pedidos</h2>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>Supervisa las compras, envíos y el estado de entrega de los regalos.</p>
      </div>

      {/* 2. KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.25rem" }}> {/* <-- Cambiado a 5 */}
        {kpisPedidos.map((kpi, index) => (
          <div key={index} style={{ background: "white", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {kpi.icon}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{kpi.label}</p>
              <h3 style={{ margin: "0.2rem 0", fontSize: "1.3rem", fontWeight: 700, color: "#111827" }}>
                {index === 0 ? pedidos.length : kpi.valor}
              </h3>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{kpi.sub}</p>
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
                placeholder="Buscar por ID, cliente o proveedor..." 
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.9rem", color: "#374151" }}
              />
            </div>
            
            <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }} style={{ padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#374151", fontSize: "0.9rem" }}>
              <option value="Todos">Filtro por Estado: Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="En proceso">En proceso</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            {/* Nuevo Filtro de Fecha simulado */}
            <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", border: "1px solid #d1d5db", borderRadius: "8px", background: "white", color: "#374151", fontSize: "0.9rem", cursor: "pointer" }}>
              <Calendar size={16} /> Filtrar por fecha
            </button>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
            onClick={manejarExportar} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500 }}
            >
            <Download size={16} /> Exportar
            </button>
            <button onClick={abrirModalCrear} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontSize: "0.9rem", cursor: "pointer", fontWeight: 600, transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#5a0d26"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#701030"}>
              <Plus size={18} /> Nuevo Pedido
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "1000px" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "1rem 1.5rem", width: "40px" }}>
                  <input type="checkbox" checked={seleccionados.length === datosPaginados.length && datosPaginados.length > 0} onChange={manejarSeleccionarTodos} style={{ borderRadius: "4px", cursor: "pointer" }}/>
                </th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>ID Pedido</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Cliente</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Proveedor</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Monto</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Estado</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#6b7280" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.length > 0 ? datosPaginados.map((ped) => (
                <tr key={ped.id} style={{ borderBottom: "1px solid #e5e7eb", background: seleccionados.includes(ped.id) ? "#fff1f2" : "transparent", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = seleccionados.includes(ped.id) ? "#ffe4e6" : "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = seleccionados.includes(ped.id) ? "#fff1f2" : "transparent"}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <input type="checkbox" checked={seleccionados.includes(ped.id)} onChange={() => manejarSeleccion(ped.id)} style={{ borderRadius: "4px", cursor: "pointer" }}/>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <p style={{ margin: 0, fontWeight: 700, color: "#701030", fontSize: "0.95rem" }}>{ped.codigo}</p>
                    <p style={{ margin: "2px 0 0 0", color: "#6b7280", fontSize: "0.8rem" }}>{ped.fecha}</p>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: ped.clienteColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 600, fontSize: "0.85rem" }}>
                        {ped.clienteIniciales}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>{ped.cliente}</p>
                        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem" }}>{ped.clienteEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#374151", fontWeight: 500 }}>
                    {ped.proveedor}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#16a34a", fontWeight: 600 }}>
                    Bs. {ped.monto.toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <BadgeEstadoPedido estado={ped.estado} />
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => abrirDetallePedido(ped)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", padding: "4px" }} title="Ver Detalle">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => abrirModalEditar(ped)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => manejarEliminar(ped.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>No se encontraron pedidos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pedidosFiltrados.length > 0 && (
          <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              Mostrando <span style={{ fontWeight: 600, color: "#111827" }}>{(paginaActual - 1) * itemsPorPagina + 1}</span> a <span style={{ fontWeight: 600, color: "#111827" }}>{Math.min(paginaActual * itemsPorPagina, pedidosFiltrados.length)}</span> de <span style={{ fontWeight: 600, color: "#111827" }}>{pedidosFiltrados.length}</span>
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

      {/* --- MODAL 1: CREAR / EDITAR PEDIDO --- */}
      {modalFormAbierto && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", width: "480px", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={() => setModalFormAbierto(false)} style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}><X size={20} /></button>
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#111827", fontSize: "1.2rem" }}>{modoEdicion ? "Editar Pedido" : "Nuevo Pedido"}</h3>
            
            <form onSubmit={manejarGuardar} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>ID Pedido</label>
                  <input disabled type="text" value={formulario.codigo} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "#f3f4f6", color: "#6b7280" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Monto (Bs.)</label>
                  <input required type="number" min="0" value={formulario.monto} onChange={e => setFormulario({...formulario, monto: Number(e.target.value)})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Nombre del Cliente</label>
                <input required type="text" value={formulario.cliente} onChange={e => setFormulario({...formulario, cliente: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. Mariana López" />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Proveedor Asignado</label>
                  <input required type="text" value={formulario.proveedor} onChange={e => setFormulario({...formulario, proveedor: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. Dulce Detalle" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Estado del Envío</label>
                  <select value={formulario.estado} onChange={e => setFormulario({...formulario, estado: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white" }}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalFormAbierto(false)} style={{ flex: 1, padding: "0.6rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 500, cursor: "pointer" }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer" }}>{modoEdicion ? "Guardar Cambios" : "Crear Pedido"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: TICKET / DETALLE DE PEDIDO --- */}
      {modalDetalleAbierto && pedidoViendo && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050 }}>
          <div style={{ width: "380px", background: "#f8f9fb", borderRadius: "16px", overflow: "hidden", position: "relative", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            
            <div style={{ background: "#701030", padding: "1.5rem", color: "white", position: "relative" }}>
              <button onClick={() => setModalDetalleAbierto(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "4px", borderRadius: "50%", cursor: "pointer" }}><X size={16} /></button>
              <h3 style={{ margin: "0", fontSize: "1.2rem", fontWeight: 700 }}>Resumen de Pedido</h3>
              <p style={{ margin: "4px 0 0 0", color: "#fbcfe8", fontSize: "0.9rem" }}>{pedidoViendo.codigo}</p>
            </div>

            <div style={{ padding: "1.5rem", background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", textTransform: "uppercase" }}>Estado Actual</p>
                  <div style={{ marginTop: "4px" }}><BadgeEstadoPedido estado={pedidoViendo.estado} /></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", textTransform: "uppercase" }}>Fecha</p>
                  <p style={{ margin: "4px 0 0", fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>{pedidoViendo.fecha}</p>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed #d1d5db", borderBottom: "1px dashed #d1d5db", padding: "1.2rem 0", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ background: "#f3f4f6", padding: "8px", borderRadius: "8px", color: "#4b5563" }}><Package size={20} /></div>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>Proveedor</p>
                    <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>{pedidoViendo.proveedor}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ background: "#f3f4f6", padding: "8px", borderRadius: "8px", color: "#4b5563" }}><MapPin size={20} /></div>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>Cliente Destino</p>
                    <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>{pedidoViendo.cliente}</p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>{pedidoViendo.clienteEmail}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f3f4f6", padding: "1rem", borderRadius: "8px" }}>
                <span style={{ fontWeight: 600, color: "#374151" }}>Total Pagado</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#16a34a" }}>Bs. {pedidoViendo.monto.toLocaleString()}</span>
              </div>
              
              <button onClick={() => setModalDetalleAbierto(false)} style={{ width: "100%", marginTop: "1.5rem", padding: "0.8rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 600, cursor: "pointer" }}>
                Cerrar Recibo
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}