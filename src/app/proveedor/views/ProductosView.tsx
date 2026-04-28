"use client";
import React, { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

// Datos de prueba basados en tu imagen
const productos = [
  { id: 1, nombre: "Caja de Chocolates Artesanales", categoria: "Gourmet", precio: "$850", stock: 45, estado: "Aprobado" },
  { id: 2, nombre: "Set de Vinos Premium", categoria: "Gourmet", precio: "$2,200", stock: 20, estado: "Aprobado" },
  { id: 3, nombre: "Canasta Gourmet Navideña", categoria: "Gourmet", precio: "$1,500", stock: 30, estado: "Pendiente" },
  { id: 4, nombre: "Kit de Quesos Artesanales", categoria: "Gourmet", precio: "$980", stock: 15, estado: "Rechazado" },
  { id: 5, nombre: "Cena para Dos Premium", categoria: "Experiencias", precio: "$3,200", stock: 10, estado: "Aprobado" },
];

// Colores para los estados
const coloresEstado: Record<string, { bg: string; text: string }> = {
  "Aprobado": { bg: "rgba(34, 197, 94, 0.1)", text: "#16a34a" },
  "Pendiente": { bg: "rgba(234, 179, 8, 0.1)", text: "#ca8a04" },
  "Rechazado": { bg: "rgba(239, 68, 68, 0.1)", text: "#dc2626" },
};

export default function ProductosView() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* Cabecera con botón */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button 
          onClick={() => setModalAbierto(true)}
          style={{ 
            background: "#9B2335", color: "white", border: "none", borderRadius: "8px",
            padding: "0.6rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem",
            fontWeight: 500, cursor: "pointer", fontFamily: "'Inter', sans-serif"
          }}
        >
          <Plus size={18} /> Crear Producto
        </button>
      </div>

      {/* Tabla de Productos */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              {["PRODUCTO", "CATEGORÍA", "PRECIO", "STOCK", "ESTADO", "ACCIONES"].map((header) => (
                <th key={header} style={{ 
                  padding: "1rem 1.5rem", fontSize: "0.75rem", fontWeight: 600, 
                  color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" 
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "1rem 1.5rem", fontWeight: 500, color: "#111827", fontSize: "0.9rem" }}>{prod.nombre}</td>
                <td style={{ padding: "1rem 1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>{prod.categoria}</td>
                <td style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>{prod.precio}</td>
                <td style={{ padding: "1rem 1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>{prod.stock}</td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <span style={{ 
                    background: coloresEstado[prod.estado].bg, color: coloresEstado[prod.estado].text,
                    padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600
                  }}>
                    {prod.estado}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: 0 }}><Edit size={18} /></button>
                    <button style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0 }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL (Ventana Flotante) para Crear Producto */}
      {modalAbierto && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0, 0, 0, 0.4)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999 // Para que aparezca encima de todo
        }}>
          <div style={{
            background: "white", borderRadius: "16px", width: "100%", maxWidth: "500px",
            padding: "2rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "'Inter', sans-serif"
          }}>
            {/* Cabecera del Modal */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#111827" }}>Crear Producto</h2>
                <p style={{ margin: "0.25rem 0 0 0", color: "#6b7280", fontSize: "0.9rem" }}>Completa los datos del nuevo producto.</p>
              </div>
              <button onClick={() => setModalAbierto(false)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Nombre del Producto</label>
                <input type="text" placeholder="Nombre" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Categoría</label>
                <select style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", background: "white" }}>
                  <option>Seleccionar</option>
                  <option>Gourmet</option>
                  <option>Experiencias</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Precio</label>
                  <input type="number" placeholder="0.00" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Stock</label>
                  <input type="number" placeholder="0" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Descripción</label>
                <textarea rows={4} placeholder="Descripción del producto" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", resize: "none" }} />
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "0.5rem" }}>
              <button onClick={() => setModalAbierto(false)} style={{ padding: "0.6rem 1.2rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 500, cursor: "pointer" }}>
                Cancelar
              </button>
              <button style={{ padding: "0.6rem 1.2rem", background: "#9B2335", border: "none", borderRadius: "8px", color: "white", fontWeight: 500, cursor: "pointer" }}>
                Crear Producto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}