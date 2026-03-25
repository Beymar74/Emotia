"use client";
import React, { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

// Lista de módulos en ESPAÑOL
const modulos = [
  "Dashboard", "Usuarios", "Proveedores", "Categorías", "Productos", 
  "Pedidos", "IA", "Gamificación", "Reportes", "Roles", "Auditoría", "Configuración"
];

// Datos mockeados actualizados con las llaves en español
const rolesMock = [
  {
    id: 1,
    rol: "Administrador",
    usuarios: 3,
    permisos: { Dashboard: true, Usuarios: true, Proveedores: true, Categorías: true, Productos: true, Pedidos: true, IA: true, Gamificación: true, Reportes: true, Roles: true, Auditoría: true, Configuración: true }
  },
  {
    id: 2,
    rol: "Moderador",
    usuarios: 5,
    permisos: { Dashboard: true, Usuarios: true, Proveedores: true, Categorías: false, Productos: true, Pedidos: true, IA: false, Gamificación: false, Reportes: true, Roles: false, Auditoría: false, Configuración: false }
  },
  {
    id: 3,
    rol: "Soporte",
    usuarios: 8,
    permisos: { Dashboard: true, Usuarios: true, Proveedores: false, Categorías: false, Productos: false, Pedidos: false, IA: true, Gamificación: false, Reportes: false, Roles: false, Auditoría: false, Configuración: false }
  }
];

// Componente visual para el Checkbox personalizado de la tabla principal
const CustomCheckbox = ({ checked }: { checked: boolean }) => (
  <div style={{
    width: "18px", height: "18px", borderRadius: "4px", margin: "0 auto",
    background: checked ? "#111827" : "transparent",
    border: checked ? "none" : "1px solid #d1d5db",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s"
  }}>
    {checked && (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    )}
  </div>
);

// Componente visual de Switch (Toggle) para usar dentro del Modal
const CustomToggle = ({ isOn }: { isOn: boolean }) => (
  <div style={{
    width: "36px", height: "20px", borderRadius: "10px",
    background: isOn ? "#9B2335" : "#e5e7eb",
    display: "flex", alignItems: "center", padding: "2px",
    boxSizing: "border-box"
  }}>
    <div style={{
      width: "16px", height: "16px", borderRadius: "50%", background: "white",
      transform: isOn ? "translateX(16px)" : "translateX(0)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      transition: "transform 0.2s"
    }} />
  </div>
);

export default function RolesView() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Botón de Crear Rol */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button 
          onClick={() => setModalAbierto(true)}
          style={{ 
            background: "#701030", color: "white", border: "none", borderRadius: "8px",
            padding: "0.6rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem",
            fontWeight: 500, cursor: "pointer", fontSize: "0.9rem", transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#5a0c26"}
          onMouseLeave={e => e.currentTarget.style.background = "#701030"}
        >
          <Plus size={18} /> Crear Rol
        </button>
      </div>

      {/* Contenedor de la Tabla */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left" }}>ROL</th>
                {modulos.map((modulo) => (
                  <th key={modulo} style={{ padding: "1.2rem 0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textAlign: "center", width: "65px" }}>{modulo}</th>
                ))}
                <th style={{ padding: "1.2rem 1.5rem", fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rolesMock.map((role) => (
                <tr key={role.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "1.2rem 1.5rem", textAlign: "left" }}>
                    <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>{role.rol}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "0.2rem" }}>{role.usuarios} usuarios</div>
                  </td>
                  {modulos.map((modulo) => (
                    <td key={`${role.id}-${modulo}`} style={{ padding: "1.2rem 0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                      <CustomCheckbox checked={role.permisos[modulo as keyof typeof role.permisos]} />
                    </td>
                  ))}
                  <td style={{ padding: "1.2rem 1.5rem", textAlign: "right", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <button style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: 0 }}><Edit size={16} /></button>
                      <button style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0 }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (Ventana Flotante) para Crear Rol */}
      {modalAbierto && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, backdropFilter: "blur(2px)"
        }}>
          <div style={{
            background: "white", borderRadius: "16px", width: "100%", maxWidth: "550px",
            padding: "2rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "'Inter', sans-serif",
            maxHeight: "90vh", overflowY: "auto"
          }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#111827", fontWeight: 700 }}>Crear Nuevo Rol</h2>
                <p style={{ margin: "0.25rem 0 0 0", color: "#6b7280", fontSize: "0.9rem" }}>Define el nombre del rol y asigna sus permisos de acceso.</p>
              </div>
              <button onClick={() => setModalAbierto(false)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: "4px" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>Nombre del Rol</label>
                <input type="text" placeholder="Ej. Editor de Catálogo" style={{ padding: "0.85rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.95rem" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>Permisos del Sistema</label>
                <div style={{ 
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", 
                  background: "#f9fafb", padding: "1.5rem", borderRadius: "8px", border: "1px solid #f3f4f6" 
                }}>
                  {modulos.map((modulo, idx) => (
                    <div key={modulo} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.9rem", color: "#4b5563", fontWeight: 500 }}>{modulo}</span>
                      <CustomToggle isOn={idx < 4} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "0.5rem", borderTop: "1px solid #f3f4f6", paddingTop: "1.5rem" }}>
              <button onClick={() => setModalAbierto(false)} style={{ padding: "0.7rem 1.2rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 600, cursor: "pointer" }}>
                Cancelar
              </button>
              <button style={{ padding: "0.7rem 1.2rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer" }}>
                Guardar Rol
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}