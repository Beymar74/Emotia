"use client";
import React, { useState } from "react";
import { Eye, Clock, CheckCircle2, Package, Truck, XCircle } from "lucide-react";

// Los datos calcados de tu imagen
const pedidosMock = [
  { id: "#2048", cliente: "María García", producto: "Caja de Chocolates", cant: 2, total: "$1,700", estado: "Pendiente", fecha: "2026-02-28" },
  { id: "#2047", cliente: "Carlos López", producto: "Set de Vinos", cant: 1, total: "$2,200", estado: "Confirmado", fecha: "2026-02-27" },
  { id: "#2046", cliente: "Ana Martínez", producto: "Cena para Dos", cant: 1, total: "$3,200", estado: "En proceso", fecha: "2026-02-26" },
  { id: "#2045", cliente: "Pedro Sánchez", producto: "Chocolates", cant: 3, total: "$2,550", estado: "Enviado", fecha: "2026-02-25" },
  { id: "#2044", cliente: "Laura Díaz", producto: "Set de Vinos", cant: 2, total: "$4,400", estado: "Entregado", fecha: "2026-02-24" },
  { id: "#2043", cliente: "Roberto Ruiz", producto: "Canasta Navideña", cant: 1, total: "$1,500", estado: "Cancelado", fecha: "2026-02-23" },
];

const filtros = ["Todos", "Pendiente", "Confirmado", "En proceso", "Enviado", "Entregado", "Cancelado"];

// Configuración visual para cada estado (colores e íconos)
const configEstado: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Pendiente":  { bg: "rgba(234, 179, 8, 0.15)",  text: "#ca8a04", icon: <Clock size={14} /> },
  "Confirmado": { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6", icon: <CheckCircle2 size={14} /> },
  "En proceso": { bg: "rgba(168, 85, 247, 0.15)", text: "#a855f7", icon: <Package size={14} /> },
  "Enviado":    { bg: "rgba(99, 102, 241, 0.15)", text: "#6366f1", icon: <Truck size={14} /> },
  "Entregado":  { bg: "rgba(34, 197, 94, 0.15)",  text: "#16a34a", icon: <CheckCircle2 size={14} /> },
  "Cancelado":  { bg: "rgba(239, 68, 68, 0.15)",  text: "#dc2626", icon: <XCircle size={14} /> },
};

export default function PedidosView() {
  const [filtroActivo, setFiltroActivo] = useState("Todos");

  // Filtramos los pedidos según el botón seleccionado
  const pedidosFiltrados = filtroActivo === "Todos" 
    ? pedidosMock 
    : pedidosMock.filter(p => p.estado === filtroActivo);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Contenedor principal blanco */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
        
        {/* Píldoras de Filtro */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {filtros.map(filtro => (
            <button
              key={filtro}
              onClick={() => setFiltroActivo(filtro)}
              style={{
                padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: 500,
                cursor: "pointer", transition: "all 0.2s",
                // Si está activo es Guindo, si no, es blanco con borde gris
                background: filtroActivo === filtro ? "#9B2335" : "white",
                color: filtroActivo === filtro ? "white" : "#6b7280",
                border: filtroActivo === filtro ? "1px solid #9B2335" : "1px solid #e5e7eb",
              }}
            >
              {filtro}
            </button>
          ))}
        </div>

        {/* Tabla de Pedidos */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {["PEDIDO", "CLIENTE", "PRODUCTO", "CANT.", "TOTAL", "ESTADO", "FECHA", "ACCIONES"].map((header) => (
                  <th key={header} style={{ 
                    padding: "1rem 1rem", fontSize: "0.75rem", fontWeight: 600, 
                    color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em",
                    textAlign: header === "ACCIONES" ? "right" : "left"
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => {
                const config = configEstado[pedido.estado];
                return (
                  <tr key={pedido.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {/* ID de pedido en guindo */}
                    <td style={{ padding: "1.2rem 1rem", fontWeight: 600, color: "#9B2335", fontSize: "0.9rem" }}>{pedido.id}</td>
                    <td style={{ padding: "1.2rem 1rem", fontWeight: 500, color: "#111827", fontSize: "0.9rem" }}>{pedido.cliente}</td>
                    <td style={{ padding: "1.2rem 1rem", color: "#6b7280", fontSize: "0.9rem" }}>{pedido.producto}</td>
                    <td style={{ padding: "1.2rem 1rem", color: "#6b7280", fontSize: "0.9rem" }}>{pedido.cant}</td>
                    <td style={{ padding: "1.2rem 1rem", fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>{pedido.total}</td>
                    
                    {/* Estado con ícono y colores dinámicos */}
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <span style={{ 
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        background: config.bg, color: config.text,
                        padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 600
                      }}>
                        {config.icon}
                        {pedido.estado}
                      </span>
                    </td>
                    
                    <td style={{ padding: "1.2rem 1rem", color: "#6b7280", fontSize: "0.9rem" }}>{pedido.fecha}</td>
                    
                    {/* Botón de acción (Ojo) */}
                    <td style={{ padding: "1.2rem 1rem", textAlign: "right" }}>
                      <button style={{ 
                        background: "none", border: "none", color: "#9ca3af", 
                        cursor: "pointer", padding: "0.25rem", transition: "color 0.2s" 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#4b5563"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
                      title="Ver detalles"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mensaje por si un filtro no tiene resultados */}
          {pedidosFiltrados.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              No hay pedidos en este estado.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}